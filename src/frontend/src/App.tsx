import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingPage from "./pages/Booking.page";
import Header from "./components/Header";
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="*" element={<BookingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
