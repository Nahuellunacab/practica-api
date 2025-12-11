// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error no manejado:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    // en producción no se suele mandar el detalle, pero para dev ayuda:
    detail: err.message || 'Sin detalle'
  });
};

module.exports = errorHandler;
