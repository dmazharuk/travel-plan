'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Получаем ID обоих пользователей
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" ORDER BY id ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    // Пупа (первый пользователь)
    const pupaRoads = [
      {
        userId: users[0].id,
        country: 'Россия',
        city: 'Москва',
        transport: 'самолет',
        transportInfo: JSON.stringify({
          number: 'SU-123',
          departure: '2024-05-20T08:00:00Z',
          arrival: '2024-05-20T10:00:00Z'
        }),
        tripStartDate: new Date('2024-05-20'),
        tripEndDate: new Date('2024-05-25'),
        accommodation: 'Отель Москва',
        checkInDate: new Date('2024-05-20'),
        checkOutDate: new Date('2024-05-25'),
        visitDates: JSON.stringify([new Date('2024-05-21'), new Date('2024-05-23')]),
       
        routeInfo: 'Деловая поездка',
        visibility: 'friends',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users[0].id,
        country: 'Германия',
        city: 'Берлин',
        transport: 'поезд',
        transportInfo: JSON.stringify({
          number: 'ICE-456',
          departure: '2024-06-01T12:00:00Z',
          arrival: '2024-06-01T18:00:00Z'
        }),
        tripStartDate: new Date('2024-06-01'),
        tripEndDate: new Date('2024-06-07'),
        visibility: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Лупа (второй пользователь)
    const lupaRoads = [
      {
        userId: users[1].id,
        country: 'Италия',
        city: 'Рим',
        transport: 'машина',
        transportInfo: JSON.stringify({
          description: 'Синий Fiat 500'
        }),
        tripStartDate: new Date('2024-07-10'),
        tripEndDate: new Date('2024-07-17'),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users[1].id,
        country: 'Франция',
        city: 'Париж',
        transport: 'самолет',
        transportInfo: JSON.stringify({
          number: 'AF-789',
          departure: '2024-08-01T06:00:00Z',
          arrival: '2024-08-01T08:30:00Z'
        }),
        tripStartDate: new Date('2024-08-01'),
        tripEndDate: new Date('2024-08-07'),
        visibility: 'friends',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Roads', [...pupaRoads, ...lupaRoads], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roads', null, {});
  },
};