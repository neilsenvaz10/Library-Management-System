const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const validate = require('../middleware/validation');
const { borrowingSchema } = require('../middleware/schemas');

router.post('/', validate(borrowingSchema), borrowingController.borrowBook);
router.get('/:id', borrowingController.getBorrowingDetails);
router.put('/:id/return', borrowingController.returnBook);

module.exports = router;
