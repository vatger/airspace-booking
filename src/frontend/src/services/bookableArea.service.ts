import axios from 'axios';

import { Booking } from '@/shared/interfaces/bookableArea.interface';

async function getBookableAreas() {
  try {
    const response = await axios.get('/api/v1/bookableareas');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteBooking(id: string, area_name: string) {
  try {
    const response = await axios.delete('/api/v1/bookings/' + id, {
      data: { area_name },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addBookingToArea(selectedAreas: string[], booking: Booking) {
  try {
    const response = await axios.patch('api/v1/bookableareas', {
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
