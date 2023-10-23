import {
  BookableArea,
  Booking,
} from "@/shared/interfaces/bookableArea.interface";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  formatDateOnly,
  formatEndTime,
  formatTimeOnly,
} from "../utils/dateFormater.util";
import { Timeline } from "primereact/timeline";

import "../style/DataTable.css";
import "../style/Overview.css";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";

const OverviewBookingSchedule = ({
  bookableAreas,
}: {
  bookableAreas: BookableArea[];
}) => {
  // sort areas alphabetically
  const sortedBookableAreas = [...bookableAreas].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Function to get the date for a specific day offset from today
  const getDateForDay = (dayOffset: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

  const days: Date[] = [];
  for (let i = 0; i <= 6; i++) {
    days.push(getDateForDay(i));
  }

  return (
    <div key={"BookingAreaOverview"}>
      <DataTable value={sortedBookableAreas} className="datatable-scrollbar">
        <Column
          align={"center"}
          field="name"
          header="Area"
          body={(data: BookableArea) => Areas(data)}
        />
        {days.map((day: Date) => (
          <Column
            key={"Column: " + day.toISOString()}
            align={"center"}
            style={{ margin: "0,0,0,0" }}
            header={formatDateOnly(day)}
            body={(data: BookableArea) => Bookings(data.bookings, day)}
          />
        ))}
      </DataTable>
    </div>
  );
};

const Areas = (area: BookableArea) => {
  return (
    <>
      <div className="fl-container">
        <div style={{ fontWeight: "bold" }}>{area.name}</div>
        <div className="fl-max">FL{area.maximum_fl}</div>
        <Divider style={{ maxWidth: "25%" }} />
        <div className="fl-min">FL{area.minimum_fl}</div>
      </div>
    </>
  );
};

const Bookings = (bookings: Booking[], day: Date) => {
  // check if bookings contains a booking for day
  const filteredBookings = getBookingsForDay(bookings, day);

  // Sort filteredBookings by start_datetime
  filteredBookings.sort((bookingA: Booking, bookingB: Booking) => {
    return (
      bookingA.start_datetime.getTime() - bookingB.start_datetime.getTime()
    );
  });

  return (
    <>
      <div style={{ alignContent: "center" }}>
        {filteredBookings.map((booking: Booking) => (
          <div key={booking._id} style={{ margin: "1vh 0 1vh 0" }}>
            <Card onClick={() => {}}>
              <Timeline
                style={{ marginLeft: "-4.5vw" }}
                value={[
                  `${formatTimeOnly(booking.start_datetime)}`,
                  `${formatEndTime(
                    booking.start_datetime,
                    booking.end_datetime
                  )}`,
                ]}
                align="top"
                content={(item) => item}
              />
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

// checks if bookings contains a booking for given day
const getBookingsForDay = (bookings: Booking[], day: Date) => {
  // Filter the bookings that have a date that matches 'day'
  return bookings.filter((booking) => {
    return isSameDay(new Date(booking.start_datetime), day);
  });
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default OverviewBookingSchedule;
