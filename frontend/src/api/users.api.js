// Users API calls (admin)
import { apiRequest } from './client.js';

export function fetchUsers() {
  return apiRequest('/users');
}

export function changeUserRole(id, role) {
  return apiRequest('/users/' + id + '/role', 'PATCH', { role: role });
}

export function deleteUser(id) {
  return apiRequest('/users/' + id, 'DELETE');
}
