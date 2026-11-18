require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
  host: process.env.DB_HOST, port: process.env.DB_PORT,
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, connectionLimit: 5
});

const esc = s => String(s).replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

app.get('/test', async (req, res) => {
  try {
    const [v] = await pool.query('SELECT VERSION() AS version');
    const [c] = await pool.query('SELECT COUNT(*) AS total FROM products');
    res.send(`<h1>Connection OK</h1><p>MySQL ${esc(v[0].version)}</p><p>Products: ${c[0].total}</p>`);
  } catch (err) {
    console.error(err);                       // real error goes to the log
    res.status(500).send('Sorry, the database is not available right now.');
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, c.name AS category, p.price, p.stock, p.created_at
       FROM products p JOIN categories c ON p.category_id = c.id
       ORDER BY p.name`);
    const body = rows.map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.category)}</td>
      <td>$${Number(r.price).toFixed(2)}</td><td>${r.stock}</td>
      <td>${new Date(r.created_at).toLocaleDateString('en-AU')}</td></tr>`).join('');
    res.send(`<h1>Products</h1><table border="1" cellpadding="6">
      <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Added</th></tr>${body}</table>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sorry, the products could not be loaded.');
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));