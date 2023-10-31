import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { Toolbar } from 'primereact/toolbar';
import { useContext, useEffect, useState } from 'react';

import BookingDialog from '../components/BookingDialog';
import BookingsDataTable from '../components/BookingsDataTable';
import OverviewBookingSchedule from '../components/OverviewBookingSchedule';
import AuthContext from '../contexts/AuthProvider';
import { FrontendBooking } from '../interfaces/FrontendBooking';
import AuthService from '../services/auth.service';
import bookableAreaService from '../services/bookableArea.service';
import sortBookingsByStartEndDate from '../utils/bookingSorter.util';


import { BookableArea } from '@/shared/interfaces/bookableArea.interface';
import { FrontendSettings } from '@/shared/interfaces/config.interface';
import User from '@/shared/interfaces/user.interface';


const BookingPage = () => {
  const [config, setConfig] = useState<FrontendSettings>();
  const [bookableAreas, setBookableAreas] = useState<BookableArea[]>([]);
  const [bookings, setBookings] = useState<FrontendBooking[]>([]);
  const [user, setUser] = useState<User>();
  const auth: any = useContext(AuthContext);
  const [showNewBookingDialog, setShowNewBookingDialog] =
    useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  async function logout() {
    await AuthService.logout();

    window.location.reload();
  }

  const fetchAndSetBookings = async () => {
    try {
      const data = await bookableAreaService.getBookableAreas();
      const convertedBookableAreaData: BookableArea[] = data.map(
        (element: BookableArea) => {
          // Convert start_datetime within bookings to Date objects
          const bookings = element.bookings.map((booking) => ({
            ...booking,
            start_datetime: new Date(booking.start_datetime), // Convert to Date
            end_datetime: new Date(booking.end_datetime),
          }));

          return {
            _id: element._id,
            name: element.name,
            minimum_fl: element.minimum_fl,
            maximum_fl: element.maximum_fl,
            bookings: bookings, // Updated bookings array
          };
        },
      );

      const sortedBookableAreaData = convertedBookableAreaData.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });

      setBookableAreas(sortedBookableAreaData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndSetBookings();
  }, []);

  useEffect(() => {
    setUser(auth.auth.user);

    AuthService.getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });
    return () => { };
  }, [auth]);


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

  const redirectToVatsimAuth = () => {
    const authUrl = [
      config?.vatsimAuthUrl,
      '/oauth/authorize',
      '?',
      'client_id=',
      config?.clientId,
      '&',
      'redirect_uri=',
      window.location.protocol,
      '//',
      window.location.host,
      '/api/v1/auth/login',
      '&',
      'response_type=code',
      '&',
      'scope=full_name+vatsim_details',
      '&',
      'required_scopes=full_name+vatsim_details',
      '&',
      'approval_prompt=auto',
    ].join('');
    window.location.replace(authUrl);
  };

  const startContent = [
    <Button
      key={'Toolbar-StartContent-Button'}
      label="New"
      icon="pi pi-plus"
      className="mr-2"
      onClick={() => setShowNewBookingDialog(true)}
    />,
  ];

  const endContent = [
    <div className={`${!auth.auth.user ? 'hidden' : ''} ml-2`}>
      {user?.apidata.cid}
    </div>,
    <Button
      key={'Toolbar-EndContent-Button'}
      label="Login"
      className="mr-2"
      onClick={() => redirectToVatsimAuth()}
    />,
  ];

  const handleDelete = (rowData: FrontendBooking) => {
    if (rowData._id !== null) {
      bookableAreaService.deleteBooking(rowData._id, rowData.area_name);
      setBookableAreas((prevBookableAreas) =>
        prevBookableAreas.map((bookableArea) => {
          if (bookableArea.name === rowData.area_name) {
            const updatedBookings = bookableArea.bookings.filter(
              (booking) => booking._id !== rowData._id,
            );
            return { ...bookableArea, bookings: updatedBookings };
          }
          return bookableArea;
        }),
      );
    }
  };

  const handleBookingCompleted = () => {
    setShowNewBookingDialog(false);
    fetchAndSetBookings();
  };

  return (
    <div className="p-grid p-dir-col">
      <Toolbar start={startContent} end={endContent} />
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
      <TabMenu
        model={[
          { label: 'Overview', icon: 'pi pi-fw pi-align-left' },
          { label: 'All Bookings', icon: 'pi pi-fw pi-bars' },
        ]}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
      {activeIndex === 0 && (
        <OverviewBookingSchedule bookableAreas={bookableAreas} />
      )}
      {activeIndex === 1 && (
        <BookingsDataTable bookings={bookings} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default BookingPage;
