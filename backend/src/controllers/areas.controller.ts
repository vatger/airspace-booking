import { NextFunction, Request, Response } from "express";
import areaService from "../services/area.service";

export async function getBookedAreas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const areas = await areaService.getEuupData();

    res.json(areas);
  } catch (error) {
    next(error);
  }
}

export default {
  getBookedAreas,
};
