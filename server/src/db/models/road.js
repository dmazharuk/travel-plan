'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Road extends Model {
    static associate(models) {
      
      Road.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
      
      Road.belongsToMany(models.User, {
        through: models.Companion,
        foreignKey: 'roadId',
        otherKey: 'userId',
        as: 'companions',
      });
    }
  }
  Road.init(
    {
      userId: DataTypes.INTEGER,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      transport: DataTypes.ENUM('поезд', 'самолет', 'машина'),
      transportInfo: DataTypes.TEXT, // Информация о транспорте (включая время отправления, прибытия и номер рейса)
      routeInfo: DataTypes.TEXT, // Информация о маршруте (включая жилье, посещение мест)
      visibility: DataTypes.ENUM('private', 'friends', 'public'),
      
      // Новые поля
      departureDate: DataTypes.DATE, // Дата отправления
      arrivalDate: DataTypes.DATE, // Дата прибытия
      flightTrainNumber: DataTypes.STRING, // Номер рейса/поезда (для самолета и поезда)
      accommodation: DataTypes.STRING, // Название отеля
      checkInDate: DataTypes.DATE, // Дата заезда в отель
      checkOutDate: DataTypes.DATE, // Дата выезда из отеля
      visitDates: DataTypes.JSONB, // Даты посещения мест (массив дат)
      tripStartDate: DataTypes.DATE, // Общая дата начала поездки
      tripEndDate: DataTypes.DATE, // Общая дата конца поездки
    },
    {
      sequelize,
      modelName: 'Road',
    }
  );
  return Road;
};
