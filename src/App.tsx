import "./App.css";
import { Routes, Route } from "react-router";
import PublicLayout from "./layout/PublicLayout";
import BookingPage from "./pages/BookingPage";
import StaffPage from "./pages/StaffPage";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/service/:slug" element={<BookingPage />} />
          <Route path="/staff/:slug" element={<StaffPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
