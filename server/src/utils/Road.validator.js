/**
 * Класс для валидации данных дороги
 */
class RoadValidator {
  /**
   * Валидация данных дороги
   * @param {object} data - Объект данных дороги, который необходимо проверить.
   * @param {string} data.city - Город (обязательное поле).
   * @param {string} data.country - Страна (обязательное поле).
   * @param {string} data.transport - Тип транспорта (обязательное поле).
   * @param {string} data.transportInfo - Информация о транспорте (необязательное поле).
   * @param {string} data.routeInfo - Информация о маршруте (необязательное поле).
   * @param {string} data.visibility - Видимость маршрута (обязательное поле).
   * @returns {object} - Объект, содержащий результат валидации.
   * @returns {boolean} isValid - Флаг, указывающий на валидность данных.
   * @returns {string|null} error - Сообщение об ошибке валидации, если имеется, иначе null.
   */
  static validate(data) {
    const { city, country, transport, visibility } = data;

    //! Проверка валидности поля city
    if (!city || typeof city !== 'string' || city.trim() === '') {
      return {
        isValid: false,
        error: 'City is required and must be a non-empty string.',
      };
    }

    //! Проверка валидности поля country
    if (!country || typeof country !== 'string' || country.trim() === '') {
      return {
        isValid: false,
        error: 'Country is required and must be a non-empty string.',
      };
    }

    //! Проверка валидности поля transport
    if (!transport || !['поезд', 'самолет', 'машина'].includes(transport)) {
      return {
        isValid: false,
        error: 'Transport is required and must be one of: поезд, самолет, машина.',
      };
    }

    //! Проверка валидности поля visibility
    if (!visibility || !['private', 'friends', 'public'].includes(visibility)) {
      return {
        isValid: false,
        error: 'Visibility is required and must be one of: private, friends, public.',
      };
    }

    //* Если все проверки пройдены, возвращаем валидный результат.
    return {
      isValid: true,
      error: null,
    };
  }
}

module.exports = RoadValidator;
