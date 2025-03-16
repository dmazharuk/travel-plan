'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Road, { foreignKey: 'userId', as: 'roads' });
      User.belongsToMany(models.Road, {
        through: models.Companion,
        foreignKey: 'userId',
        as: 'companionRoads',
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    },
  );
  return User;
};
