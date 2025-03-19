require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const { SECRET_ACCESS_TOKEN, SECRET_REFRESH_TOKEN, JWT_PASS } = process.env;

const generateTokens = (payload) => ({
  accessToken: jwt.sign(payload, SECRET_ACCESS_TOKEN, jwtConfig.access),
  refreshToken: jwt.sign(payload, SECRET_REFRESH_TOKEN, jwtConfig.refresh),
});

const generateTokensPassword = (payload) => ({
  passwordToken: jwt.sign(payload, JWT_PASS, jwtConfig.password),
});

module.exports = { generateTokens, generateTokensPassword };
