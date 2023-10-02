import { BookableArea } from "@shared/interfaces/bookableArea.interface";

const BookingAreaOverview = ({
  bookableAreas,
}: {
  bookableAreas: BookableArea[];
}) => {
  const bookedAreas = bookableAreas.filter((area) => area.bookings.length > 0);
  return <></>;
};

export default BookingAreaOverview;
