import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "./components/header";
import BookingPage from "components/booking";

function App() {
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
