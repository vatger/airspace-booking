import mongoose, { HydratedDocument } from "mongoose";
import BookableArea from "@shared/interfaces/bookableArea.interface";

export type BookableAreasDocument = HydratedDocument<BookableArea>;

const bookingDurationSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minimum_fl: { type: Number, default: 0 },
  maximum_fl: { type: Number, default: 660 },
  bookings: [bookingDurationSchema],
});

export default mongoose.model<BookableArea>(
  "bookableArea",
  areaSchema,
  "bookableAreas"
);
