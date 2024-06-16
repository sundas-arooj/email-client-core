const express = require('express');
const router = express.Router();
const webhookController = require('../controller/webhookController');

router.post('/outlook-notification', webhookController.outlookNotification);

module.exports = router;
