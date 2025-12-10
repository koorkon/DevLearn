const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { upload } = require('../middleware/upload');

// Upload file and generate summary
router.post('/upload', upload.single('file'), summaryController.uploadAndSummarize);

// Generate summary from text
router.post('/text', summaryController.summarizeText);

module.exports = router;