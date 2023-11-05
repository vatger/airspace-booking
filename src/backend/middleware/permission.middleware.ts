import { NextFunction, Request, Response } from 'express';

import { APIError } from '@/shared/errors';

export async function permissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // check if the user is banned from vatsim OR he is not allowed to book
  const userIsPermittedToBook: boolean = req.user?.areaBooking.banned === false && req.user?.areaBooking.allowBooking === true;

  if (userIsPermittedToBook === false) {
    return next(new APIError('Unauthorized', null, 401));
  }

  next();
}

export default permissionMiddleware;
