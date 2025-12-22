const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcqController');

router.post('/generate', mcqController.generateMCQs);
router.post('/validate', mcqController.validateAnswer);
router.get('/default', mcqController.getDefaultMCQs);

module.exports = router;