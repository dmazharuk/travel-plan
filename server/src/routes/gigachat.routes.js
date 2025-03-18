const GigaChatController = require('../controllers/GigaChat.controller');
const router = require('express').Router();

router.post('/recommendations', GigaChatController.getRecommendations);

module.exports = router;
