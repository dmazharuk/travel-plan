class RoadValidator {
  static validate(data) {
    const { 
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
    } = data;

    const errors = [];
    if (!tripStartDate) errors.push('Дата начала обязательна');
if (!tripEndDate) errors.push('Дата окончания обязательна');
if (new Date(tripStartDate) > new Date(tripEndDate)) {
  errors.push('Дата начала должна быть раньше окончания');
}
    // Базовые проверки
    if (!city?.trim()) errors.push('Город обязателен');
    if (!country?.trim()) errors.push('Страна обязательна');
    
    if (!['поезд', 'самолет', 'машина'].includes(transport)) {
      errors.push('Некорректный тип транспорта');
    }
    
    if (!['private', 'friends', 'public'].includes(visibility)) {
      errors.push('Некорректный уровень видимости');
    }

    // Проверка дат поездки
    if (tripStartDate && tripEndDate) {
      if (new Date(tripStartDate) > new Date(tripEndDate)) {
        errors.push('Дата начала не может быть позже даты окончания');
      }
    }

    // Проверка дат проживания
    if (checkInDate && checkOutDate) {
      if (new Date(checkInDate) > new Date(checkOutDate)) {
        errors.push('Дата заезда не может быть позже даты выезда');
      }
    }

    // Проверка transportInfo
    if (transport !== 'машина') {
      if (!transportInfo?.departureTime) {
        errors.push('Время отправления обязательно для поезда/самолета');
      }
      if (!transportInfo?.arrivalTime) {
        errors.push('Время прибытия обязательно для поезда/самолета');
      }
      if (transport === 'самолет' && !transportInfo?.flightNumber) {
        errors.push('Номер рейса обязателен для самолета');
      }
    }

    // Проверка visitDates
    if (visitDates && !Array.isArray(visitDates)) {
      errors.push('Даты посещения должны быть массивом');
    }
    
    if (errors.length > 0) {
      return { isValid: false, error: errors.join(', ') };
    }

    return { isValid: true, error: null };
  }
}

module.exports = RoadValidator;