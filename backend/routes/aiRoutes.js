const express = require('express');
const router = express.Router();
const { 
  getAIRecommendations, 
  getEmployeeRanking,
  getTrainingSuggestions 
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getAIRecommendations);
router.post('/ranking', protect, getEmployeeRanking);
router.post('/training', protect, getTrainingSuggestions);

module.exports = router;