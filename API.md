# API Documentation

## Users

**Create User**

```http
POST /api/users

{ "name": "John Doe", "email": "[EMAIL_ADDRESS]", "phone": "1234567890" }
```

**Get User by ID**

```http
GET /api/users/1
```

## Books

**Create Book**

```http
POST /api/books

{ "title": "Book Title", "author": "Author Name", "isbn": "123-4567890123", "quantity": 10 }
```

**Get All Books**

```http
GET /api/books
```

**Get Book by ID**

```http
GET /api/books/1
```

**Update Book**

```http
PUT /api/books/1

{ "quantity": 8 }
```

**Delete Book**

```http
DELETE /api/books/1
```

## Borrowings

**Borrow Book**

```http
POST /api/borrowings

{ "userId": 1, "bookId": 1, "dueDate": "2024-12-31" }
```

**Get Borrowing Details**

```http
GET /api/borrowings/1
```

**Return Book**

```http
PUT /api/borrowings/1/return
```
