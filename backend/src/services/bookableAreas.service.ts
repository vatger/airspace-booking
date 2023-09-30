import { BookingDuration } from "@shared/interfaces/bookableArea.interface";
import bookableAreaModel, {
  BookableAreasDocument,
} from "../models/bookableArea.model";
import { consolidateBookings } from "../utils/bookings.util";
import areaService from "./area.service";

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

async function addBookedAreas() {
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

export default { getBookableAreas, addBookableArea, addBookedAreas };
