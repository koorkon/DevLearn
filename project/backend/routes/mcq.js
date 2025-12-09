const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcqController');

// Generate MCQs from topic
router.post('/generate', mcqController.generateMCQs);

// Validate answer
router.post('/validate', mcqController.validateAnswer);

// Get default MCQs (fallback)
router.get('/default', mcqController.getDefaultMCQs);

module.exports = router;