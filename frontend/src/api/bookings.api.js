// Bookings API calls
import { apiRequest } from './client.js';

export function fetchMyBookings() {
  return apiRequest('/bookings');
}

export function fetchAllBookings() {
  return apiRequest('/bookings/all');
}

export function createBooking(data) {
  return apiRequest('/bookings', 'POST', data);
}

export function updateBooking(id, data) {
  return apiRequest('/bookings/' + id, 'PUT', data);
}

export function cancelBooking(id) {
  return apiRequest('/bookings/' + id + '/cancel', 'PATCH');
}

export function payBooking(id) {
  return apiRequest('/bookings/' + id + '/pay', 'PATCH');
}

export function setBookingStatus(id, status) {
  return apiRequest('/bookings/' + id + '/status', 'PATCH', { status: status });
}

export function deleteBooking(id) {
  return apiRequest('/bookings/' + id, 'DELETE');
}
