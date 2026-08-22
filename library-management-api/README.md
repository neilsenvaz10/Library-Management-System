# Library Management REST API

A Node.js and Express REST API backend for a library management system, using PostgreSQL as the relational database and Prisma as the ORM.

## Features

- **User Management**: Create and retrieve user accounts.
- **Book Management**: Complete CRUD operations for books (Create, Read, Update, Delete).
- **Borrowing System**: Borrow and return books with transactional integrity, ensuring valid user and book IDs, and tracking available quantities.
- **Validation**: Joi-based request validation.
- **Error Handling**: Centralized error handling and standardized JSON responses.

## Tech Stack

- **Node.js** & **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Joi** (Validation)
- **Dotenv** (Environment variables)

## Database Schema

- **User**: Represents a library user (`id`, `name`, `email`, `phone`, `role`, `createdAt`).
- **Book**: Represents a book (`id`, `title`, `author`, `category`, `isbn`, `quantity`, `availableQuantity`, `createdAt`, `updatedAt`).
- **Borrowing**: Represents a book borrowing record, establishing a relationship between Users and Books (`id`, `userId`, `bookId`, `borrowedAt`, `dueDate`, `returnedAt`, `status`).

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Installation

1. Navigate to the project directory:
   **Important:** All subsequent commands must be run from inside this `backend` folder.
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and update the `DATABASE_URL` with your local PostgreSQL credentials.
   ```bash
   cp .env.example .env
   ```

4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations to create the schema:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

## API Documentation

### Users
- `POST /api/users` - Create a user
- `GET /api/users/:id` - Get a user by ID

### Books
- `POST /api/books` - Create a book
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a book by ID
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Borrowings
- `POST /api/borrowings` - Borrow a book
- `GET /api/borrowings/:id` - Get borrowing details
- `PUT /api/borrowings/:id/return` - Return a book

## Example Requests/Responses

### Create a Book

**Request:** `POST /api/books`
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": null,
    "isbn": "9780132350884",
    "quantity": 10,
    "availableQuantity": 10,
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
}
```

### Borrow a Book

**Request:** `POST /api/borrowings`
```json
{
  "userId": 1,
  "bookId": 1,
  "dueDate": "2023-11-10T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "bookId": 1,
    "borrowedAt": "2023-10-27T10:05:00.000Z",
    "dueDate": "2023-11-10T10:00:00.000Z",
    "returnedAt": null,
    "status": "BORROWED"
  }
}
```

## Postman Testing Instructions

1. Import a new collection in Postman.
2. Set the base URL to `http://localhost:3000/api`.
3. Test endpoints sequentially:
   - First, test `GET /api/books` to retrieve the seeded books.
   - Next, `POST /api/users` and `POST /api/books` to ensure creation logic works.
   - Then, use the `id` values of created users and books to test `POST /api/borrowings`.
   - Finally, test the `PUT /api/borrowings/:id/return` endpoint.
4. Intentionally pass incorrect data (e.g., negative quantity or non-existent book ID) to verify error responses.
