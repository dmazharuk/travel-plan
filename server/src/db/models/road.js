'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Road extends Model {
    static associate(models) {
      Road.belongsTo(models.User, { foreignKey: 'userId' });
      Road.belongsToMany(models.User, {
        through: models.Companion,
        foreignKey: 'roadId',
        otherKey: 'userId',
      });
    }
  }
  Road.init(
    {
      userId: DataTypes.INTEGER,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      transport: DataTypes.ENUM('поезд', 'самолет', 'машина'),
      transportInfo: DataTypes.TEXT,
      routeInfo: DataTypes.TEXT,
      visibility: DataTypes.ENUM('private', 'friends', 'public'),
    },
    {
      sequelize,
      modelName: 'Road',
    }
  );
  return Road;
};
