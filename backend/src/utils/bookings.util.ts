import { BookingDuration } from "@shared/interfaces/bookableArea.interface";

// Function to check for and consolidate overlapping bookings
export function consolidateBookings(
  bookings: BookingDuration[]
): BookingDuration[] {
  if (bookings.length <= 1) {
    return bookings; // No overlaps to consolidate
  }

  // Sort the bookings by their start times
  const sortedBookings = bookings
    .slice()
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const consolidatedBookings: BookingDuration[] = [sortedBookings[0]]; // Initialize with the first booking

  for (let i = 1; i < sortedBookings.length; i++) {
    const currentBooking = sortedBookings[i];
    const lastConsolidatedBooking =
      consolidatedBookings[consolidatedBookings.length - 1];

    if (currentBooking.start <= lastConsolidatedBooking.end) {
      // There is an overlap, consolidate the current booking with the last consolidated booking
      lastConsolidatedBooking.end = new Date(
        Math.max(
          currentBooking.end.getTime(),
          lastConsolidatedBooking.end.getTime()
        )
      );
    } else {
      // No overlap, add the current booking as a new consolidated booking
      consolidatedBookings.push(currentBooking);
    }
  }

  return consolidatedBookings;
}
