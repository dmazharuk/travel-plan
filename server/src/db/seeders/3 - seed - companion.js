'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Получаем первого пользователя (Пупу) и его первый маршрут
    const [pupa] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'pupa@pupa.com\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const [pupaFirstRoad] = await queryInterface.sequelize.query(
      'SELECT id FROM "Roads" WHERE "userId" = :userId ORDER BY id ASC LIMIT 1;',
      {
        replacements: { userId: pupa.id },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    // Получаем второго пользователя (Лупу)
    const [lupa] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'lupa@lupa.com\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Добавляем Лупу компаньоном к первому маршруту Пупы
    await queryInterface.bulkInsert('Companions', [{
      userId: lupa.id,
      roadId: pupaFirstRoad.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Companions', null, {});
  },
};