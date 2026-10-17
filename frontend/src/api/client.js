// Small fetch wrapper used by all API files.
// Adds the base URL and the JWT token, and turns error responses into Error objects with a message.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'freeway_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  return headers;
}

// Sends a request and returns the JSON body. Throws an Error (with .status and .details) on failure.
export async function apiRequest(path, method = 'GET', body) {
  let response;
  try {
    response = await fetch(API_URL + path, {
      method: method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  // 204 No Content has no body
  if (response.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.error ? data.error.message : 'Request failed (' + response.status + ')';
    const error = new Error(message);
    error.status = response.status;
    error.details = data && data.error ? data.error.details : undefined;
    // Token expired -> tell the app to log out
    if (response.status === 401 && getToken()) {
      window.dispatchEvent(new Event('freeway:unauthorized'));
    }
    throw error;
  }
  return data;
}
