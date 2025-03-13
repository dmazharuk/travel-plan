const { Road, User, Companion } = require('../db/models');

class RoadService {
  //* Получить все маршруты
  static async getAll() {
    return await Road.findAll({
      include: [
        {
          model: User, // Пользователь, создавший маршрут
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
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
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User, // Список спутников
          through: { attributes: [] }, // Исключаем промежуточную таблицу
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
  }

  //* Создать новый маршрут
  static async create(data) {
    const road = await Road.create(data);
    return await this.getById(road.id);
  }

  //* Обновить маршрут по ID
  static async update(id, data) {
    const road = await this.getById(id);
    if (!road) {
      return null;
    }
    road.country = data.country || road.country;
    road.city = data.city || road.city;
    road.transport = data.transport || road.transport;
    road.transportInfo = data.transportInfo || road.transportInfo;
    road.routeInfo = data.routeInfo || road.routeInfo;
    road.visibility = data.visibility || road.visibility;
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

  //* Добавить пользователя в спутники маршрута
  static async addCompanion(roadId, userId) {
    const road = await this.getById(roadId);
    if (!road) {
      return null;
    }
    const companion = await Companion.create({ roadId, userId });
    return companion;
  }

  //* Удалить пользователя из спутников маршрута
  static async removeCompanion(roadId, userId) {
    const companion = await Companion.findOne({ where: { roadId, userId } });
    if (!companion) {
      return null;
    }
    await companion.destroy();
    return companion;
  }
}

module.exports = RoadService;