import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import { FrontendBooking } from '../interfaces/FrontendBooking';
import { formatDateTime } from '../utils/dateFormater.util';

import { Booking } from '@/shared/interfaces/bookableArea.interface';

const BookingsDataTable = ({
  bookings,
  handleDelete,
}: {
  bookings: Booking[];
  handleDelete: (rowData: FrontendBooking) => void;
}) => {
  const deleteButtonTemplate = (rowData: FrontendBooking) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleDelete(rowData)}
      />
    );
  };

  return (
    <DataTable value={bookings}>
      <Column field="area_name" header="Area" />
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
  );
};

export default BookingsDataTable;
