const express = require('express');
const router = express.Router();
const folderController = require('../controller/folderController');

router.get('/:email', folderController.getFoldersByEmail);

module.exports = router;
