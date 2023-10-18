import { MutableRefObject, useEffect, useRef, useState } from "react";

import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import {
  createDateForDuration,
  createDateWithUtcTime,
} from "../utils/date.util";

import bookableAreaService from "../services/bookableArea.service";

import { Booking } from "@/shared/interfaces/bookableArea.interface";

import { BookingResponse } from "../../../shared/types/BookingResponse";

const BookingDialog = ({
  bookableAreas,
  onBookingCompleted,
}: {
  bookableAreas: string[];
  onBookingCompleted: () => void;
}) => {
  const [BookingForm, setBookingForm] = useState({
    selectedAreas: [] as string[],
    start_datetime: createDateWithUtcTime(0, 17, 0),
    duration: createDateForDuration(3),
    booked_by: "VID Placeholder",
  });

  const [validBooking, setValidBooking] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const toastMinBookingCooldown = useRef(false);
  const toastMaxBookingCooldown = useRef(false);
  const toastBackendResponse = useRef(false);
  const showToast = (
    severity: "success" | "error" | "warn" | "info",
    summary: string,
    message: string,
    cooldown: number,
    cooldownRef: MutableRefObject<boolean>
  ) => {
    if (cooldownRef.current === false) {
      toast.current?.show({
        severity: severity,
        summary: summary,
        detail: message,
        life: 3000,
      });

      // disable toast and enable after 30 seconds
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, cooldown * 1000);
    }
  };

  useEffect(() => {
    const areaSelectionIsValid = BookingForm.selectedAreas.length !== 0;

    const bookingDurationInMinutes =
      BookingForm.duration.getTime() / (1000 * 60);
    const bookingIsMoreThan30Min = bookingDurationInMinutes >= 30;
    const bookingIsLessThan24Hours = bookingDurationInMinutes <= 24 * 60;

    if (!bookingIsMoreThan30Min) {
      showToast(
        "warn",
        "Booking minimum duration not reached",
        "A booking must have a minimum duration of 30 minutes",
        30,
        toastMinBookingCooldown
      );
    }

    if (!bookingIsLessThan24Hours) {
      showToast(
        "warn",
        "Maximum booking duration reached",
        "A booking must not be longer than 24 hours",
        30,
        toastMaxBookingCooldown
      );
    }

    if (
      areaSelectionIsValid &&
      bookingIsMoreThan30Min &&
      bookingIsLessThan24Hours
    ) {
      setValidBooking(true);
    } else {
      setValidBooking(false);
    }
  }, [BookingForm]);

  const handleChange = (e) => {
    setBookingForm({
      ...BookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmitClick = () => {
    const endDate = new Date(
      BookingForm.start_datetime.getTime() +
        (BookingForm.duration.getTime() -
          BookingForm.duration.getTimezoneOffset() * 60 * 1000)
    );

    //@ts-ignore
    const booking: Booking = {
      start_datetime: BookingForm.start_datetime,
      end_datetime: endDate,
      booked_by: BookingForm.booked_by,
    };
    bookableAreaService
      .addBookingToArea(BookingForm.selectedAreas, booking)
      .then((response) => {
        if (response.status === BookingResponse.BookingSuccess) {
          onBookingCompleted();
        } else if (response.status === BookingResponse.BookingFailure) {
          showToast(
            "error",
            "Could not submit booking",
            "",
            30,
            toastBackendResponse
          );
        } else if (response.status === BookingResponse.DurationOutOfLimits) {
          showToast(
            "warn",
            "Could not submit booking",
            "A booking must not be longer than 24 hours",
            30,
            toastBackendResponse
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const boxStyle = {
    flex: 1,
  };

  return (
    <>
      <Toast ref={toast} />
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="p-inputgroup" style={boxStyle}>
          <span className="p-inputgroup-addon">
            <i className="pi pi-box"></i>
          </span>
          <MultiSelect
            name="selectedAreas"
            value={BookingForm.selectedAreas}
            onChange={handleChange}
            options={bookableAreas}
            style={{ width: "10vw" }}
          />
        </div>
        <Divider layout="vertical" />
        <div className="p-inputgroup" style={boxStyle}>
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Calendar
            name="start_datetime"
            value={BookingForm.start_datetime}
            onChange={handleChange}
            dateFormat="dd.mm.yy"
            showTime
            hourFormat="24"
            style={{ width: "18ch" }}
            tooltip="Begin"
          />
          <span className="p-inputgroup-addon">
            <i className="pi pi-hourglass"></i>
          </span>
          <Calendar
            name="duration"
            timeOnly
            value={BookingForm.duration}
            onChange={handleChange}
            style={{ width: "8ch" }}
            tooltip="Duration"
          />
        </div>
      </div>
      <Divider />
      <div className="p-inputgroup">
        <Button
          label="Book Area"
          severity={validBooking === true ? "success" : "danger"}
          icon={validBooking === true ? "pi pi-check" : "pi pi-times"}
          disabled={!validBooking}
          onClick={handleBookingSubmitClick}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
};

export default BookingDialog;
