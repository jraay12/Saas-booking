import "./App.css";
import { Routes, Route } from "react-router";
import PublicLayout from "./layout/PublicLayout";
import BookingPage from "./pages/public/BookingPage";
import StaffPage from "./pages/public/StaffPage";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Service from "./pages/admin/Service";
import Bookings from "./pages/admin/Bookings";
import Staff from "./pages/admin/Staff";
import Settings from "./pages/admin/Settings";
import RegisterPage from "./pages/public/RegisterPage";
import LoginPage from "./pages/public/LoginPage";
import ProtectedRoute from "./router/ProtectedRoutes";
import PublicRoute from "./router/PublicRoutes";
function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <PublicRoute>
              <PublicLayout />
            </PublicRoute>
          }
        >
          <Route path="/service/:slug" element={<BookingPage />} />
          <Route path="/staff/:slug" element={<StaffPage />} />
          <Route
            path="/booking/:slug/confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/services" element={<Service />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
