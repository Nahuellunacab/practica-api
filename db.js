// db.js
// Configuración mínima de SQLite usando el paquete `sqlite3`.
// Este módulo exporta una instancia de `Database` ya inicializada
// que puede ser importada por otros archivos (por ejemplo `index.js`).

// Importar sqlite3 y activar el modo "verbose" para obtener logs
// más detallados (útil durante desarrollo y para depuración).
const sqlite3 = require('sqlite3').verbose();

// Crear o abrir el archivo de base de datos local `database.sqlite`.
// - Si el archivo no existe, SQLite lo crea automáticamente.
// - La segunda argumentación es un callback que recibe un error si falla
//   la apertura/creación de la base de datos.
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        // Si ocurre un error al abrir la DB mostramos el mensaje en consola.
        console.error(err.message);
    } else {
        // Conexión establecida correctamente
        console.log('Conectado a la base de datos SQLite.');
    }
});

// `serialize` asegura que las operaciones dentro del callback se ejecuten
// de forma secuencial. Aquí la usamos para ejecutar la sentencia de
// creación de la tabla si no existe todavía.
db.serialize(() => {
    // Crear la tabla `users` si no existe. La tabla tiene:
    // - `id`: clave primaria autoincremental
    // - `name`: texto obligatorio
    // - `age`: entero obligatorio
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
    )`);
});

// Exportar la instancia `db` para que el resto de la aplicación la use.
// Ejemplo de uso: `const db = require('./db'); db.all(...);`
module.exports = db;