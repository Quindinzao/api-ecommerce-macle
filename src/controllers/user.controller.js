const { registerUser, loginUser } = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'Usuário criado', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};