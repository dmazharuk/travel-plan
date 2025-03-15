'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    const password = await bcrypt.hash('Qwerty123@', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        username: 'Пупа',
        email: 'pupa@pupa.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Лупа',
        email: 'lupa@lupa.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};