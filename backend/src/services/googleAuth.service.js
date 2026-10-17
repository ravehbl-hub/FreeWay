// Google sign-in service: checks the ID token that Google gave the browser,
// then finds or creates the matching user and returns our own JWT.
import { OAuth2Client } from 'google-auth-library';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError, unauthorized } from '../utils/AppError.js';
import { createToken } from './auth.service.js';

let googleClient = null;

function getGoogleClient() {
  if (!env.googleClientId) {
    throw new AppError(503, 'Google sign-in is not configured on the server (missing GOOGLE_CLIENT_ID)');
  }
  if (!googleClient) {
    googleClient = new OAuth2Client(env.googleClientId);
  }
  return googleClient;
}

// Asks Google to verify the token and returns the profile inside it
async function verifyGoogleToken(credential) {
  const client = getGoogleClient();
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken: credential, audience: env.googleClientId });
  } catch {
    throw unauthorized('Google sign-in failed. Please try again.');
  }
  const profile = ticket.getPayload();
  if (!profile || !profile.email || !profile.email_verified) {
    throw unauthorized('Google account has no verified email');
  }
  return { googleId: profile.sub, email: profile.email, name: profile.name || profile.email };
}

export async function loginWithGoogle(credential) {
  const profile = await verifyGoogleToken(credential);

  // 1. Known Google user -> log in
  let result = await query('SELECT * FROM users WHERE google_id = $1', [profile.googleId]);

  // 2. Same email registered with a password -> link the Google account to it
  if (result.rows.length === 0) {
    result = await query(
      'UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *',
      [profile.googleId, profile.email]
    );
  }

  // 3. Brand-new user -> create an account without a password (role user)
  if (result.rows.length === 0) {
    result = await query(
      `INSERT INTO users (name, email, google_id, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING *`,
      [profile.name, profile.email, profile.googleId]
    );
  }

  const user = result.rows[0];
  const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at };
  return { user: publicUser, token: createToken(publicUser) };
}
