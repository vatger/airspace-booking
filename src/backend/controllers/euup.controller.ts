import { NextFunction, Request, Response } from "express";
import { EuupDocument } from "../models/euup.model";
import euupService from "../services/euup.service";

export async function getEuupData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const areas: EuupDocument | null = await euupService.getEuupData();
    res.json(areas);
  } catch (error) {
    console.error(error);
  }
}

export default {
  getEuupData,
};
