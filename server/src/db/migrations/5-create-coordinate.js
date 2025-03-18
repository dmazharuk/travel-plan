'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coordinates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pathId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Paths",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      longitude: {
        type: Sequelize.DECIMAL
      },
      coordinateTitle: {
        type: Sequelize.STRING
      },
      coordinateBody: {
        type: Sequelize.STRING
      },
      coordinateNumber: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Coordinates');
  }
};