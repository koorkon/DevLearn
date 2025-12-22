const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const upload = require('../middleware/upload'); 

router.post('/upload', upload.single('file'), summaryController.uploadAndSummarize);

module.exports = router;