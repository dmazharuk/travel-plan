'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Companion extends Model {
    static associate(models) {
      Companion.belongsTo(models.User, { foreignKey: 'userId' });
      Companion.belongsTo(models.Road, { foreignKey: 'roadId' });
    }
  }
  Companion.init(
    {
      userId: DataTypes.INTEGER,
      roadId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Companion',
    }
  );
  return Companion;
};
