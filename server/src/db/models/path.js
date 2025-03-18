'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Path extends Model {
    static associate({ Road }) {
      this.belongsTo(Road, { foreignKey: "roadId" });
    }
  }
  Path.init({
    pathName: DataTypes.STRING,
    roadId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Path',
  });
  return Path;
};