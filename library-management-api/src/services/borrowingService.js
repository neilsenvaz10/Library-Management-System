const User = require('../models/User');
const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');

const borrowBook = async (userId, bookId, dueDate) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const book = await Book.findById(bookId);
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  if (book.availableQuantity <= 0) {
    const error = new Error('Book not available for borrowing');
    error.statusCode = 400;
    throw error;
  }

  const borrowing = await Borrowing.create({
    userId,
    bookId,
    dueDate: new Date(dueDate),
    status: 'BORROWED',
  });

  book.availableQuantity -= 1;
  await book.save();

  return borrowing;
};

const getBorrowingDetails = async (id) => {
  return await Borrowing.findById(id).populate('user').populate('book');
};

const returnBook = async (id) => {
  const borrowing = await Borrowing.findById(id);
  if (!borrowing) {
    const error = new Error('Borrowing record not found');
    error.statusCode = 404;
    throw error;
  }

  if (borrowing.status === 'RETURNED') {
    const error = new Error('Book already returned');
    error.statusCode = 400;
    throw error;
  }

  borrowing.status = 'RETURNED';
  borrowing.returnedAt = new Date();
  await borrowing.save();

  const book = await Book.findById(borrowing.bookId);
  if (book) {
    book.availableQuantity += 1;
    await book.save();
  }

  return borrowing;
};

module.exports = {
  borrowBook,
  getBorrowingDetails,
  returnBook,
};
