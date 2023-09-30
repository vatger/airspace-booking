import { NextFunction, Request, Response } from "express";
import bookingService from "../services/booking.service";

export async function getBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookings = await bookingService.getBookings();

    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function addBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking = await bookingService.addBooking(req.body);

    res.json(booking);
  } catch (error) {
    next(error);
  }
}

export async function deleteBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await bookingService.deleteBooking(req.params.id);

    res.json({
      msg: "deleted condition",
    });
  } catch (error) {
    console.error(error);
  }
}

export default {
  getBookings,
  addBooking,
  deleteBooking,
};
