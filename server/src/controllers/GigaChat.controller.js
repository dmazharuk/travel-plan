const GigaChatService = require("../services/GigaChatApi.service");
const formatResponse = require("../utils/formatResponse");



class GigaChatController {
  static async getRecommendations(req, res) {
    const { city, type} = req.body;
  
    // const {visitDates} = req.body;
    console.log(city, type, 'city, type');
    if (!city) {
      return res.status(400).json(formatResponse(400, "Город не указан"));
    }

    try {
      const recommendations = await GigaChatService.getRecommendations(city, type);
      res.status(200).json(formatResponse(200, "Рекомендации получены", recommendations));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }
}

module.exports = GigaChatController;
