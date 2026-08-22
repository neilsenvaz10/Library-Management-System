const Author = require('../models/Author');

const createAuthor = async (authorData) => {
  return await Author.create(authorData);
};

const getAllAuthors = async () => {
  return await Author.find();
};

const getAuthorById = async (id) => {
  return await Author.findById(id);
};

const updateAuthor = async (id, authorData) => {
  return await Author.findByIdAndUpdate(id, authorData, { new: true });
};

const deleteAuthor = async (id) => {
  return await Author.findByIdAndDelete(id);
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
