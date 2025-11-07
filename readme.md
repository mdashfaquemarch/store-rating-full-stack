# Store Rating System Backend

Backend service for managing store ratings and reviews with role-based authentication.

## Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control: System Admin, Store Owner, Normal User
- Secure password handling
- Refresh token mechanism

### 🏪 Store Management

- CRUD operations for stores
- Store owner assignment
- Rating aggregation
- Search and filtering

### ⭐ Rating System

- Store ratings (1-5 stars)
- One rating per user per store
- Rating statistics
- User rating history

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Architecture:** Repository Pattern

## Project Structure

```
server/
├── prisma/              # Database schema and migrations
├── src/
│   ├── configs/         # Application configurations
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middlewares
│   ├── repositories/    # Data access layer
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper utilities
│   └── validators/      # Input validation
```

## API Routes

### Authentication

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/update-password` - Update password

### Stores

- `GET /api/v1/store` - List stores
- `GET /api/v1/store/:id` - Store details

### Ratings

- `POST /api/v1/rating/store/:storeId` - Submit rating
- `GET /api/v1/rating/store` - View store ratings
- `GET /api/v1/rating/:storeId/average-rating` - Get average rating

### Admin Dashboard

- `GET /api/v1/dashboard/admin` - System statistics
- `GET /api/v1/dashboard/store` - Store metrics

# Setup and Installation Guide

## Backend Setup

### 1. Navigate to the Server Directory

Open your terminal and navigate to the backend/server folder:

```bash
cd server
```

### 2. Install Dependencies

Install all required packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server` directory if it doesn't exist. Add your database connection string and any other necessary environment variables.

**Example `.env` file:**

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
```

### 4. Run Database Migrations

If using Prisma, run the migrations to set up the database schema:

```bash
npx prisma migrate dev
```

### 5. Start the Backend Server

Start the backend server:

```bash
npm run dev
```

The server should now be running at: http://localhost:5000

## Frontend Setup

### 1. Navigate to the Client Directory

Open a new terminal window and navigate to the frontend/client folder:

```bash
cd client
```

### 2. Install Dependencies

Install all required packages:

```bash
npm install
```

### 3. Start the Frontend Development Server

Start the frontend development server:

```bash
npm start
```

The frontend should now be running at: http://localhost:3000

## Accessing the Application

1. Open your web browser and go to **http://localhost:3000** to access the frontend.
2. The frontend will communicate with the backend running on **http://localhost:5000**.

Both servers should now be running and ready for development.