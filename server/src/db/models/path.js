// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Path extends Model {
//     static associate({ Road }) {
//       this.belongsTo(Road, { foreignKey: "roadId" });
//     }
//   }
//   Path.init({
//     pathName: DataTypes.STRING,
//     roadId: DataTypes.INTEGER,
//     userId: DataTypes.INTEGER,
//   }, {
//     sequelize,
//     modelName: 'Path',
//   });
//   return Path;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Path extends Model {
    static associate({ Road, User }) {
      // Связь с моделью Road
      this.belongsTo(Road, { foreignKey: "roadId" });

      // Связь с моделью User
      this.belongsTo(User, { foreignKey: "userId" });
    }
  }
  Path.init({
    pathName: DataTypes.STRING,
    roadId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER, // Внешний ключ для связи с User
  }, {
    sequelize,
    modelName: 'Path',
  });
  return Path;
};