import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import EventDetails from "./pages/EventDetails";
import NotFound from "./pages/NotFound";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/change-password"
  element={
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  }
/>

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
  path="/event/:id"
  element={
    <ProtectedRoute>
      <EventDetails />
    </ProtectedRoute>
  }
/>
<Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;
