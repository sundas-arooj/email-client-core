const express = require('express');
const router = express.Router();
const emailController = require('../controller/emailController');

router.get('/emails', emailController.getEmails);

module.exports = router;
