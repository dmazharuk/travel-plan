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
    // Для создания нового маршрута пропускаем поля, не требующие валидации
    const { city, country, transport, visibility, transportInfo, routeInfo, userId } = data;
    const road = await Road.create({
      city,
      country,
      transport,
      visibility,
      transportInfo,
      routeInfo,
      userId,
    });
    return await this.getById(road.id);
  }

  //* Обновить маршрут по ID
  static async update(id, data) {
    const road = await this.getById(id);
    if (!road) {
      return null;
    }

    // Обновляем только поля, если они были переданы, иначе оставляем старые значения
    road.city = data.city || road.city;
    road.country = data.country || road.country;
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
  // static async addCompanion(roadId, userId) {
  //   const road = await this.getById(roadId);
  //   if (!road) {
  //     return null;
  //   }
  //   const companion = await Companion.create({ roadId, userId });
  //   return companion;
  // }

  //* Удалить пользователя из спутников маршрута
  // static async removeCompanion(roadId, userId) {
  //   const companion = await Companion.findOne({ where: { roadId, userId } });
  //   if (!companion) {
  //     return null;
  //   }
  //   await companion.destroy();
  //   return companion;
  // }
}

module.exports = RoadService;
