const { Road, User } = require('../db/models');

class RoadService {
  //* Получить все маршруты
  static async getAll() {
    return await Road.findAll({
      include: [
        {
          model: User, // Пользователь, создавший маршрут
          as: "author",
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
          as: "companions",
          through: { attributes: [] }, // Исключаем промежуточную таблицу
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
  }

  //* Найти маршрут по ID
  static async getById(id) {
    return await Road.findByPk(id, {
      include: [
        {
          model: User, // Пользователь, создавший маршрут
          as: "author",
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
          as: "companions",
          through: { attributes: [] }, // Исключаем промежуточную таблицу
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
  }

  //* Создать новый маршрут
  static async create(data) {
    return await Road.create({
      city: data.city,
      country: data.country,
      transport: data.transport,
      visibility: data.visibility,
      transportInfo: data.transportInfo,
      routeInfo: data.routeInfo,
      accommodation: data.accommodation,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      visitDates: data.visitDates,
      tripStartDate: data.tripStartDate,
      tripEndDate: data.tripEndDate,
      userId: data.userId
    });
   
  }

  //* Обновить маршрут по ID
  static async update(id, data) {
    const road = await Road.findByPk(id);

    if (!road) {
      return null;
    }

    const fields = [
      'city', 'country', 'transport', 'visibility',
      'transportInfo', 'routeInfo', 'accommodation',
      'checkInDate', 'checkOutDate', 'visitDates',
      'tripStartDate', 'tripEndDate'
    ];

    fields.forEach(field => {
      if (data[field] !== undefined) road[field] = data[field];
    });

    await road.save();
    return road;
  }

  //* Удалить маршрут по ID
  static async delete(id) {
    const road = await this.getById(id);
    if (!road) {
      return null;
    }
    await road.destroy();
    return road;
  }

  
}

module.exports = RoadService;
