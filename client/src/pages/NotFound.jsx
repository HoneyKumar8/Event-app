import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useContext(AuthContext);

  return user ? (
    <Navigate to="/events" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default NotFound;
