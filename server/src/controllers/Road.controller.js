const RoadService = require('../services/Road.service');
const formatResponse = require('../utils/formatResponse');
const isValidId = require('../utils/isValidId');
const RoadValidator = require('../utils/Road.validator');

class RoadController {
  // получение всех маршрутов
  static async getAllRoads(req, res) {
    try {
      const roads = await RoadService.getAll();
      if (roads.length === 0) {
        return res.status(200).json(formatResponse(200, 'Маршруты не найдены', []));
      }
      res.status(200).json(formatResponse(200, 'Маршруты найдены', roads));
    } catch ({ message }) {
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  // получение маршрута по id
  static async getRoadById(req, res) {
    const { id } = req.params;
    const { user } = res.locals;
    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Неверный id маршрута'));
    }
    try {
      const road = await RoadService.getById(Number(id));
      if (!road) {
        return res.status(404).json({ message: 'Маршрут не найден' });
      }

      if (road.visibility === 'private' && road.author.id !== user.id) {
        return res.status(403).json(formatResponse(403, 'Маршрут не принадлежит пользователю'));
      }

      res.status(200).json(formatResponse(200, 'Маршрут найден', road));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  // создание маршрута
  static async createRoad(req, res) {
    const { city, 
      country, 
      transport, 
      visibility,
      transportInfo,
      routeInfo,
      accommodation,
      checkInDate,
      checkOutDate,
      visitDates,
      tripStartDate,
      tripEndDate } = req.body;
  
    const { user } = res.locals;
  
    // Если tripStartDate и tripEndDate не переданы, используем данные из transportInfo
    const finalTripStartDate = tripStartDate || transportInfo?.departureTime;
    const finalTripEndDate = tripEndDate || transportInfo?.arrivalTime;
  
    // Валидация данных с использованием измененных дат
    const { isValid, error } = RoadValidator.validate({
      city,
      country,
      transport,
      visibility,
      tripStartDate: finalTripStartDate, // Передаем окончательные даты
      tripEndDate: finalTripEndDate,
      transportInfo,
      checkInDate,
      checkOutDate,
      visitDates, // это не даты, а места посещения!!!
    });
  
    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Неверные данные', null, error));
    }
  
    try {
      const newRoad = await RoadService.create({
        city,
        country,
        transport,
        visibility,
        transportInfo: transportInfo || {},
        routeInfo,
        accommodation,
        checkInDate,
        checkOutDate,
        visitDates: visitDates,
        tripStartDate: finalTripStartDate,  // Добавляем в объект перед записью в БД
        tripEndDate: finalTripEndDate,      // Добавляем в объект перед записью в БД
        userId: user.id
      });
  
      if (!newRoad) {
        return res.status(400).json(formatResponse(400, 'Не удалось создать маршрут'));
      }
      res.status(201).json(formatResponse(201, 'Маршрут создан', newRoad));
    } catch ({ message }) {
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }
  
  // обновление маршрута
  static async updateRoad(req, res) {
    const { id } = req.params;
    const { city, 
      country, 
      transport, 
      visibility,
      transportInfo,
      routeInfo,
      accommodation,
      checkInDate,
      checkOutDate,
      visitDates,
      tripStartDate,
      tripEndDate} = req.body;

    const { user } = res.locals;

    console.log('Received update data:====>', {
      city,
      country,
      transport,
      visibility,
      tripStartDate,
      tripEndDate,
      transportInfo,
      checkInDate,
      checkOutDate,
      visitDates
    });



    const { isValid, error } = RoadValidator.validate({
      city,
    country,
    transport,
    visibility,
    tripStartDate,
    tripEndDate,
    transportInfo,
    checkInDate,
    checkOutDate,
    visitDates
    });
    if (!isValid) {
      console.error('Validation error:', error); 
      return res.status(400).json(formatResponse(400, 'ошибка валидации', null, error));
    }
    try {
      const existingRoad = await RoadService.getById(Number(id));
      if (!existingRoad) {
        return res.status(404).json(formatResponse(400, 'Маршрут не найден'));
      }

      if (existingRoad.userId !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, 'Маршрут не принадлежит пользователю'));
      }
      console.log('existingRoad', existingRoad , 'id', id);
      const updatedRoad = await RoadService.update(Number(id), {
        city,
        country,
        transport,
        visibility,
        transportInfo: transportInfo || existingRoad.transportInfo,
        routeInfo,
        accommodation,
        checkInDate,
        checkOutDate,
        visitDates: visitDates || existingRoad.visitDates,
        tripStartDate,
        tripEndDate
      });
      res.status(200).json(formatResponse(200, 'Маршрут обновлен', updatedRoad));
    } catch ({ message }) {
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  // удаление маршрута
  static async deleteRoad(req, res) {
    const { id } = req.params;
    const { user } = res.locals;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Неверный id маршрута'));
    }

    try {
      const existingRoad = await RoadService.getById(Number(id));
      if (!existingRoad) {
        return res.status(404).json(formatResponse(404, 'Маршрут не найден'));
      }

      if (existingRoad.userId !== user.id) {
        return res.status(403).json(formatResponse(403, 'Маршрут не принадлежит пользователю'));
      }

      await RoadService.delete(Number(id));
      res.status(200).json(formatResponse(200, 'Маршрут успешно удален'));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = RoadController;
