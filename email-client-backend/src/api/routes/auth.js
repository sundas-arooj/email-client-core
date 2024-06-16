const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/outlook', authController.outlookAuth);
router.get('/outlook/callback', authController.outlookCallback);

module.exports = router;
