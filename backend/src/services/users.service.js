// Users service: SQL for admin user management.
import { query } from '../config/db.js';
import { badRequest, notFound } from '../utils/AppError.js';

export async function listUsers() {
  const result = await query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at, COUNT(b.id)::int AS bookings_count
     FROM users u
     LEFT JOIN bookings b ON b.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return result.rows;
}

export async function changeRole(id, role, currentUserId) {
  if (id === currentUserId) {
    throw badRequest('You cannot change your own role');
  }
  const result = await query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, created_at',
    [role, id]
  );
  if (result.rows.length === 0) {
    throw notFound('User not found');
  }
  return result.rows[0];
}

export async function deleteUser(id, currentUserId) {
  if (id === currentUserId) {
    throw badRequest('You cannot delete yourself');
  }
  const result = await query('DELETE FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw notFound('User not found');
  }
}
