import {
  BookableArea,
  Booking,
} from "@shared/interfaces/bookableArea.interface";
import bookableAreaModel, {
  BookableAreaDocument,
} from "../models/bookableArea.model";
import { consolidateBookings } from "../utils/bookings.util";
import euupService from "./euup.service";

async function getBookableAreas() {
  try {
    const bookableAreas: BookableAreaDocument[] = await bookableAreaModel
      .find()
      .exec();
    return bookableAreas;
  } catch (error) {
    throw error;
  }
}

async function addBookableArea(bookableArea: BookableArea) {
  const bookableAreaDocument: BookableAreaDocument = new bookableAreaModel(
    bookableArea
  );

  try {
    await bookableAreaDocument.save();
    return bookableAreaDocument;
  } catch (error) {
    throw error;
  }
}

async function addBookingToArea(selectedAreas: string[], booking: Booking) {
  for (const selectedArea of selectedAreas) {
    const existingArea = await bookableAreaModel.findOne({
      name: selectedArea,
    });

    if (existingArea) {
      existingArea.bookings.push(booking);
      await existingArea.save();
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
      await bookableAreaModel.findByIdAndUpdate(
        bookableArea._id,
        {
          bookings: consolidatedBookings,
        },
        { new: true }
      );
    }
    // add booked area to EUUP data
    euupService.addArea(
      bookableArea.name,
      bookableArea.minimum_fl,
      bookableArea.maximum_fl,
      bookableArea.bookings[0].start_datetime,
      bookableArea.bookings[0].end_datetime
    );
  }
}

export async function deleteBookingFromArea(
  bookingId: string,
  area_name: string
) {
  try {
    // Find the bookableArea by name
    const bookableArea = await bookableAreaModel.findOne({ name: area_name });

    if (bookableArea) {
      // Find the index of the booking with the specified ID in the bookings array
      const bookingIndex = bookableArea.bookings.findIndex(
        (booking) => booking._id?.toString() === bookingId
      );

      if (bookingIndex !== -1) {
        // Remove the booking from the bookings array
        bookableArea.bookings.splice(bookingIndex, 1);

        // Save the updated bookableArea
        await bookableArea.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeOldBookings() {
  try {
    const bookableAreas = await bookableAreaModel.find().exec();

    const timeNow = new Date();

    for (const bookableArea of bookableAreas) {
      bookableArea.bookings = bookableArea.bookings.filter((booking) => {
        // Filter all bookings which are in the past
        return booking.end_datetime > timeNow;
      });

      // Save the updated bookableArea
      await bookableArea.save();
    }
  } catch (error) {
    console.error(error);
  }
}

export default {
  getBookableAreas,
  addBookableArea,
  addBookedAreasToEuupData,
  addBookingToArea,
  deleteBookingFromArea,
  removeOldBookings,
};
