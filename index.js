// Servidor API REST mínimo con Express y SQLite
// Importar dependencias necesarias
const express = require('express');
const db = require('./db'); // Conexión/configuración de SQLite (archivo local `db.js`)

// Crear la aplicación Express y configurar el puerto
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// -------------------------------------------------------------
// Rutas CRUD para la entidad `users`
// Cada ruta usa la API de callbacks de `sqlite3` expuesta por `db`
// -------------------------------------------------------------

// GET /api/users -> obtener todos los usuarios
// - Ejecuta una consulta que devuelve todas las filas de la tabla `users`.
// - Responde con 200 y un array de usuarios en caso de éxito.
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  // `db.all` obtiene todas las filas que cumplan la consulta
  db.all(sql, [], (err, rows) => {
    if (err) {
      // Loguear el error en el servidor y devolver 500 al cliente
      console.error('Error al obtener usuarios:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Enviar las filas encontradas (puede ser un array vacío)
    res.status(200).json(rows);
  });
});

// GET /api/users/:id -> obtener un usuario por id
// - Parsea `:id` desde la URL y busca una fila con `db.get`.
// - Devuelve 200 con el usuario si existe, 404 si no existe.
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id); // convertir a número
  const sql = 'SELECT * FROM users WHERE id = ?';

  // `db.get` devuelve una única fila (o undefined si no existe)
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error al obtener usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (!row) {
      // No se encontró el usuario
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Usuario encontrado -> responder con 200
    res.status(200).json(row);
  });
});

// POST /api/users -> crear un usuario nuevo
// - Recibe `name` y `age` en el body (JSON).
// - Valida campos requeridos y usa `db.run` para insertar.
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;

  // Validación básica: ambos campos obligatorios
  if (!name || !age) {
    return res.status(400).json({ message: 'name y age son obligatorios' });
  }

  const sql = 'INSERT INTO users (name, age) VALUES (?, ?)';

  // En `db.run` la función callback usa `function` (no arrow) para acceder a `this`
  db.run(sql, [name, age], function (err) {
    if (err) {
      console.error('Error al crear usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // `this.lastID` contiene el id autogenerado por SQLite para la fila insertada
    const newUser = {
      id: this.lastID,
      name,
      age
    };

    // Devolver 201 Created con el recurso recién creado
    res.status(201).json(newUser);
  });
});

// PUT /api/users/:id -> actualizar COMPLETO un usuario
// - Sustituye todos los campos (en este caso `name` y `age`) del usuario.
// - Responde 200 con el recurso actualizado o 404 si no existe.
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age } = req.body;

  // Validación simple para PUT completo
  if (!name || !age) {
    return res.status(400).json({ message: 'name y age son obligatorios' });
  }

  const sql = 'UPDATE users SET name = ?, age = ? WHERE id = ?';

  // `this.changes` indica cuántas filas fueron modificadas por el UPDATE
  db.run(sql, [name, age, id], function (err) {
    if (err) {
      console.error('Error al actualizar usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (this.changes === 0) {
      // No se actualizó ninguna fila -> id no encontrado
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con el recurso actualizado (puede preferirse volver a leer de la DB)
    res.status(200).json({ id, name, age });
  });
});

// DELETE /api/users/:id -> eliminar un usuario
// - Borra la fila con el id especificado. Responde 204 si se elimina correctamente.
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error al eliminar usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (this.changes === 0) {
      // No se eliminó ninguna fila -> id no encontrado
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 204 No Content: la eliminación fue exitosa, no devolvemos cuerpo
    res.status(204).send();
  });
});

// Levantar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
