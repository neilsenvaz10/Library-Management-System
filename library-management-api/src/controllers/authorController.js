const authorService = require('../services/authorService');
const { successResponse } = require('../utils/response');

const createAuthor = async (req, res, next) => {
  try {
    const author = await authorService.createAuthor(req.body);
    return successResponse(res, 201, 'Author created successfully', author);
  } catch (error) {
    next(error);
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorService.getAllAuthors();
    return successResponse(res, 200, 'Authors retrieved successfully', authors);
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req, res, next) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'Author retrieved successfully', author);
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const author = await authorService.updateAuthor(req.params.id, req.body);
    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'Author updated successfully', author);
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const author = await authorService.deleteAuthor(req.params.id);
    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'Author deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
