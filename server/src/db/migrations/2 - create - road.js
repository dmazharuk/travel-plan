'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transport: {
        type: Sequelize.ENUM('поезд', 'самолет', 'машина'),
        allowNull: false,
      },
      transportInfo: {
        type: Sequelize.TEXT,
      },
      routeInfo: {
        type: Sequelize.TEXT,
      },
      visibility: {
        type: Sequelize.ENUM('private', 'friends', 'public'),
        allowNull: false,
        defaultValue: 'private',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Roads');
  },
};
