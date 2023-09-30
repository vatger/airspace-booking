import Header from "./header";

import { useEffect } from "react";
import { useState } from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

import BookableArea from "@shared/interfaces/bookableArea.interface";
import FrontendBooking from "../interfaces/condition.interface";

import bookingService from "../services/booking.service";
import bookableAreaService from "services/bookableArea.service";

import formatDateTime from "utils/dateFormater.util";
import sortBookingsByStartEndDate from "utils/bookingSorter.util";
import BookingDialog from "./bookingDialog";

const BookingPage = () => {
  const [bookings, setBookings] = useState<FrontendBooking[]>([]);

  const [showNewBookingDialog, setShowNewBookingDialog] =
    useState<boolean>(false);
  const [bookableAreas, setBookableAreas] = useState<string[]>([]);

  const fetchAndSetBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      const convertedBookingData: FrontendBooking[] = data.map(
        (element: FrontendBooking) => ({
          _id: element._id,
          area_name: element.area_name,
          start_datetime: element.start_datetime,
          end_datetime: element.end_datetime,
          booked_by: element.booked_by,
        })
      );

      const bookingsSorted = sortBookingsByStartEndDate(convertedBookingData);
      setBookings(bookingsSorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndSetBookings();
    bookableAreaService.getBookableAreas().then((data: BookableArea[]) => {
      const convertedBookableAreaData: string[] = data.map(
        (element: BookableArea) => {
          return element.name;
        }
      );
      setBookableAreas(convertedBookableAreaData);
    });
  }, []);

  const handleNewBooking = () => {
    setShowNewBookingDialog(true);
  };

  const startContent = [
    <Button
      key={"Toolbar-StartContent-Button"}
      label="New"
      icon="pi pi-plus"
      className="mr-2"
      onClick={handleNewBooking}
    />,
  ];

  const handleDelete = (rowData: FrontendBooking) => {
    if (rowData._id !== null) {
      bookingService.deleteBooking(rowData._id);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== rowData._id)
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
      <Header />
      <Toolbar start={startContent} />
      <Dialog
        visible={showNewBookingDialog}
        onHide={() => {
          setShowNewBookingDialog(false);
        }}
      >
        <BookingDialog
          bookableAreas={bookableAreas}
          onBookingCompleted={handleBookingCompleted}
        />
      </Dialog>
      <DataTable value={bookings}>
        <Column
          field="area_name"
          header="Area"
          body={(data) => data.area_name.join(", ")}
        />
        <Column
          field="start_datetime"
          header="Begin"
          body={(data) => formatDateTime(data.start_datetime)}
        />
        <Column
          field="end_datetime"
          header="End"
          body={(data) => formatDateTime(data.end_datetime)}
        />
        <Column field="booked_by" header="Booked by" />
        <Column header="Actions" body={deleteButtonTemplate} />
      </DataTable>
    </div>
  );
};

export default BookingPage;
