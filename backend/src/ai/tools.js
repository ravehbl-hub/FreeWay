// AI tools (Gemini "function calling"): actions the assistant is allowed to perform for the user.
// Gemini never touches the database itself - it only asks for a tool by name, and runTool()
// executes it on the server with the SAME booking service and checks the app uses everywhere.
import * as bookingsService from '../services/bookings.service.js';

const DEFAULT_PICKUP_LOCATION = 'Tel Aviv - Downtown';
const DEFAULT_PICKUP_TIME = '10:00';

// What Gemini sees: the name of each tool, what it does and which parameters it needs
export const TOOL_DECLARATIONS = [
  {
    name: 'create_booking',
    description: 'Creates a car rental booking for the logged-in customer. Use it only after the customer clearly asked to book and the vehicle and both dates are known.',
    parameters: {
      type: 'object',
      properties: {
        vehicle_id: { type: 'integer', description: 'The id of the vehicle from the VEHICLE CATALOG' },
        start_date: { type: 'string', description: 'Pickup date in YYYY-MM-DD format' },
        end_date: { type: 'string', description: 'Return date in YYYY-MM-DD format (after the pickup date)' },
        pickup_location: { type: 'string', description: 'One of: Tel Aviv - Downtown, Ben Gurion Airport, Jerusalem - Center, Haifa - Port, Eilat - Hotel Area, Lod, Holon, Hadera, Haifa, Beer Sheva, Ashdod. Default: Tel Aviv - Downtown' },
        pickup_time: { type: 'string', description: 'Pickup time HH:MM, default 10:00' },
        insurance: { type: 'boolean', description: 'true if the customer wants full insurance (12 EUR per day)' },
      },
      required: ['vehicle_id', 'start_date', 'end_date'],
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancels one of the customer\'s own bookings. Use it only when the customer clearly asked to cancel that booking.',
    parameters: {
      type: 'object',
      properties: {
        booking_id: { type: 'integer', description: 'The id of the booking from the CUSTOMER BOOKINGS list' },
      },
      required: ['booking_id'],
    },
  },
];

// Runs one tool for the user and returns a plain object that is sent back to Gemini.
// Errors (wrong dates, overlapping booking, unknown vehicle...) are returned as { error } so the
// assistant can explain them to the customer instead of crashing the chat.
export async function runTool(name, args, user) {
  try {
    if (name === 'create_booking') {
      const booking = await bookingsService.createBooking(user.id, {
        vehicle_id: Number(args.vehicle_id),
        start_date: String(args.start_date),
        end_date: String(args.end_date),
        pickup_location: args.pickup_location || DEFAULT_PICKUP_LOCATION,
        pickup_time: args.pickup_time || DEFAULT_PICKUP_TIME,
        insurance: Boolean(args.insurance),
      });
      return {
        success: true,
        booking_id: booking.id,
        vehicle: booking.vehicle_name,
        start_date: booking.start_date,
        end_date: booking.end_date,
        pickup_location: booking.pickup_location,
        pickup_time: booking.pickup_time,
        total_price_eur: booking.total_price,
        status: booking.status,
        next_step: 'The customer can pay or change it on the /bookings page.',
      };
    }
    if (name === 'cancel_booking') {
      const booking = await bookingsService.cancelBooking(Number(args.booking_id), user);
      return { success: true, booking_id: booking.id, vehicle: booking.vehicle_name, status: booking.status };
    }
    return { error: 'Unknown tool: ' + name };
  } catch (err) {
    return { error: err.message };
  }
}
