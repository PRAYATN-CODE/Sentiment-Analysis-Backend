import express from 'express';
import {
    getUsers,
    loginUser,
    signupUser,
    updateUserProfile
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/').get(authMiddleware, getUsers);
router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);
router.route('/profile').put(authMiddleware, upload.single('profile-image'), updateUserProfile);

export default router;