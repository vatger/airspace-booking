export interface BookingDuration {
  start: Date;
  end: Date;
}

export interface BookableArea {
  _id: string;
  name: string;
  minimum_fl: number;
  maximum_fl: number;
  bookings: BookingDuration[];
}

export default BookableArea;
