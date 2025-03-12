const UserService = require('../services/User.service');
const AuthValidator = require('../utils/Auth.validator');
const formatResponse = require('../utils/formatResponse');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const cookiesConfig = require('../config/cookiesConfig');

/**
 * Контроллер аутентификации (AuthController)
 * Отвечает за обработку всех запросов, связанных с аутентификацией пользователей:
 * регистрация, вход, выход и обновление токенов.
 * Контроллер работает как промежуточный слой между маршрутами и сервисами,
 * обрабатывая HTTP-запросы и формируя ответы.
 */
class AuthController {
  /**
   * Обновляет токены доступа и обновления для авторизованного пользователя
   */
  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ user });

      res.status(200).cookie('refreshToken', refreshToken, cookiesConfig).json(
        formatResponse(200, 'Successfully regenerate tokens', {
          user,
          accessToken,
        })
      );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  /**
   * Регистрация нового пользователя
   *
   * Процесс:
   * 1. Валидация входных данных
   * 2. Проверка существования пользователя
   * 3. Хеширование пароля
   * 4. Создание пользователя
   * 5. Генерация токенов доступа
   */
  static async signUp(req, res) {
    const { email, username, password } = req.body;

    const { isValid, error } = AuthValidator.validateSignUp({
      email,
      username,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'User already exists',
              null,
              'User already exists'
            )
          );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserService.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
      });

      if (!newUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Failed to register user',
              null,
              'Failed to register user'
            )
          );
      }

      const plainUser = newUser.get({ plain: true });
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Register successful', {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  /**
   * Аутентификация существующего пользователя
   *
   * Процесс:
   * 1. Валидация входных данных
   * 2. Поиск пользователя по email
   * 3. Проверка правильности пароля
   * 4. Генерация токенов доступа
   */
  static async signIn(req, res) {
    const { email, password } = req.body;

    const { isValid, error } = AuthValidator.validateSignIn({
      email,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const user = await UserService.getByEmail(normalizedEmail);

      if (!user) {
        return res
          .status(400)
          .json(formatResponse(400, 'User not found', null, 'User not found'));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Invalid password', null, 'Invalid password')
          );
      }

      const plainUser = user.get({ plain: true });
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(200, 'Login successful', {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  /**
   * Выход пользователя из системы
   *
   * Удаляет refresh token из cookies браузера
   */
  static async signOut(req, res) {
    try {
      res
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Logout successfully'));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = AuthController;
