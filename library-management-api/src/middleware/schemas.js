const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  role: Joi.string().valid('USER', 'ADMIN'),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().allow('', null),
  role: Joi.string().valid('USER', 'ADMIN'),
}).min(1);

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  category: Joi.string().allow('', null),
  isbn: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const updateBookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  category: Joi.string().allow('', null),
  isbn: Joi.string(),
  quantity: Joi.number().integer().min(1),
}).min(1);

const borrowingSchema = Joi.object({
  userId: Joi.number().integer().required(),
  bookId: Joi.number().integer().required(),
  dueDate: Joi.date().iso().greater('now').required(),
});

const authorSchema = Joi.object({
  name: Joi.string().required(),
  biography: Joi.string().allow('', null),
  birthDate: Joi.date().iso().allow('', null),
});

const updateAuthorSchema = Joi.object({
  name: Joi.string(),
  biography: Joi.string().allow('', null),
  birthDate: Joi.date().iso().allow('', null),
}).min(1);

module.exports = {
  userSchema,
  updateUserSchema,
  bookSchema,
  updateBookSchema,
  borrowingSchema,
  authorSchema,
  updateAuthorSchema,
};
