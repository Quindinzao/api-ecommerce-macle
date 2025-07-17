const app = require('./app');
const sequelize = require('./config/db');
// require('./models/associateModels'); 
require('dotenv').config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Erro ao conectar ao banco de dados:', error);
  }
})();