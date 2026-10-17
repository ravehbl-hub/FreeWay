// Stats API calls (dashboard tiles)
import { apiRequest } from './client.js';

export function fetchMyStats() {
  return apiRequest('/stats/me');
}

export function fetchAdminStats() {
  return apiRequest('/stats/admin');
}
