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
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      routeInfo: {
        type: Sequelize.TEXT,
      },
      visibility: {
        type: Sequelize.ENUM('private', 'friends', 'public'),
        allowNull: false,
        defaultValue: 'private',
      },
      
     
      
      accommodation: {
        type: Sequelize.STRING,
      }, // Название отеля
      checkInDate: {
        type: Sequelize.DATE,
      }, // Дата заезда
      checkOutDate: {
        type: Sequelize.DATE,
      }, // Дата выезда
      visitDates: {
        type: Sequelize.JSONB,
      }, // Массив дат посещения мест
      tripStartDate: {
        type: Sequelize.DATE,
      }, // Общая дата начала поездки
      tripEndDate: {
        type: Sequelize.DATE,
      }, // Общая дата конца поездки

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
