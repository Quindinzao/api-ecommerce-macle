const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // => Notas do João: genSalt(10) gera 1024 operações criptográficas internas ao hash.
  return bcrypt.hash(password, salt);
};

const comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

const registerUser = async (username, password, role = 'user') => {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) throw new Error('Usuário já existe');

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ username, password: hashedPassword, role });

  return { username: user.username, id: user.id, role: user.role };
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('Usuário não encontrado');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Credenciais inválidas');

  const token = jwt.sign(
    { 
      id: user.id,
      role: user.role
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '8h' }
  );

  return { token, user: { username: user.username, id: user.id, role: user.role } };
};

module.exports = {
  registerUser,
  loginUser
};