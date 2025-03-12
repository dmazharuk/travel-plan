const express = require('express');
const path = require('path');
const cors = require('cors'); //* библиотека для настройки CORS-политики
const morgan = require('morgan'); //* библиотека позволяющая выводить запросы в лог
const cookieParser = require('cookie-parser'); //* библиотека для работы с куками

//Note: конфигурация для библиотеки cors
const corsOptions = {
  origin: [process.env.CLIENT_URL], //* разрешенный источник для CORS-запросов
  credentials: true, //* разрешает передачу учетных данных (cookies, headers)
};

//NOTE: функция serverConfig, принимающая экземпляр приложения и возвращающая обученный экземпляр
const serverConfig = (app) => {
  //NOTE промежуточные обработчики, работающие глобально для всего приложения (системные мидлварки)
  //* позволяет работать с телом запроса
  app.use(express.urlencoded({ extended: true }));

  //* парсит JSON
  app.use(express.json());

  //* логирует данные о запросах на сервер
  app.use(morgan('dev'));

  //* настройка CORS с указанными опциями
  app.use(cors(corsOptions));

  //* парсит куки
  app.use(cookieParser());

  //* настройка статики, папка public ассоциирована с маршрутом запроса
  //* позволяет получить доступ к статическим файлам (изображениям) по указанному пути
  app.use(
    '/static/images',
    express.static(path.resolve(__dirname, '..', 'public', 'images'))
  );
};

//* экспорт конфигурационной функции
module.exports = serverConfig;
