import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.slice(7);

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = { id: user._id.toString(), name: user.name, email: user.email };
  next();
});