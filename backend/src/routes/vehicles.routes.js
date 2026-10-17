// /api/vehicles - public catalog (read) + admin CRUD (create/update/delete)
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as vehiclesController from '../controllers/vehicles.controller.js';

const router = Router();

const vehicleRules = (optional = false) => {
  const f = (name) => (optional ? body(name).optional() : body(name));
  return [
    f('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    f('category').isIn(['compact', 'suv', 'premium']).withMessage('Category must be compact, suv or premium'),
    f('seats').isInt({ min: 1, max: 9 }).withMessage('Seats must be between 1 and 9').toInt(),
    f('transmission').isIn(['auto', 'manual']).withMessage('Transmission must be auto or manual'),
    f('fuel_type').optional().isIn(['petrol', 'diesel', 'hybrid', 'electric']).withMessage('Invalid fuel type'),
    f('price_per_day').isFloat({ gt: 0 }).withMessage('Price per day must be a positive number').toFloat(),
    body('co2_per_km').optional().isFloat({ min: 0 }).withMessage('CO2 per km must be 0 or more').toFloat(),
    body('available').optional().isBoolean().withMessage('Available must be true/false').toBoolean(),
    body('image_url').optional({ values: 'falsy' }).isString().isLength({ max: 1000 }),
    body('description').optional().isString().isLength({ max: 2000 }),
  ];
};

router.get(
  '/',
  [
    query('category').optional().isIn(['compact', 'suv', 'premium']).withMessage('Invalid category'),
    query('transmission').optional().isIn(['auto', 'manual']).withMessage('Invalid transmission'),
    query('maxPrice').optional().isFloat({ gt: 0 }).toFloat(),
    query('minSeats').optional().isInt({ min: 1 }).toInt(),
    query('available').optional().isBoolean().toBoolean(),
    query('search').optional().isString().trim(),
    query('location').optional().isString().trim(),
    query('start_date').optional().isISO8601().withMessage('start_date must be YYYY-MM-DD'),
    query('end_date').optional().isISO8601().withMessage('end_date must be YYYY-MM-DD'),
  ],
  validate,
  vehiclesController.list
);
router.get('/:id', [param('id').isInt().toInt()], validate, vehiclesController.getOne);
// Which pickup locations still have this model free for the dates (one car per location)
router.get(
  '/:id/availability',
  [
    param('id').isInt().toInt(),
    query('start_date').isISO8601().withMessage('start_date is required (YYYY-MM-DD)'),
    query('end_date').isISO8601().withMessage('end_date is required (YYYY-MM-DD)'),
  ],
  validate,
  vehiclesController.availability
);

router.post('/', requireAuth, requireRole('admin'), vehicleRules(false), validate, vehiclesController.create);
router.put('/:id', requireAuth, requireRole('admin'), [param('id').isInt().toInt(), ...vehicleRules(true)], validate, vehiclesController.update);
router.delete('/:id', requireAuth, requireRole('admin'), [param('id').isInt().toInt()], validate, vehiclesController.remove);

export default router;
