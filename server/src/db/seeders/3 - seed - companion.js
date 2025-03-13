'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users";`);
    const roads = await queryInterface.sequelize.query(`SELECT id FROM "Roads";`);

    if (!users[0].length || !roads[0].length) return;

    const userId = users[0][0].id;
    const roadId = roads[0][1].id; // Берём второй маршрут

    await queryInterface.bulkInsert(
      'Companions',
      [
        {
          userId,
          roadId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Companions', null, {});
  },
};
