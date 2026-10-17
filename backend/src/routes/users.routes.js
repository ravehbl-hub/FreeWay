// /api/users - own profile (any logged-in user) + user management (admin only)
import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as usersController from '../controllers/users.controller.js';

const router = Router();
router.use(requireAuth);

router.patch(
  '/me',
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  usersController.updateMe
);

router.get('/', requireRole('admin'), usersController.list);
router.patch(
  '/:id/role',
  requireRole('admin'),
  [param('id').isInt().toInt(), body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin')],
  validate,
  usersController.changeRole
);
router.delete('/:id', requireRole('admin'), [param('id').isInt().toInt()], validate, usersController.remove);

export default router;
