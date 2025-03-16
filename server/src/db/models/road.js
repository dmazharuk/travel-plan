'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Road extends Model {
    static associate(models) {
      Road.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE',
      });

      Road.belongsToMany(models.User, {
        through: models.Companion,
        foreignKey: 'roadId',
        otherKey: 'userId',
        as: 'companions',
        onDelete: 'CASCADE',
      });
    }
  }

  Road.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transport: {
        type: DataTypes.ENUM('поезд', 'самолет', 'машина'),
        allowNull: false,
      },
      transportInfo: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Структура зависит от типа транспорта',
      },
      tripStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tripEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      accommodation: {
        type: DataTypes.STRING,
        comment: 'Название отеля/жилья',
      },
      checkInDate: {
        type: DataTypes.DATE,
        comment: 'Дата заселения',
      },
      checkOutDate: {
        type: DataTypes.DATE,
        comment: 'Дата выселения',
      },
      visitDates: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Массив дат в формате ISO',
      },
      routeInfo: {
        type: DataTypes.TEXT,
        comment: 'Дополнительная информация',
      },
      visibility: {
        type: DataTypes.ENUM('private', 'friends', 'public'),
        defaultValue: 'private',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Road',
      timestamps: true,
      indexes: [
        { fields: ['tripStartDate'] },
        { fields: ['tripEndDate'] },
        { fields: ['transport'] },
      ],
    },
  );

  return Road;
};
