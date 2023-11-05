import { NextFunction, Request, Response } from 'express';

import { BookableAreaDocument } from '../models/bookableArea.model';
import bookableAreaService from '../services/bookableArea.service';

export async function getBookableAreas(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const areas: BookableAreaDocument[] | undefined =
      await bookableAreaService.getBookableAreas();

    res.json(areas);
  } catch (error) {
    next(error);
  }
}

export async function addBookableArea(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const area =
      await bookableAreaService.addBookableArea(req.body);
    return area;
  } catch (error) {
    next(error);
  }
}

export async function addBookingToArea(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await bookableAreaService.addBookingToArea(
      req.user,
      req.body.selectedAreas,
      req.body.booking,
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteBookingFromArea(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await bookableAreaService.deleteBookingFromArea(
      req.user,
      req.params.id,
      req.body.area_name,
    );
    res.json();
  } catch (error) {
    next(error);
  }
}

export default {
  getBookableAreas,
  addBookableArea,
  addBookingToArea,
  deleteBookingFromArea,
};
