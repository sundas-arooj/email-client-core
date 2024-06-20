const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/register', userController.register);
router.get('/:email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);

module.exports = router;
