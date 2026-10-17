// Google auth controller: receives the Google credential and returns user + JWT.
import * as googleAuthService from '../services/googleAuth.service.js';

export async function loginWithGoogle(req, res, next) {
  try {
    const result = await googleAuthService.loginWithGoogle(req.body.credential);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
