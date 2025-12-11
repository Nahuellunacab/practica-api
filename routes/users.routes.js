const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

const { validateUserBody } = require('../middlewares/validateUser');

// Rutas
router.get('/', getUsers);             // GET /api/users
router.get('/:id', getUserById);       // GET /api/users/:id
router.post('/', validateUserBody, createUser);   // POST /api/users
router.put('/:id', validateUserBody, updateUser); // PUT /api/users/:id
router.delete('/:id', deleteUser);     // DELETE /api/users/:id

module.exports = router;
