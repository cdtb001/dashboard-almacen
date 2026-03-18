const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((error) => {
  if (error) {
    console.log('Error de conexión a MySQL:', error);
    return;
  }
  console.log('Conectado a MySQL');
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/conceptos', (req, res) => {
  db.query('SELECT * FROM conceptos ORDER BY id DESC', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener conceptos' });
    }
    res.json(results);
  });
});

app.post('/api/conceptos', (req, res) => {
  const { clave, descripcion } = req.body;
  db.query(
    'INSERT INTO conceptos (clave, descripcion) VALUES (?, ?)',
    [clave, descripcion],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error al guardar concepto' });
      }
      res.json({ mensaje: 'Concepto guardado', id: result.insertId });
    }
  );
});

app.get('/api/destinos', (req, res) => {
  db.query('SELECT * FROM destinos ORDER BY id DESC', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener destinos' });
    }
    res.json(results);
  });
});

app.post('/api/destinos', (req, res) => {
  const { clave, nombre } = req.body;
  db.query(
    'INSERT INTO destinos (clave, nombre) VALUES (?, ?)',
    [clave, nombre],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error al guardar destino' });
      }
      res.json({ mensaje: 'Destino guardado', id: result.insertId });
    }
  );
});

app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos ORDER BY id DESC', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

app.post('/api/productos', (req, res) => {
  const { clave, nombre, precio } = req.body;
  db.query(
    'INSERT INTO productos (clave, nombre, precio) VALUES (?, ?, ?)',
    [clave, nombre, precio],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error al guardar producto' });
      }
      res.json({ mensaje: 'Producto guardado', id: result.insertId });
    }
  );
});

app.get('/api/unidades', (req, res) => {
  db.query('SELECT * FROM unidades_medida ORDER BY id DESC', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener unidades' });
    }
    res.json(results);
  });
});

app.post('/api/unidades', (req, res) => {
  const { clave, nombre } = req.body;
  db.query(
    'INSERT INTO unidades_medida (clave, nombre) VALUES (?, ?)',
    [clave, nombre],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error al guardar unidad' });
      }
      res.json({ mensaje: 'Unidad guardada', id: result.insertId });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});