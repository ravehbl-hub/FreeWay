// Auth service: register / login with bcrypt password hashing and JWT tokens.
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { badRequest, conflict, notFound, unauthorized } from '../utils/AppError.js';

const SALT_ROUNDS = 10;

// Creates a signed JWT that holds the user's id, role, name and email
export function createToken(user) {
  const payload = { userId: user.id, role: user.role, name: user.name, email: user.email };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(data) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [data.email]);
  if (existing.rows.length > 0) {
    throw conflict('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  // New accounts are always 'user'. Only an admin can promote someone to admin.
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, name, email, role, created_at`,
    [data.name, data.email, passwordHash]
  );
  const user = result.rows[0];
  return { user: user, token: createToken(user) };
}

export async function login(data) {
  const result = await query('SELECT * FROM users WHERE email = $1', [data.email]);
  const user = result.rows[0];

  // Same message for "no such user" and "wrong password", so emails can't be discovered
  if (!user) {
    throw unauthorized('Invalid email or password');
  }
  // Accounts created with Google have no password
  if (!user.password_hash) {
    throw unauthorized('This account uses Google sign-in. Please continue with Google.');
  }
  const passwordOk = await bcrypt.compare(data.password, user.password_hash);
  if (!passwordOk) {
    throw unauthorized('Invalid email or password');
  }

  const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at };
  return { user: publicUser, token: createToken(publicUser) };
}

export async function getById(id) {
  const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw notFound('User not found');
  }
  return result.rows[0];
}

export async function updateProfile(id, data) {
  if (!data.name && !data.password) {
    throw badRequest('Nothing to update');
  }
  if (data.name) {
    await query('UPDATE users SET name = $1 WHERE id = $2', [data.name, id]);
  }
  if (data.password) {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
  }
  return getById(id);
}
