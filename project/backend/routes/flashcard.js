const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

router.post('/generate', flashcardController.generateFlashcards);
router.get('/default', flashcardController.getDefaultFlashcards);

module.exports = router;