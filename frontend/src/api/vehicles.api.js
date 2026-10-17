// Vehicles API calls (list with filters, details, admin CRUD)
import { apiRequest } from './client.js';

export function fetchVehicles(filters) {
  const params = new URLSearchParams();
  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
  }
  const queryString = params.toString();
  return apiRequest('/vehicles' + (queryString ? '?' + queryString : ''));
}

export function fetchVehicle(id) {
  return apiRequest('/vehicles/' + id);
}

// Which pickup locations still have this model free for the dates (one car per location)
export function fetchVehicleAvailability(id, startDate, endDate) {
  return apiRequest('/vehicles/' + id + '/availability?start_date=' + startDate + '&end_date=' + endDate);
}

export function createVehicle(data) {
  return apiRequest('/vehicles', 'POST', data);
}

export function updateVehicle(id, data) {
  return apiRequest('/vehicles/' + id, 'PUT', data);
}

export function deleteVehicle(id) {
  return apiRequest('/vehicles/' + id, 'DELETE');
}
