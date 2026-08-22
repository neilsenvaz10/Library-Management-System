const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validate = require('../middleware/validation');
const { bookSchema, updateBookSchema } = require('../middleware/schemas');

router.post('/', validate(bookSchema), bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', validate(updateBookSchema), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
