import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import { ScrollPanel } from "primereact/scrollpanel";

import "../style/ScrollPanel.css";

import {
  BookableArea,
  Booking,
} from "@shared/interfaces/bookableArea.interface";

import { formatDateOnly, formatTimeOnly } from "utils/dateFormater.util";
import React from "react";

interface DateRecord {
  day: Date;
  bookings: Booking[];
}

const BookingAreaOverview = ({
  bookableAreas,
}: {
  bookableAreas: BookableArea[];
}) => {
  const bookedAreas = bookableAreas.filter((area) => area.bookings.length > 0);

  const BookingTemplate = ({ booking }: { booking: Booking }) => {
    return (
      <Timeline
        value={[
          formatTimeOnly(booking.start_datetime),
          formatTimeOnly(booking.end_datetime),
        ]}
        align="top"
        content={(item) => item}
        style={{ width: "25%" }}
      />
    );
  };

  return (
    <div key={"BookedAreasOverview"}>
      {bookedAreas.map((bookedArea: BookableArea) => {
        const dateRecords: DateRecord[] = splitAndSortBookings(
          bookedArea.bookings
        );

        return (
          <div key={bookedArea._id}>
            <Card title={bookedArea.name}>
              {dateRecords.map((element: DateRecord) => {
                return (
                  <div key={element.day.toDateString()}>
                    <Divider>{formatDateOnly(element.day)}</Divider>
                    <ScrollPanel
                      style={{
                        width: "95vw",
                        height: "20vh",
                      }}
                      className="custombar1"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {element.bookings.map(
                          (booking: Booking, index: number) => {
                            return (
                              <React.Fragment key={booking._id}>
                                <Card
                                  title={booking.booked_by}
                                  style={{ margin: "0 0 1vh 0" }}
                                >
                                  <BookingTemplate booking={booking} />
                                </Card>
                                {element.bookings.length > 1 &&
                                  index !== element.bookings.length - 1 && (
                                    <Divider layout="vertical" />
                                  )}
                              </React.Fragment>
                            );
                          }
                        )}
                      </div>
                    </ScrollPanel>
                  </div>
                );
              })}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

function splitAndSortBookings(bookings: Booking[]): DateRecord[] {
  // Create an array to store the DateRecord objects
  const dateRecords: DateRecord[] = [];

  // Iterate through the bookings array
  for (const booking of bookings) {
    if (!(booking.start_datetime instanceof Date)) {
      booking.start_datetime = new Date(booking.start_datetime);
    }
    if (!(booking.end_datetime instanceof Date)) {
      booking.end_datetime = new Date(booking.end_datetime);
    }

    // Extract the date (year, month, day) from the booking's start_datetime
    const bookingDay = new Date(
      booking.start_datetime.getUTCFullYear(),
      booking.start_datetime.getUTCMonth(),
      booking.start_datetime.getUTCDate()
    );

    // Check if there is a DateRecord for the current booking's date
    const existingDateRecord = dateRecords.find(
      (record) => record.day.getTime() === bookingDay.getTime()
    );

    if (existingDateRecord) {
      // Add the booking to the existing DateRecord
      existingDateRecord.bookings.push(booking);
    } else {
      // Create a new DateRecord for the booking's date
      const newDateRecord: DateRecord = {
        day: new Date(bookingDay),
        bookings: [booking],
      };
      // Add the new DateRecord to the dateRecords array
      dateRecords.push(newDateRecord);
    }
  }
  // Sort DateRecord objects by date and bookings by time
  dateRecords.sort((a, b) => a.day.getTime() - b.day.getTime());
  dateRecords.forEach((record) => {
    record.bookings.sort(
      (a, b) => a.start_datetime.getTime() - b.start_datetime.getTime()
    );
  });

  return dateRecords;
}
export default BookingAreaOverview;
