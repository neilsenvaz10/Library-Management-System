const userService = require('../services/userService');
const { successResponse } = require('../utils/response');

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 201, 'User created successfully', user);
  } catch (error) {
    if (error.code === 'P2002') {
      error.statusCode = 409;
      error.message = 'Email already exists';
    }
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = 'Email already exists';
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
