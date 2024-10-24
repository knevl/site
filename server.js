//node server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Разрешить все домены

// Настройка body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Настройка подключения к PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'site',
  password: 'admin',
  port: 5432,
});

client.connect();

// Маршрут для обработки заказов
app.post('/', (req, res) => {
  const { phone, product, size, comment } = req.body;

  // SQL-запрос для вставки данных в таблицу orders
  const query = `
    INSERT INTO orders (phone, product, size, comment)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [phone, product, size, comment];

  client.query(query, values, (err) => {
    if (err) {
      console.error('Ошибка при выполнении запроса', err);
      res.status(500).send('Ошибка при оформлении заказа');
    } else {
      // Ответ с сообщением об успешном заказе
      res.send(`
        <div class="TextOrder">
          Ваш заказ принят!<br />В ближайшее время с вами свяжется менеджер
        </div>
      `);
    }
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
