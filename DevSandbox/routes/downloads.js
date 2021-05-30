const express = require('express');
const router = express.Router();

const downloadController = require('../controllers/downloadController');

router.get('/balance', downloadController.balanceHistory);

module.exports = router;