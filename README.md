# Library Management System API

A robust Library Management System built with Express.js and MongoDB. This system provides comprehensive APIs for managing users, books, and borrowing operations.

## Features

- User Management
- Book Management
- Borrowing and Returning Books
- Role-based access control (User & Admin)


## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Joi
- **Environment Variables**: dotenv

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory based on the `.env.example`:

```bash
# .env
MONGO_URI="mongodb://localhost:27017/library_management"
PORT=3000
```

### 4. Configure MongoDB

Ensure you have a MongoDB instance running and update the `MONGO_URI` in the `.env` file with your connection string.

### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Documentation

Please refer to the [API.md](./API.md) file for complete API documentation and endpoint details.

## Error Handling

The API uses a centralized error handling middleware that returns consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

Common Error Codes:

- `400`: Bad Request (Validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., Duplicate email, Book already returned)
- `500`: Internal Server Error
