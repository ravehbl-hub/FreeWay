// Users controller: profile update (any user) and user management (admin).
import * as usersService from '../services/users.service.js';
import { updateProfile } from '../services/auth.service.js';

export async function updateMe(req, res, next) {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const users = await usersService.listUsers();
    res.json({ users: users });
  } catch (err) {
    next(err);
  }
}

export async function changeRole(req, res, next) {
  try {
    const user = await usersService.changeRole(req.params.id, req.body.role, req.user.id);
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
