import Booking from "@shared/interfaces/booking.interface";
import mongoose, { HydratedDocument } from "mongoose";

export type BookingDocument = HydratedDocument<Booking>;

export const bookingSchema = new mongoose.Schema({
  area_name: { type: [String], required: true },
  start_datetime: { type: Date, required: true },
  end_datetime: { type: Date, required: true },
  booked_by: { type: String, required: true },
});

export default mongoose.model<BookingDocument>(
  "booking",
  bookingSchema,
  "bookings"
);
