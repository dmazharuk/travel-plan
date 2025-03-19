'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coordinate extends Model {
    static associate({ Path }) {
      this.belongsTo(Path, { foreignKey: "pathId" });
    }
  }
  Coordinate.init({
    pathId: DataTypes.INTEGER,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    coordinateTitle: DataTypes.STRING,
    coordinateBody: DataTypes.STRING,
    coordinateNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Coordinate',
  });
  return Coordinate;
};