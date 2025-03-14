'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password1 = await bcrypt.hash('pupa@pupa.com', 10);
   

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'Пупа',
          email: 'pupa@pupa.com',
          password: password1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
