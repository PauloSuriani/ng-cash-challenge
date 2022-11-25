import BaseHTTPError from './errors/httpError';
const cors = require('cors');
const express = require('express');

require('./database/models/');

const userRouter = require('./routes/user');
const transactionRouter = require('./routes/transaction');

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

app.use(userRouter);
app.use(transactionRouter);

app.use((err: BaseHTTPError, res: any,) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  // eslint-disable-next-line no-console
  console.error(err.message);
  return res.status(500).json({ message: 'Erro interno' });
});

module.exports = app;
