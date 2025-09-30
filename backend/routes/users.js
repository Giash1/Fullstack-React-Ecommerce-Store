import express from 'express';
import {
  getUsers,
  getAllUsersDebug,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUserStats
} from '../controllers/userController.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/debug/all', getAllUsersDebug); // Debug route - remove in production
router.get('/stats', protect, authorize('admin'), getUserStats);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUser);
router.put('/:id/activate', protect, authorize('admin'), activateUser);

// Admin or own profile routes
router.get('/:id', protect, checkOwnership, getUser);
router.put('/:id', protect, checkOwnership, updateUser);

export default router;