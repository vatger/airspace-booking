import { MutableRefObject, useEffect, useRef, useState } from "react";

import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import createDateWithTime from "../utils/date.util";
import { Booking } from "@shared/interfaces/bookableArea.interface";
import bookableAreaService from "services/bookableArea.service";

const BookingDialog = ({
  bookableAreas,
  onBookingCompleted,
}: {
  bookableAreas: string[];
  onBookingCompleted: () => void;
}) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<Date>(
    createDateWithTime(2, 17, 0)
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date>(
    createDateWithTime(2, 20, 0)
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
      selectedStartTime === null ||
      selectedEndTime === null
    ) {
      return;
    }
    const areaSelectionIsValid = selectedAreas.length !== 0;

    const startDate = new Date(
      selectedStartDate.getFullYear(),
      selectedStartDate.getMonth(),
      selectedStartDate.getDate(),
      selectedStartTime.getHours(),
      selectedStartTime.getMinutes()
    );

    const endDate = new Date(
      selectedEndDate.getFullYear(),
      selectedEndDate.getMonth(),
      selectedEndDate.getDate(),
      selectedEndTime.getHours(),
      selectedEndTime.getMinutes()
    );

    const bookingIsMoreThan30Min =
      endDate.getTime() - startDate.getTime() >= 30 * 60 * 1000;
    const bookingIsLessThan24Hours =
      endDate.getTime() - startDate.getTime() <= 24 * 60 * 60 * 1000;

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
  }, [
    selectedAreas,
    selectedStartDate,
    selectedEndDate,
    selectedStartTime,
    selectedEndTime,
  ]);

  const handleBookingSubmitClick = () => {
    const startDate = new Date(
      selectedStartDate.getFullYear(),
      selectedStartDate.getMonth(),
      selectedStartDate.getDate(),
      selectedStartTime.getHours(),
      selectedStartTime.getMinutes()
    );

    const endDate = new Date(
      selectedEndDate.getFullYear(),
      selectedEndDate.getMonth(),
      selectedEndDate.getDate(),
      selectedEndTime.getHours(),
      selectedEndTime.getMinutes()
    );

    //@ts-ignore
    const booking: Booking = {
      start_datetime: startDate,
      end_datetime: endDate,
      booked_by: "VID Placeholder",
    };

    bookableAreaService
      .addBookingToArea(selectedAreas, booking)
      .then(onBookingCompleted);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-box"></i>
        </span>
        <MultiSelect
          value={selectedAreas}
          onChange={(e) => setSelectedAreas(e.value)}
          options={bookableAreas}
        />
      </div>
      <Divider />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-calendar"></i>
        </span>
        <Calendar
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.value as Date)}
          dateFormat="dd.mm.yy"
        />
        <Calendar
          timeOnly
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.value as Date)}
        />
      </div>
      <Divider />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-calendar"></i>
        </span>
        <Calendar
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.value as Date)}
          dateFormat="dd.mm.yy"
        />
        <Calendar
          timeOnly
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.value as Date)}
        />
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
