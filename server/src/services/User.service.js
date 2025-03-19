const { User } = require('../db/models');

class UserService {
  static async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async create(userData) {
    return await User.create({ ...userData, isEmailConfirmed: false });
  }

  static async updatePass(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.password = data.password;
    await user.save();
    return user;
  }

  static async confirmEmail(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.isEmailConfirmed = true;
    await user.save();
    return user;
  }

  static async createTokenPassword(id, token) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.recoverToken = token;
    user.recoverTokenDate = Date.now() + 3600000;
    await user.save();

    return user;
  }

  static async checkTokenPassword(token) {
    const user = await User.findOne({
      recoverToken: token,
    });

    if (!user || user.recoverTokenDate < Date.now()) {
      return null;
    }

    return user;
  }

  static async resetPassword(id, password) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.password = password;
    user.recoverToken = undefined;
    user.recoverTokenDate = undefined;
    await user.save();
    return user;
  }

  static async delete(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = UserService;
