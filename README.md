# Node.js Express Backend with ES Modules

Professional Node.js backend setup with Express and MongoDB using ES Modules.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and configure your environment variables
4. Run `npm run dev` to start the development server

## npm Commands
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier to format code

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## API Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user