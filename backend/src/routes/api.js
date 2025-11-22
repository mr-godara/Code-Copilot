const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Health check
router.get('/health', codeController.healthCheck);

// Get supported languages
router.get('/languages', codeController.getLanguages);

// Generate code
router.post('/generate', codeController.generate);

// Get generation history
router.get('/history', codeController.getHistory);

module.exports = router;
