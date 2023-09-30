import Booking from "@shared/interfaces/booking.interface";

export default interface FrontendBooking extends Booking {
  _id: string | null;
}
