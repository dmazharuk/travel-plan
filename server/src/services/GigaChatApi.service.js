const axios = require('axios');
require('dotenv').config();

const GIGACHAT_API_URL = process.env.GIGACHAT_API_URL;
const GIGACHAT_AUTH_TOKEN = process.env.GIGACHAT_AUTH_TOKEN;
const GIGACHAT_RQUID = process.env.GIGACHAT_RQUID;

// Отключаем проверку SSL (!!!!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let token = null;
let lastCall = 0;

class GigaChatService {
  static async getRecommendations(city, type) {
    const now = new Date().getTime();
    console.log(now, 'now');
    
   
    
    try {
      if (!token || now - lastCall > 1000 * 60 * 28) {
        lastCall = new Date().getTime(); 
        await this.Authorization();
        console.log('Ошибка авторизации: токен не получен');
      }
     
      let content;

      if (type === 'items') {
        content = `Перечисли необходимые вещи, связанные с поездкой в город ${city}.Не пиши ничего кроме названий вещей.Максимум 150 символов.Фразы должны быть законченными предложениями.Дописывай слова`;
      } else if (city) {
        content = `Перечисли основные достопримечательности в ${city} в виде: название места, адрес места, краткое описание. Максимум 150 символов.Фразы должны быть законченными предложениями.`;
      } else {
        throw new Error('Не указан город');
      }

      const response = await axios.post(
        `${GIGACHAT_API_URL}/chat/completions`,
        {
          model: 'GigaChat',
          messages: [{ role: 'user', content }],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Ошибка при запросе к GigaChat:', error);
      throw new Error('Не удалось получить рекомендации');
    }
  }

  static async Authorization() {
    
    const response = await axios.post(
      `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`,
      {
        scope: 'GIGACHAT_API_PERS',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${GIGACHAT_AUTH_TOKEN}`,
          RqUID: GIGACHAT_RQUID,
        },
      },
    );
    // проверяем есть ли токен в ответе
    if (response.data && response.data.access_token) {
      token = response.data.access_token; 
     
      console.log('Токен обновлен:', token);
    } else {
      throw new Error('Токен не получен');
    }
  }
  catch(error) {
    console.error('Ошибка авторизации в GigaChat:', error);
    throw new Error('Не удалось авторизоваться');
  }
}

module.exports = GigaChatService;
