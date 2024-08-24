# BlogHub Platform

## Project Overview

BlogHub is a full-stack blog platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a comprehensive and secure environment where users can create, update, delete, and view blogs. Additionally, users can leave comments on blogs and manage their profiles by updating passwords. The platform is fully authenticated using JSON Web Tokens (JWT) and passwords are securely hashed using bcrypt. The user can upload photo when creating blog using multer middleware.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Password Hashing**: All user passwords are hashed using bcrypt for enhanced security.
- **Blog Management**:
  - **Create**: Users can create new blogs.
  - **Read**: View all blogs or a specific blog by its ID.
  - **Update**: Edit existing blogs.
  - **Delete**: Remove blogs from the platform.
  - **Upload**: Upload photo when creating blog using Multer middleware.
- **Commenting System**: Users can add comments to specific blogs.
- **Profile Management**: Users can update their passwords.
- **Responsive Design**: The platform is fully responsive and works on various devices.

## Technologies Used

- **Frontend**: 
  - Vite + React
  - Context API for state management
  - React Router DOM for navigation
  - Tailwind for CSS design
- **Backend**: 
  - Node.js
  - Express.js
- **Database**: 
  - MongoDB with Mongoose
- **Authentication**: 
  - JSON Web Tokens (JWT)
  - Bcrypt for password hashing
- **Upload**:
  - Upload photo using Multer middleware
- **Deployment**: 
  - Render https://bloghub-client.onrender.com

## Installation and Setup

### Prerequisites

- Node.js installed
- MongoDB database

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bloghub-backend.git
   cd bloghub-backend
2. Install dependencies:
   npm install
3. Create a .env file with the following environment variables:
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
4. Start the backend server:
   npm run start

### Frontend Setup

1. Navigate to the frontend directory:
   cd bloghub-client
2. Install dependencies:
   npm install
3. Create a .env file with the following environment variable:
   REACT_APP_API_URL=<your-backend-api-url>
   REACT_APP_IMAGE_URL=<your-backend-image-url>
4. Start the frontend server:
   npm run dev

## Deployment

The project is deployed on Render. You can access the live version of the platform at: Render

Deployed link: https://bloghub-client.onrender.com


## Contribution

Contributions are welcome! If you have suggestions or improvements, please follow these steps:

1: Fork the repository.
2: Create a new branch with a descriptive name for your feature or fix: 
   git checkout -b feature/your-feature-name
3: Make your changes and commit them with clear commit messages:
   git commit -m "Add a descriptive commit message"
4: Push your branch to your forked repository:
   git push origin feature/your-feature-name
5: Open a Pull Request on the original repository with a detailed explanation of your changes.

## License

This project is open-source and available under the MIT License.
