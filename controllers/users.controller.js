const db = require('../db/db');

// Obtener todos los usuarios
const getUsers = (req, res, next) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return next(err);
    }
    res.json(rows);
  });
};

// Obtener usuario por ID
const getUserById = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      return next(err);
    }

    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(row);
  });
};

// Crear usuario
const createUser = (req, res, next) => {
  const { name, age } = req.body; // ya viene validado por middleware
  const sql = 'INSERT INTO users (name, age) VALUES (?, ?)';

  db.run(sql, [name, age], function (err) {
    if (err) {
      return next(err);
    }

    res.status(201).json({
      id: this.lastID,
      name,
      age
    });
  });
};

// Actualizar usuario
const updateUser = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { name, age } = req.body; // ya viene validado por middleware

  const sql = 'UPDATE users SET name = ?, age = ? WHERE id = ?';

  db.run(sql, [name, age, id], function (err) {
    if (err) {
      return next(err);
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ id, name, age });
  });
};

// Eliminar usuario
const deleteUser = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      return next(err);
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
