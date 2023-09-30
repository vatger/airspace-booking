import FrontendBooking from "../interfaces/condition.interface";

const sortBookingsByStartEndDate = (bookings: FrontendBooking[]) => {
  // Sort the array by start_datetime and then by end_datetime
  bookings.sort((a, b) => {
    const dateAStart: Date = new Date(a.start_datetime);
    const dateBStart: Date = new Date(b.start_datetime);

    // Compare start_datetime values
    if (dateAStart.getTime() !== dateBStart.getTime()) {
      return dateAStart.getTime() - dateBStart.getTime();
    }

    // If start_datetime values are equal, compare end_datetime values
    const dateAEnd: Date = new Date(a.end_datetime);
    const dateBEnd: Date = new Date(b.end_datetime);
    return dateAEnd.getTime() - dateBEnd.getTime();
  });
  return bookings;
};

export default sortBookingsByStartEndDate;
