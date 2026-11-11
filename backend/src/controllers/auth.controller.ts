import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // passwordHash has select: false, so we ask for it explicitly
  const user = await User.findOne({ email }).select('+passwordHash');

  // Same message for unknown email and wrong password,
  // so attackers cannot find out which emails exist
  const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !isValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ id: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});