# Blog Website with MERN Stack

A blogging platform built with the MERN stack (MongoDB, Express, React, Node.js) with authentication.

## Features

- User registration and login
- JWT authentication
- Secure password hashing with bcrypt
- Form validation with express-validator
- Responsive UI

## Technology Stack

### Backend
- Node.js
- Express
- MongoDB (mongoose)
- JWT for authentication
- bcrypt for password hashing
- express-validator for validation

### Frontend
- React (Vite)
- React Router DOM
- Axios for API requests

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=your_jwt_secret_key_here
```

### Running the application

1. Start MongoDB
```bash
# Start MongoDB (the command may vary based on your setup)
mongod
```

2. Start the backend server
```bash
cd backend
npm run dev
```

3. Start the frontend development server
```bash
cd frontend
npm run dev
```

4. Access the application at http://localhost:5173

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Log in a user
- GET /api/auth/user - Get current user (protected) 