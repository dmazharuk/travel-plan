class RoadValidator {
  static validate(data) {
    const { city, country, transport, visibility, tripStartDate, tripEndDate } = data;

    // Проверка обязательных полей
    const errors = [];
    
    if (!city?.trim()) errors.push('Город обязателен');
    if (!country?.trim()) errors.push('Страна обязательна');
    
    if (!['поезд', 'самолет', 'машина'].includes(transport)) {
      errors.push('Некорректный тип транспорта');
    }
    
    if (!['private', 'friends', 'public'].includes(visibility)) {
      errors.push('Некорректный уровень видимости');
    }
    
    if (!tripStartDate || isNaN(new Date(tripStartDate))) {
      errors.push('Некорректная дата начала поездки');
    }
    
    if (!tripEndDate || isNaN(new Date(tripEndDate))) {
      errors.push('Некорректная дата окончания поездки');
    }
    
    if (errors.length > 0) {
      return { isValid: false, error: errors.join(', ') };
    }

    return { isValid: true, error: null };
  }
}

module.exports = RoadValidator;