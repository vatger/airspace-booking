import { Booking } from "@/shared/interfaces/bookableArea.interface";

export interface FrontendBooking extends Booking {
  area_name: string;
}
