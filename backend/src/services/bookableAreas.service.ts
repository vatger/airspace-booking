import { BookingDuration } from "@shared/interfaces/bookableArea.interface";
import bookableAreaModel, {
  BookableAreasDocument,
} from "../models/bookableArea.model";
import { consolidateBookings } from "../utils/bookings.util";
import areaService from "./area.service";
import Booking from "@shared/interfaces/booking.interface";

async function getBookableAreas() {
  try {
    const bookableAreas: BookableAreasDocument[] = await bookableAreaModel
      .find()
      .exec();

    return bookableAreas;
  } catch (e) {
    console.log("Error getting bookable areas", e);
    throw e;
  }
}

async function addBookableArea(
  name: string,
  minimum_fl: number,
  maximum_fl: number,
  bookings: BookingDuration[]
) {
  try {
    // Create a new BookableArea document using the Mongoose model
    const bookableArea = new bookableAreaModel({
      name,
      minimum_fl,
      maximum_fl,
      bookings,
    });

    // Save the new bookableArea document to the database
    await bookableArea.save();
  } catch (e) {
    console.log("Error adding bookable area", e);
    throw e;
  }
}

async function addBookingToArea(booking: Booking) {
  // Loop through each area_name in the booking
  for (const area_name of booking.area_name) {
    // Find the bookableArea using the area_name
    const bookableArea: BookableAreasDocument | null =
      await bookableAreaModel.findOne({ name: area_name });

    if (bookableArea) {
      // Create a new booking duration for the bookableArea
      const bookingDuration = {
        start: booking.start_datetime,
        end: booking.end_datetime,
      };

      // Push the booking duration to the bookings array of the bookableArea
      bookableArea.bookings.push(bookingDuration);

      // Save the updated bookableArea
      await bookableArea.save();
    }
  }
}

async function addBookedAreasToEuupData() {
  const bookableAreas = await getBookableAreas();
  for (const bookableArea of bookableAreas) {
    if (bookableArea.bookings.length === 0) {
      continue;
    }
    const consolidatedBookings = consolidateBookings(bookableArea.bookings);

    if (bookableArea.bookings != consolidatedBookings) {
      // Update the corresponding bookableArea with the consolidated bookings
      const areaWithConsolidatedBookingTimes =
        await bookableAreaModel.findByIdAndUpdate(
          bookableArea._id,
          {
            bookings: consolidatedBookings,
          },
          { new: true }
        );
      if (areaWithConsolidatedBookingTimes) {
        areaService.addArea(
          areaWithConsolidatedBookingTimes.name,
          areaWithConsolidatedBookingTimes.minimum_fl,
          areaWithConsolidatedBookingTimes.maximum_fl,
          areaWithConsolidatedBookingTimes.bookings[0].start,
          areaWithConsolidatedBookingTimes.bookings[0].end
        );
      }
    }
  }
}

export default {
  getBookableAreas,
  addBookableArea,
  addBookedAreasToEuupData,
  addBookingToArea,
};
