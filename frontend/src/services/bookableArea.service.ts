import { Booking } from "@shared/interfaces/bookableArea.interface";
import axios from "axios";

async function getBookableAreas() {
  try {
    const response = await axios.get("/api/v1/bookableAreas");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteBooking(id: string, area_name: string) {
  try {
    const response = await axios.delete("/api/v1/bookings/" + id, {
      data: { area_name },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addBookingToArea(
  selectedAreas: string[],
  booking: Booking
): Promise<void> {
  try {
    const response = await axios.patch("api/v1/bookableAreas/", {
      selectedAreas,
      booking,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  getBookableAreas,
  deleteBooking,
  addBookingToArea,
};
