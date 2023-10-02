import { useEffect, useState } from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

import { BookableArea } from "@shared/interfaces/bookableArea.interface";
import bookableAreaService from "services/bookableArea.service";
import { FrontendBooking } from "interfaces/FrontendBooking";
import formatDateTime from "utils/dateFormater.util";
import BookingDialog from "./bookingDialog";
import sortBookingsByStartEndDate from "../utils/bookingSorter.util";
import BookingsDataTable from "./BookingsDataTable";

const BookingPage = () => {
  const [bookableAreas, setBookableAreas] = useState<BookableArea[]>([]);
  const [bookings, setBookings] = useState<FrontendBooking[]>([]);
  const [showNewBookingDialog, setShowNewBookingDialog] =
    useState<boolean>(false);

  const fetchAndSetBookings = async () => {
    try {
      const data = await bookableAreaService.getBookableAreas();
      const convertedBookableAreaData: BookableArea[] = data.map(
        (element: BookableArea) => ({
          _id: element._id,
          name: element.name,
          minimum_fl: element.minimum_fl,
          maximum_fl: element.maximum_fl,
          bookings: element.bookings,
        })
      );
      setBookableAreas(convertedBookableAreaData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndSetBookings();
  }, []);

  useEffect(() => {
    const allBookings: FrontendBooking[] = [];

    bookableAreas.forEach((area: BookableArea) => {
      const area_name = area.name;
      for (const booking of area.bookings) {
        const frontendBooking: FrontendBooking = {
          _id: booking._id,
          area_name: area_name,
          start_datetime: booking.start_datetime,
          end_datetime: booking.end_datetime,
          booked_by: booking.booked_by,
        };

        allBookings.push(frontendBooking);
      }
    });

    const bookingsSorted = sortBookingsByStartEndDate(allBookings);
    setBookings(bookingsSorted);
  }, [bookableAreas]);

  const startContent = [
    <Button
      key={"Toolbar-StartContent-Button"}
      label="New"
      icon="pi pi-plus"
      className="mr-2"
      onClick={() => setShowNewBookingDialog(true)}
    />,
  ];

  const handleDelete = (rowData: FrontendBooking) => {
    if (rowData._id !== null) {
      bookableAreaService.deleteBooking(rowData._id, rowData.area_name);
      setBookableAreas((prevBookableAreas) =>
        prevBookableAreas.map((bookableArea) => {
          if (bookableArea.name === rowData.area_name) {
            const updatedBookings = bookableArea.bookings.filter(
              (booking) => booking._id !== rowData._id
            );
            return { ...bookableArea, bookings: updatedBookings };
          }
          return bookableArea;
        })
      );
    }
  };

  const deleteButtonTemplate = (rowData: FrontendBooking) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleDelete(rowData)}
      />
    );
  };

  const handleBookingCompleted = () => {
    setShowNewBookingDialog(false);
    fetchAndSetBookings();
  };

  return (
    <div className="p-grid p-dir-col">
      <Toolbar start={startContent} />
      <Dialog
        visible={showNewBookingDialog}
        onHide={() => {
          setShowNewBookingDialog(false);
        }}
      >
        <BookingDialog
          bookableAreas={bookableAreas.map((bookableArea: BookableArea) => {
            return bookableArea.name;
          })}
          onBookingCompleted={handleBookingCompleted}
        />
      </Dialog>
        <BookingsDataTable bookings={bookings} handleDelete={handleDelete} />
    </div>
  );
};

export default BookingPage;
