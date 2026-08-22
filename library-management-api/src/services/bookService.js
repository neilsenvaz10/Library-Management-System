const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');

const createBook = async (bookData) => {
  return await Book.create(bookData);
};

const getAllBooks = async () => {
  return await Book.find();
};

const getBookById = async (id) => {
  return await Book.findById(id);
};

const updateBook = async (id, bookData) => {
  return await Book.findByIdAndUpdate(id, bookData, { new: true });
};

const deleteBook = async (id) => {
  // Check if book has active borrowings
  const activeBorrowings = await Borrowing.findOne({
    bookId: id, status: 'BORROWED'
  });

  if (activeBorrowings) {
    const error = new Error('Cannot delete book with active borrowings');
    error.statusCode = 409;
    throw error;
  }

  return await Book.findByIdAndDelete(id);
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
