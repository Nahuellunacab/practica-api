# Mini API REST - Nivel 1

Este proyecto es una API REST básica de **usuarios** construida con **Node.js**, **Express** y **SQLite**.

En el **Nivel 1** se reorganizó el código para seguir una estructura más profesional, separando:

- punto de entrada del servidor
- rutas
- controladores
- capa de acceso a datos (base de datos)

---

## Funcionalidad

La API expone un CRUD completo sobre el recurso `users`:

- `GET /api/users` → lista todos los usuarios
- `GET /api/users/:id` → devuelve un usuario por su id
- `POST /api/users` → crea un nuevo usuario
- `PUT /api/users/:id` → actualiza un usuario existente
- `DELETE /api/users/:id` → elimina un usuario por id

Los datos se almacenan en una base de datos SQLite en el archivo `database.sqlite`, en la tabla:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL
);
```
---

# Arquitectura del proyecto

```text
src/
├─ index.js                # Punto de entrada, configura Express y monta rutas
├─ routes/
│   └─ users.routes.js     # Definición de rutas para /api/users
├─ controllers/
│   └─ users.controller.js # Lógica de negocio para cada endpoint
└─ db/
    └─ db.js               # Conexión a SQLite y creación de la tabla 
```

## index.js
- Inicializa Express.
- Configura el middleware express.json() para parsear JSON.
- Monta las rutas de usuarios en /api/users.
- Levanta el servidor en el puerto 3000.

## routes/users.routes.js
- Define las rutas de la API relacionadas con usuarios.
- Asocia cada ruta HTTP con una función del controlador correspondiente.

## controllers/users.controller.js
- Implementa la lógica de negocio para cada endpoint:
   - obtener todos los usuarios
   - obtener un usuario por id
   - crear un usuario nuevo
   - actualizar un usuario existente
   - eliminar un usuario

- Se encarga de manejar errores y devolver respuestas HTTP adecuadas.

## db/db.js
- Configura la conexión a una base de datos SQLite.
- Crea la tabla users si no existe.
- Exporta la instancia db para que sea usada por los controladores.

---

## Scripts
En `package.json`:

```json
Copiar código
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```
- `npm start` → ejecuta el servidor con Node (pensado para producción).
- `npm run dev` → ejecuta el servidor con nodemon (reinicio automático en desarrollo).

---

# Cómo levantar la API
```bash
Copiar código
npm install
npm run dev     # desarrollo
# o
npm start       # ejecución normal
```
Luego podés probar los endpoints con Postman o curl en:

- `http://localhost:3000/api/users`
---