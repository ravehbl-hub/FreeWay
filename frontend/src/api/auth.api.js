// Auth API calls: register, login, current user, update profile
import { apiRequest } from './client.js';

export function registerUser(data) {
  return apiRequest('/auth/register', 'POST', data);
}

export function loginUser(data) {
  return apiRequest('/auth/login', 'POST', data);
}

export function fetchMe() {
  return apiRequest('/auth/me');
}

export function updateProfile(data) {
  return apiRequest('/users/me', 'PATCH', data);
}
