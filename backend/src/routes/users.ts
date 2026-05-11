import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/staticDataService.js';

export const usersRoutes = express.Router();

// GET /api/users
usersRoutes.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users, message: 'Users retrieved successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve users' });
  }
});

// GET /api/users/:id
usersRoutes.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve user' });
  }
});

// POST /api/users
usersRoutes.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'name, email, role шаардлагатай' });
    }
    const newUser = await createUser({ name, email, role });
    res.status(201).json({ success: true, data: newUser });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// PUT /api/users/:id
usersRoutes.put('/:id', async (req, res) => {
  try {
    const { name, email, role, avatar } = req.body;
    const updatedUser = await updateUser(req.params.id, {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(avatar !== undefined && { avatar }),
    });
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: updatedUser });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id
usersRoutes.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

export default usersRoutes;
