const User = require('../models/User');
const { hashPassword, comparePassword } = require('./hash.service');
const { generateToken } = require('../utils/token.util');

const registerUser = async (username, password) => {
  const existing = await User.findOne({ where: { username } });
  if (existing) throw new Error('Usuário já existe');

  const hashed = await hashPassword(password);
  const user = await User.create({ username, password: hashed });

  return {
    id: user.id,
    username: user.username
  };
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('Credenciais inválidas');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Credenciais inválidas');

  const token = generateToken({ id: user.id });

  return {
    token,
    user: { id: user.id, username: user.username }
  };
};

module.exports = {
  registerUser,
  loginUser
};