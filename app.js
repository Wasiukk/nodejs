const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/users');

//połączenie z bazą
mongoose.connect(
  'mongodb+srv://shop:' +
    process.env.ATLAS_PWD +
    '@mbo.ns57q.mongodb.net/sklep?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

//katalog statyczny
app.use('/uploads', express.static('uploads'));

//logger
app.use(morgan('combined'));

//parsowanie części body
app.use(bodyParser.json());

//routy
app.use('/products', productRoutes);
app.use('/users', userRoutes);

//obsługa błędów
app.use((req, res, next) => {
  const error = new Error('Nie znaleziono');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      wiadomosc: error.message,
    },
  });
});

module.exports = app;
