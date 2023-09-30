import { NextFunction, Request, Response } from "express";
import bookableAreasService from "../services/bookableAreas.service";

export async function getBookedAreas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const areas = await bookableAreasService.getBookableAreas();

    res.json(areas);
  } catch (error) {
    next(error);
  }
}

export default {
  getBookedAreas,
};
