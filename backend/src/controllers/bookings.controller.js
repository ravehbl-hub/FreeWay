// Bookings controller: passes the logged-in user (req.user) to the service so it can check ownership.
import * as bookingsService from '../services/bookings.service.js';

export async function listMine(req, res, next) {
  try {
    const bookings = await bookingsService.listByUser(req.user.id);
    res.json({ bookings: bookings });
  } catch (err) {
    next(err);
  }
}

export async function listAll(req, res, next) {
  try {
    const bookings = await bookingsService.listAll();
    res.json({ bookings: bookings });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const booking = await bookingsService.getBooking(req.params.id, req.user);
    res.json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const booking = await bookingsService.createBooking(req.user.id, req.body);
    res.status(201).json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const booking = await bookingsService.updateBooking(req.params.id, req.user, req.body);
    res.json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const booking = await bookingsService.cancelBooking(req.params.id, req.user);
    res.json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function pay(req, res, next) {
  try {
    const booking = await bookingsService.payBooking(req.params.id, req.user);
    res.json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function setStatus(req, res, next) {
  try {
    const booking = await bookingsService.setStatus(req.params.id, req.body.status);
    res.json({ booking: booking });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await bookingsService.deleteBooking(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
