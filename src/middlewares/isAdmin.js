const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado: apenas administradores podem realizar essa ação.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};