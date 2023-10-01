export interface Booking {
  _id: string | null;
  start_datetime: Date;
  end_datetime: Date;
  booked_by: string;
}

export interface BookableArea {
  _id: string;
  name: string;
  minimum_fl: number;
  maximum_fl: number;
  bookings: Booking[];
}
