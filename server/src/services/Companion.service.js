const Companion = require('../db/models/companion');
const User = require('../db/models/user');

class CompanionService {
  // Добавить компаньона
  static async addCompanion(roadId, userId) {
    const existing = await Companion.findOne({ where: { roadId, userId } });
    if (existing) {
      throw new Error('Компаньон уже добавлен');
    }
    return Companion.create({ roadId, userId });
  }

  // Удалить компаньона
  static async removeCompanion(roadId, userId) {
    const companion = await Companion.findOne({ where: { roadId, userId } });
    if (!companion) throw new Error('Компаньон не найден');
    return companion.destroy();
  }

  // Получить всех компаньонов для маршрута
  static async getByRoadId(roadId) {
    return Companion.findAll({
      where: { roadId },
      include: {
        model: User,
        attributes: ['id', 'username', 'email'],
      },
    });
  }
}

module.exports = CompanionService;
