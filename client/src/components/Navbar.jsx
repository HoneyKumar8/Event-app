import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login & register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between">
      <Link to="/events" className="font-bold text-lg">
        Bellcorp Events
      </Link>

      {user && (
        <div className="flex gap-4 items-center">
          <Link
            to="/my-registrations"
            className="text-blue-600 font-medium"
          >
            My Registrations
          </Link>
          <Link
  to="/change-password"
  className="text-gray-600 font-medium"
>
  Change Password
</Link>

          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
