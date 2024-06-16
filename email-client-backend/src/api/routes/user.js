const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/register', userController.register);
router.get('/:id', userController.getUserById);
router.get('/:email', userController.getUserByEmail);

module.exports = router;
