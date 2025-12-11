const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

// CORS (ajustá origin si querés restringir)
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
