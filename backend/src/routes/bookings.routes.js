// /api/bookings - users manage their own bookings, admins manage all bookings
import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as bookingsController from '../controllers/bookings.controller.js';

const router = Router();
router.use(requireAuth); // every bookings route needs a logged-in user

const idRule = param('id').isInt().withMessage('Invalid booking id').toInt();

const bookingRules = [
  body('vehicle_id').isInt({ min: 1 }).withMessage('Please choose a vehicle').toInt(),
  body('start_date').isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('end_date').isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)'),
  body('pickup_location').trim().isLength({ min: 2, max: 120 }).withMessage('Pickup location is required'),
  body('pickup_time').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Pickup time must be HH:MM'),
  body('insurance').optional().isBoolean().withMessage('Insurance must be true/false').toBoolean(),
];

router.get('/', bookingsController.listMine);
router.get('/all', requireRole('admin'), bookingsController.listAll);
router.get('/:id', [idRule], validate, bookingsController.getOne);
router.post('/', bookingRules, validate, bookingsController.create);
router.put('/:id', [idRule, ...bookingRules], validate, bookingsController.update);
router.patch('/:id/cancel', [idRule], validate, bookingsController.cancel);
// Demo payment: the card is validated here but NEVER stored - only its last 4 digits are kept
const paymentRules = [
  body('card_name').trim().isLength({ min: 2, max: 60 }).withMessage('Name on card is required'),
  body('card_number').customSanitizer((v) => String(v || '').replace(/\s+/g, '')).matches(/^\d{13,19}$/).withMessage('Card number must be 13-19 digits'),
  body('expiry').trim().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Expiry must be MM/YY'),
  body('cvc').trim().matches(/^\d{3,4}$/).withMessage('CVC must be 3-4 digits'),
];
router.patch('/:id/pay', [idRule, ...paymentRules], validate, bookingsController.pay);
router.patch(
  '/:id/status',
  requireRole('admin'),
  [idRule, body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status')],
  validate,
  bookingsController.setStatus
);
router.delete('/:id', requireRole('admin'), [idRule], validate, bookingsController.remove);

export default router;
