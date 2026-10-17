// Auth API calls: register, login, Google sign-in, current user, update profile
import { apiRequest } from './client.js';

export function registerUser(data) {
  return apiRequest('/auth/register', 'POST', data);
}

export function loginUser(data) {
  return apiRequest('/auth/login', 'POST', data);
}

// Sends the Google ID token to our server, which verifies it and returns our JWT
export function loginWithGoogleToken(credential) {
  return apiRequest('/auth/google', 'POST', { credential: credential });
}

export function fetchMe() {
  return apiRequest('/auth/me');
}

export function updateProfile(data) {
  return apiRequest('/users/me', 'PATCH', data);
}
