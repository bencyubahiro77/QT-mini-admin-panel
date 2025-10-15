import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportUsers,
  getPublicKeyEndpoint,
} from '../controllers/user.controller';

const router = Router();

router.get('/export', exportUsers);
router.get('/public-key', getPublicKeyEndpoint);

// CRUD routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
