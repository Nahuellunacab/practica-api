// middlewares/validateUser.js

const validateUserBody = (req, res, next) => {
  const { name, age } = req.body;
  const errors = [];

  // Validar name
  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push('El nombre es obligatorio y debe tener al menos 2 caracteres.');
  }

  // Validar age
  const ageNumber = Number(age);
  if (
    Number.isNaN(ageNumber) ||
    !Number.isInteger(ageNumber) ||
    ageNumber <= 0 ||
    ageNumber > 120
  ) {
    errors.push('La edad es obligatoria, debe ser un número entero entre 1 y 120.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Normalizamos el body para que controladores ya reciban age como número
  req.body.name = name.trim();
  req.body.age = ageNumber;

  next();
};

module.exports = {
  validateUserBody
};
