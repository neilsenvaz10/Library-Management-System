const borrowingService = require('../services/borrowingService');
const { successResponse } = require('../utils/response');

const borrowBook = async (req, res, next) => {
  try {
    const { userId, bookId, dueDate } = req.body;
    const borrowing = await borrowingService.borrowBook(userId, bookId, dueDate);
    return successResponse(res, 201, 'Book borrowed successfully', borrowing);
  } catch (error) {
    next(error);
  }
};

const getBorrowingDetails = async (req, res, next) => {
  try {
    const borrowing = await borrowingService.getBorrowingDetails(req.params.id);
    if (!borrowing) {
      const error = new Error('Borrowing record not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'Borrowing record retrieved successfully', borrowing);
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const borrowing = await borrowingService.returnBook(req.params.id);
    return successResponse(res, 200, 'Book returned successfully', borrowing);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowBook,
  getBorrowingDetails,
  returnBook,
};
