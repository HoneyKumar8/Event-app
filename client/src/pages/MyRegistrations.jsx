import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Modal from "../components/Modal";

const MyRegistrations = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [modalMessage, setModalMessage] = useState("");

  const fetchRegistrations = async () => {
    const res = await axios.get("/registrations/my");
    setRegistrations(res.data);
  };

  const cancelRegistration = async (eventId) => {
    await axios.delete(`/registrations/${eventId}`);
    setModalMessage("Registration Cancelled!");
    fetchRegistrations();
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Registrations
      </h1>

      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-white p-4 rounded shadow cursor-pointer"
              onClick={() => navigate(`/event/${reg.event._id}`)}
            >
              <h2 className="font-semibold">
                {reg.event.name}
              </h2>
              <p>{reg.event.location}</p>
              <p>
                {new Date(reg.event.date).toLocaleDateString()}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cancelRegistration(reg.event._id);
                }}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </div>
  );
};

export default MyRegistrations;
