const bookService = require('../services/bookService');
const { successResponse } = require('../utils/response');

const createBook = async (req, res, next) => {
  try {
    const bookData = { ...req.body, availableQuantity: req.body.quantity };
    const book = await bookService.createBook(bookData);
    return successResponse(res, 201, 'Book created successfully', book);
  } catch (error) {
    if (error.code === 'P2002') {
      error.statusCode = 409;
      error.message = 'ISBN already exists';
    }
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    return successResponse(res, 200, 'Books retrieved successfully', books);
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'Book retrieved successfully', book);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    return successResponse(res, 200, 'Book updated successfully', book);
  } catch (error) {
    if (error.code === 'P2025') {
      error.statusCode = 404;
      error.message = 'Book not found';
    } else if (error.code === 'P2002') {
      error.statusCode = 409;
      error.message = 'ISBN already exists';
    }
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    return successResponse(res, 200, 'Book deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      error.statusCode = 404;
      error.message = 'Book not found';
    }
    next(error);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
