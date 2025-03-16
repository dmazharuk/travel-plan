const { Road, User } = require('../db/models');

class RoadService {
  //* Получить все маршруты
  static async getAll() {
    return await Road.findAll({
      include: [
        {
          model: User, // Пользователь, создавший маршрут
          as: 'author',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
          as: 'companions',
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
          as: 'author',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
          as: 'companions',
          through: { attributes: [] }, // Исключаем промежуточную таблицу
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
  }

  //* Создать новый маршрут
  static async create(data) {
    const formattedData = {
      ...data,
      tripStartDate: data.tripStartDate ? new Date(data.tripStartDate) : null,
      tripEndDate: data.tripEndDate ? new Date(data.tripEndDate) : null,
      checkInDate: data.checkInDate ? new Date(data.checkInDate) : null,
      checkOutDate: data.checkOutDate ? new Date(data.checkOutDate) : null,
      transportInfo: data.transportInfo || {},
      visitDates: Array.isArray(data.visitDates) ? data.visitDates : [],
    };

    return await Road.create(formattedData);
  }

  //* Обновить маршрут по ID
  static async update(id, data) {
    const road = await Road.findByPk(id);

    if (!road) {
      return null;
    }

    const fields = [
      'city',
      'country',
      'transport',
      'visibility',
      'transportInfo',
      'routeInfo',
      'accommodation',
      'checkInDate',
      'checkOutDate',
      'visitDates',
      'tripStartDate',
      'tripEndDate',
    ];

    fields.forEach((field) => {
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
