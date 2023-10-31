import { Booking } from '@/shared/interfaces/bookableArea.interface';

// Function to check for and consolidate overlapping bookings
export function consolidateBookings(bookings: Booking[]): Booking[] {
  if (bookings.length <= 1) {
    return bookings; // No overlaps to consolidate
  }

  // Sort the bookings by their start times
  const sortedBookings = bookings
    .slice()
    .sort((a, b) => a.start_datetime.getTime() - b.start_datetime.getTime());

  const consolidatedBookings: Booking[] = [sortedBookings[0]]; // Initialize with the first booking

  for (let i = 1; i < sortedBookings.length; i++) {
    const currentBooking = sortedBookings[i];
    const lastConsolidatedBooking =
      consolidatedBookings[consolidatedBookings.length - 1];

    if (currentBooking.start_datetime <= lastConsolidatedBooking.end_datetime) {
      // There is an overlap, consolidate the current booking with the last consolidated booking
      lastConsolidatedBooking.end_datetime = new Date(
        Math.max(
          currentBooking.end_datetime.getTime(),
          lastConsolidatedBooking.end_datetime.getTime(),
        ),
      );
    } else {
      // No overlap, add the current booking as a new consolidated booking
      consolidatedBookings.push(currentBooking);
    }
  }

  return consolidatedBookings;
}
