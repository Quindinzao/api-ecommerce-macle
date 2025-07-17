const userService = require('../services/authService');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const newUser = await userService.registerUser(username, password, role);
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: { username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await userService.loginUser(username, password);
    res.json({
      message: 'Login bem-sucedido',
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};