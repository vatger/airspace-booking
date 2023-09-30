import axios from "axios";

async function getBookings() {
  try {
    const response = await axios.get("/api/v1/bookings");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteBooking(id: string) {
  try {
    const response = await axios.delete("api/v1/bookings/" + id);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function addBooking(body: object) {
  try {
    const response = await axios.post("api/v1/bookings/", body);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export default {
  getBookings,
  deleteBooking,
  addBooking,
};
