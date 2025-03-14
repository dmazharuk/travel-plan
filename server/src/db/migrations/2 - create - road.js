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
      
      // Новые поля
      departureDate: {
        type: Sequelize.DATE,
      }, // Дата отправления
      arrivalDate: {
        type: Sequelize.DATE,
      }, // Дата прибытия
      flightTrainNumber: {
        type: Sequelize.STRING,
      }, // Номер рейса/поезда
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
