import { BookableArea, Booking } from "../interfaces/bookableArea.interface";

function bookingOverlapsWithExistingBookings(
  booking: Booking,
  selectedAreas: string[],
  bookableAreas: BookableArea[]
) {
  if (selectedAreas.length === 0 || bookableAreas.length === 0) {
    return { areaIsBooked: false, conflictingAreas: [] };
  }

  let areaIsBooked = false;
  let conflictingAreas: string[] = [];

  const areasToCheck = bookableAreas.filter((area) => {
    return selectedAreas.includes(area.name);
  });

  for (const area of areasToCheck) {
    for (const existingBooking of area.bookings) {
      // Check if start time does not begin during existing booking or at the same time
      const startTimeOverlaps =
        existingBooking.start_datetime <= booking.start_datetime &&
        booking.start_datetime < existingBooking.end_datetime;

      // Check if end time does not end during existing booking or at the same time
      const endTimeOverlaps =
        existingBooking.start_datetime < booking.end_datetime &&
        booking.end_datetime <= existingBooking.end_datetime;

      if (startTimeOverlaps || endTimeOverlaps) {
        areaIsBooked = true;
        if (!conflictingAreas.includes(area.name)) {
          conflictingAreas.push(area.name);
        }
      }
    }
  }

  return { areaIsBooked: areaIsBooked, conflictingAreas: conflictingAreas };
}

export { bookingOverlapsWithExistingBookings };
