const axios = require('axios');
require('dotenv').config();

const GIGACHAT_API_URL = process.env.GIGACHAT_API_URL;
//  const GIGACHAT_API_KEY = process.env.GIGACHAT_API_KEY;
// Отключаем проверку SSL (НЕ ИСПОЛЬЗУЙ В ПРОДАКШЕНЕ!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let token = null;
let lastCall = 0;

class GigaChatService {
  static async getRecommendations(city, type) {
    try {
      if (!token) await this.Authorization();

      let content;

      if (type === 'items') {
        content = `Составь список необходимых вещей для поездки в ${city}. 
                  . Максимум 10 символов.`;
      } else if (city) {
        content = `Перечисли достопримечательности в ${city}
                  в формате Название - Адрес. Максимум 10 символов.`;
      } else {
        throw new Error('Не указан город');
      }

      const response = await axios.post(
        `${GIGACHAT_API_URL}/chat/completions`,
        {
          model: 'GigaChat',
          messages: [{ role: 'user', content }],
          max_tokens: 10,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // const response = await axios.post(
      //   `${GIGACHAT_API_URL}/chat/completions`,
      //   {
      //     model: 'GigaChat',
      //     messages: [
      //       {
      //         role: 'user',
      //         content:
      //           `Текст должен быть не более 255 символов. Не должен прерываться на полуслове.Ты туристический эксперт.Давай места и описание достопримечательностей в городе ${city}. Всегда возвращай законченное предложение`,
      //       },
      //     ],
      //     max_tokens: 255,
      //     temperature: 0.5,

      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       'Content-Type': 'application/json',
      //       Accept: 'application/json',
      //     },
      //   },
      // );

      // return response.data.choices[0].message.content;
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Ошибка при запросе к GigaChat:', error);
      throw new Error('Не удалось получить рекомендации');
    }
  }
  static async Authorization() {
    const now = new Date().getTime();
    if (token && now - lastCall < 1000 * 60 * 28) {
      return;
    }
    const response = await axios.post(
      `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`,
      {
        scope: 'GIGACHAT_API_PERS',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization:
            'Basic ODc1Mjc4ZTYtMDVlMS00NjY1LWE4YjgtMDY5YzI2N2U3MDBjOjY4YTNmYjdiLTZjZTAtNGExZS1hY2Q0LTg2YWZlOTM5N2ZjYQ==',
          RqUID: '875278e6-05e1-4665-a8b8-069c267e700c',
        },
      },
    );

    if (response.data && response.data.access_token) {
      token = response.data.access_token; // Обновляем токен
      lastCall = new Date().getTime(); // Обновляем время последнего запроса
      console.log('Токен обновлен:', token);
    } else {
      throw new Error('Токен не получен');
    }
  }
}
module.exports = GigaChatService;
