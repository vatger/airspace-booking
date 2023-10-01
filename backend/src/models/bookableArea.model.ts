import mongoose, { HydratedDocument } from "mongoose";
import { BookableArea } from "@shared/interfaces/bookableArea.interface";

export type BookableAreaDocument = HydratedDocument<BookableArea>;

export const bookingSchema = new mongoose.Schema({
  start_datetime: { type: Date, required: true },
  end_datetime: { type: Date, required: true },
  booked_by: { type: String, required: true },
});

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minimum_fl: { type: Number, default: 0 },
  maximum_fl: { type: Number, default: 660 },
  bookings: [bookingSchema],
});

export default mongoose.model<BookableArea>("bookableArea", areaSchema);
