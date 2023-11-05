import { NextFunction, Request, Response } from 'express';

import authService from '../services/auth.service';

import { APIError } from '@/shared/errors';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req?.cookies?.areaBooking_token;

  if (!token) {
    return next(new APIError('token cookie must be set!', null, 400));
  }

  try {
    console.log(req.cookies);
    req.user = await authService.getUserFromToken(token);
  } catch (error) {
    return next(new APIError('Unauthorized', null, 401));
  }

  next();
}

export default authMiddleware;
