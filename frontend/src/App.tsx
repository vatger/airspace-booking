import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BookingPage from "./components/booking";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<BookingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
