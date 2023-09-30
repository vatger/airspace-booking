import Booking from "@shared/interfaces/booking.interface";
import bookingModel, { BookingDocument } from "../models/booking.model";

async function getBookings() {
  try {
    const bookings = await bookingModel.find().exec();

    return bookings;
  } catch (error) {
    console.log("Error getting booked areas", error);
    throw error;
  }
}

async function addBooking(booking: Booking) {
  const bookingDocument: BookingDocument = new bookingModel(booking);

  try {
    await bookingDocument.save();
  } catch (error) {
    throw error;
  }
}

async function deleteBooking(id: string) {
  try {
    await bookingModel.findByIdAndDelete(id).exec();
  } catch (error) {
    throw error;
  }
}

export default { getBookings, addBooking, deleteBooking };
