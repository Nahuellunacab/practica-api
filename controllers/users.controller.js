const db = require('../db/db');

// Obtener todos los usuarios
const getUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(rows);
  });
};

// Obtener usuario por ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(row);
  });
};

// Crear usuario
const createUser = (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'name y age son obligatorios' });
  }

  const sql = 'INSERT INTO users (name, age) VALUES (?, ?)';

  db.run(sql, [name, age], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear usuario' });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      age
    });
  });
};

// Actualizar usuario
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'name y age son obligatorios' });
  }

  const sql = 'UPDATE users SET name = ?, age = ? WHERE id = ?';

  db.run(sql, [name, age, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ id, name, age });
  });
};

// Eliminar usuario
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(204).send();
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
