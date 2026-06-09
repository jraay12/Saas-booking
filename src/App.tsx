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
import StaffLayout from "./layout/StaffLayout";
import StaffBookingPage from "./pages/staff/BookingPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffSettings from "./pages/staff/StaffSettings";
import NotFound from "./pages/public/NotFoundPage";
import { AuthProvider } from "./provider/AuthProvider";
import { PublicRoute } from "./router/PublicRoutes";
import CreateBusinessPage from "./pages/admin/CreateBusinessPage";
import { AuthRoute } from "./router/AuthRoute";
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/service/:slug" element={<BookingPage />} />
            <Route path="/staff/:slug" element={<StaffPage />} />
            <Route
              path="/booking/:slug/confirmation"
              element={<BookingConfirmation />}
            />
          </Route>


          <Route element={<AuthRoute />}>
            <Route path="/create/business" element={<CreateBusinessPage />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/services" element={<Service />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/staff" element={<Staff />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
            <Route element={<StaffLayout />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/bookings" element={<StaffBookingPage />} />
              <Route path="/staff/settings" element={<StaffSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
