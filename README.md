# Finance Data Processing and Access Control System

A full-stack Finance Dashboard Web Application using the MERN stack (MongoDB, Express, React, Node.js) with role-based access control, analytics, and responsive design.

## Features

- **Role-Based Access Control (RBAC)**:
  - Viewer: Read-only access to analytics summary.
  - Analyst: Read access to analytics + transactions list.
  - Admin: Full CRUD access for transactions and user management.
- **Analytics Dashboard**: Real-time aggregated data using MongoDB pipelines. Shows Net Balance, Category-wise splits, and Monthly trends.
- **Transactions Management**: Add, edit, delete, and filter transactions.
- **User Management**: Admins can change user roles and activate/deactivate users.
- **Modern UI**: Built with React, Tailwind CSS, Recharts for analytics, and Lucide React icons.

## Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Recharts, Axios, Context API
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
- **Deployment Ready**: Modular structure, `.env` driven.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or an Atlas connection string.

### Backend Setup
1. Navigate to `/backend`
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file or use the provided one. Ensure `MONGO_URI` is correct.
3. Seed the admin user:
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Frontend Setup
1. Navigate to `/frontend`
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

### Default Login
- **Email**: admin@finance.com
- **Password**: admin123

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate & get token
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user role/status (Admin)
- `GET /api/transactions` - Get transactions (Filter with query params)
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/analytics/summary` - Get aggregated dashboard data
