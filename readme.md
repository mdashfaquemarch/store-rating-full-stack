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