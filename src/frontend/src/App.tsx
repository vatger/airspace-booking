import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import { AuthProvider } from './contexts/AuthProvider';
import BookingPage from './pages/Booking.page';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export function App() {
  return (
    <>
      <Header />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<BookingPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
