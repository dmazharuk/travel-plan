/**
 * Класс для валидации данных аутентификации
 */
class AuthValidator {
  /**
   * Валидация данных при регистрации пользователя
   * @param {Object} param0 Объект с данными пользователя
   * @param {string} param0.username Имя пользователя
   * @param {string} param0.email Электронная почта
   * @param {string} param0.password Пароль
   * @returns {Object} Результат валидации с полями isValid и error
   */
  static validateSignUp({ username, email, password }) {
    // Проверка имени пользователя
    if (
      !username ||
      username.trim().length === 0 ||
      typeof username !== 'string'
    ) {
      return {
        isValid: false,
        error: 'Username is required and must non-empty string',
      };
    }

    // Проверка электронной почты
    if (
      !email ||
      email.trim().length === 0 ||
      typeof email !== 'string' ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error:
          'Email is required and must non-empty string and must be valid email',
      };
    }

    // Проверка пароля
    if (
      !password ||
      password.trim().length === 0 ||
      typeof password !== 'string' ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Password is required, must be a non-empty string, contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
      };
    }

    // Возвращаем успешный результат, если все проверки пройдены
    return {
      isValid: true,
      error: null,
    };
  }

  /**
   * Валидация данных при входе пользователя
   * @param {Object} param0 Объект с данными пользователя
   * @param {string} param0.email Электронная почта
   * @param {string} param0.password Пароль
   * @returns {Object} Результат валидации с полями isValid и error
   */
  static validateSignIn({ email, password }) {
    // Проверка электронной почты
    if (!email || email.trim().length === 0 || typeof email !== 'string') {
      return {
        isValid: false,
        error: 'Email is required and must non-empty string.',
      };
    }

    // Проверка пароля
    if (
      !password ||
      password.trim().length === 0 ||
      typeof password !== 'string'
    ) {
      return {
        isValid: false,
        error: 'Password is required, must be a non-empty string.',
      };
    }

    // Возвращаем успешный результат, если все проверки пройдены
    return {
      isValid: true,
      error: null,
    };
  }

  /**
   * Проверка корректности формата электронной почты
   * @param {string} email Электронная почта для проверки
   * @returns {boolean} Результат проверки
   */
  static validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  /**
   * Проверка надежности пароля
   * @param {string} password Пароль для проверки
   * @returns {boolean} Результат проверки
   */
  static validatePassword(password) {
    // Регулярные выражения для проверки требований к паролю
    const hasUpperCase = /[A-Z]/; // Проверка на наличие заглавной буквы
    const hasLowerCase = /[a-z]/; // Проверка на наличие строчной буквы
    const hasNumbers = /\d/; // Проверка на наличие цифры
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/; // Проверка на наличие спецсимвола
    const isValidLength = password.length >= 8; // Проверка на минимальную длину

    // Проверка всех условий
    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false; // Пароль не валиден
    } else {
      return true; // Пароль валиден
    }
  }
}

module.exports = AuthValidator;
