'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users";`);
    const userId = users[0][0]?.id;

    if (!userId) return;

    await queryInterface.bulkInsert(
      'Roads',
      [
        {
          userId,
          country: 'Франция',
          city: 'Париж',
          transport: 'самолет',
          transportInfo: 'Прямой рейс из Москвы',
          routeInfo: 'Прогулка по Эйфелевой башне, Лувру и Монмартру',
          visibility: 'public',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId,
          country: 'Германия',
          city: 'Берлин',
          transport: 'поезд',
          transportInfo: 'Ночной поезд из Варшавы',
          routeInfo: 'Визит в Бранденбургские ворота и Истсайд галерею',
          visibility: 'friends',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId,
          country: 'Испания',
          city: 'Барселона',
          transport: 'машина',
          transportInfo: 'Аренда авто в Мадриде',
          routeInfo: 'Поездка вдоль побережья через Валенсию',
          visibility: 'private',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roads', null, {});
  },
};
