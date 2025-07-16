const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./config/db');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);

// Tratamento de erro 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Conexão e início
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
});