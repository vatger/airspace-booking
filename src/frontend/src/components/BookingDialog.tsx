import { MutableRefObject, useEffect, useRef, useState } from "react";

import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { createDateForDuration, createDateWithTime } from "../utils/date.util";

import bookableAreaService from "../services/bookableArea.service";

import { Booking } from "@/shared/interfaces/bookableArea.interface";

const BookingDialog = ({
  bookableAreas,
  onBookingCompleted,
}: {
  bookableAreas: string[];
  onBookingCompleted: () => void;
}) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(
    createDateWithTime(0, 17, 0)
  );
  const [selectedDuration, setSelectedDuration] = useState<Date>(
    createDateForDuration(3)
  );

  const [validBooking, setValidBooking] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const toastMinBookingCooldown = useRef(false);
  const toastMaxBookingCooldown = useRef(false);
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
    if (
      selectedAreas === null ||
      selectedStartDate === null ||
      selectedDuration === null
    ) {
      return;
    }
    const areaSelectionIsValid = selectedAreas.length !== 0;

    const bookingIsMoreThan30Min = selectedDuration.getTime() >= 30 * 60 * 1000;
    const bookingIsLessThan24Hours =
      selectedDuration.getTime() <= 24 * 60 * 60 * 1000;

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
  }, [selectedAreas, selectedDuration, selectedStartDate]);

  const handleBookingSubmitClick = () => {
    const endDate = new Date(
      selectedStartDate.getTime() +
        (selectedDuration.getTime() -
          selectedDuration.getTimezoneOffset() * 60 * 1000)
    );

    //@ts-ignore
    const booking: Booking = {
      start_datetime: selectedStartDate,
      end_datetime: endDate,
      booked_by: "VID Placeholder",
    };
    bookableAreaService
      .addBookingToArea(selectedAreas, booking)
      .then((response) => {
        onBookingCompleted();
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
            value={selectedAreas}
            onChange={(e) => setSelectedAreas(e.value)}
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
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.value as Date)}
            dateFormat="dd.mm.yy"
            showTime
            hourFormat="24"
            style={{ width: "18ch" }}
          />
          <span className="p-inputgroup-addon">
            <i className="pi pi-hourglass"></i>
          </span>
          <Calendar
            timeOnly
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.value as Date)}
            style={{ width: "8ch" }}
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
