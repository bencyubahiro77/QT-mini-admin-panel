import { Router } from 'express';
import { asyncHandler, validateUUID, validatePaginationQuery } from '../middleware';
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

// Export routes
router.get('/export', asyncHandler(exportUsers));
router.get('/public-key', asyncHandler(getPublicKeyEndpoint));

// CRUD routes
router.post('/', asyncHandler(createUser));
router.get('/', validatePaginationQuery, asyncHandler(getAllUsers));
router.get('/:id', validateUUID(), asyncHandler(getUserById));
router.put('/:id', validateUUID(), asyncHandler(updateUser));
router.delete('/:id', validateUUID(), asyncHandler(deleteUser));

export default router;
