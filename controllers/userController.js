import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import uploadImageCloudinary from '../config/uploadImageCloudinary.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  if (!users.length) {
    res.status(404);
    throw new Error('No users found');
  }
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Sign up user
// @route   POST /api/users/signup
// @access  Public
export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await argon2.hash(password);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const profileImage = req.file;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update name if provided
  if (name) user.name = name;

  // Update profile image if provided
  if (profileImage) {
    // Upload new image
    const uploadedImage = await uploadImageCloudinary(profileImage);
    console.log("image url", uploadedImage);

    user.profileImage = uploadedImage.url || "No Url Provided";
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
    },
  });
});