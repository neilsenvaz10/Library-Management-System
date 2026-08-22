const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const validate = require('../middleware/validation');
const { authorSchema, updateAuthorSchema } = require('../middleware/schemas');

router.post('/', validate(authorSchema), authorController.createAuthor);
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);
router.put('/:id', validate(updateAuthorSchema), authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
