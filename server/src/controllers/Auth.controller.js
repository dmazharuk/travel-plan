const UserService = require('../services/User.service');
const AuthValidator = require('../utils/Auth.validator');
const formatResponse = require('../utils/formatResponse');
const bcrypt = require('bcrypt');
const {
  generateTokens,
  generateTokensPassword,
} = require('../utils/generateTokens');
const cookiesConfig = require('../config/cookiesConfig');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

class AuthController {
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

      const emailConfirmationToken = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/${emailConfirmationToken}`;
      await sendEmail({
        to: email,
        subject: 'Подтверждение email',
        html: `
        <div style="
        max-width: 600px;
        margin: 20px auto;
        padding: 30px;
        background: #f5f7fa;
        border-radius: 10px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      ">
  
        <div style="
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.05);
        ">
          <h1 style="
            color: #2A5C8C;
            margin: 0 0 25px 0;
            font-size: 24px;
            text-align: center;
          ">
            Подтвердите ваш email
          </h1>

          <p style="
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
          ">
            Спасибо за регистрацию в Travel Plan! Для активации аккаунта
            нажмите на кнопку ниже:
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${confirmationLink}"
              style="
                background: linear-gradient(45deg, #2A5C8C, #3AB8A7);
                color: white;
                padding: 15px 35px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                transition: transform 0.2s;
                border: none;
                cursor: pointer;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'">
              Подтвердить email
            </a>
          </div>

          <p style="
            color: #888;
            font-size: 12px;
            text-align: center;
            margin-top: 30px;
            line-height: 1.5;
          ">
            Если вы не регистрировались на нашем сервисе,
            просто проигнорируйте это письмо.<br>
          </p>
        </div>

        <div style="
          text-align: center;
          margin-top: 30px;
          color: #999;
          font-size: 12px;
        ">
          © ${new Date().getFullYear()} Travel Plan. Все права защищены
        </div>
      </div>
      `,
      });

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

  /**
   * Подтверждение почты
   *
   * Проверяет токен и меняет поле у пользователя
   */

  static async confirmEmail(req, res) {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Токен не предоставлен',
            null,
            'Токен не предоставлен'
          )
        );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userConfirm = await UserService.confirmEmail(decoded.userId);

      if (!userConfirm) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь не найден',
              null,
              'Пользователь не найден'
            )
          );
      }

      const plainUser = userConfirm.get({ plain: true });
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Email успешно подтвержден!', {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      return res
        .status(400)
        .json(formatResponse(400, 'Пользователь не найден', null, message));
    }
  }

  static async recoverPassword(req, res) {
    const { email } = req.body;

    const isValid = AuthValidator.validateEmail(email);

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null));
    }

    try {
      const normalizedEmail = email.toLowerCase();
      const user = await UserService.getByEmail(normalizedEmail);
      const plainUser = user.get({ plain: true });
      delete plainUser.password;

      if (user) {
        const passwordToken = generateTokensPassword({
          user: plainUser,
        }).passwordToken;
        const resetLink = `${process.env.CLIENT_URL}/?token=${passwordToken}`;

        await sendEmail({
          to: email,
          subject: 'Восстановление пароля',
          html: `
          <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: #f5f7fa; border-radius: 10px;">
            <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
              <h1 style="color: #2A5C8C; text-align: center;">Восстановление пароля</h1>
              <p style="color: #666; line-height: 1.6; text-align: center;">
                Для сброса пароля нажмите на кнопку ниже:
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(45deg, #2A5C8C, #3AB8A7); 
                          color: white; 
                          padding: 15px 35px; 
                          border-radius: 25px; 
                          text-decoration: none; 
                          font-weight: bold;">
                  Сбросить пароль
                </a>
              </div>
              <p style="color: #888; font-size: 12px; text-align: center;">
                Ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, 
                проигнорируйте это письмо.
              </p>
            </div>
          </div>
          `,
        });
      }

      res
        .status(200)
        .json(
          formatResponse(200, 'Инструкции по сбросу пароля отправлены на email')
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  /**
   * Сброс пароля по токену
   */

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    const isValid = AuthValidator.validatePassword(newPassword);

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_PASS);

      const user = await UserService.getByEmail(decoded.user.email);
      const plainUser = user.get({ plain: true });
      delete plainUser.password;

      if (!plainUser) {
        return res.status(404).json(formatResponse(404, 'User not found'));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserService.updatePass(plainUser.id, {
        password: hashedPassword,
      });
      res.status(200).json(formatResponse(200, 'Password updated'));
    } catch (error) {
      let message = 'Просроченная ссылка, запросите новую';
      if (error instanceof jwt.TokenExpiredError) {
        message = 'Просроченная ссылка, запросите новую';
      } else if (error instanceof jwt.JsonWebTokenError) {
        message = 'Просроченная ссылка, запросите новую';
      }

      res.status(401).json(formatResponse(401, message, null));
    }
  }
}

module.exports = AuthController;
