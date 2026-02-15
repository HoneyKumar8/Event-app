import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Modal from "../components/Modal";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        axios.get("/events"),
        axios.get("/registrations/my"),
      ]);

      const eventsData = eventsRes.data.events || eventsRes.data;
      const registrationsData =
        registrationsRes.data.registrations || registrationsRes.data;

      setEvents(eventsData || []);

      const registeredIds = new Set(
        (registrationsData || []).map((reg) => reg.event?._id)
      );

      setRegisteredEvents(registeredIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      setProcessingId(eventId);

      await axios.post(`/registrations/${eventId}`);

      setModalMessage("Registration Successful!");
      await fetchData();
    } catch (error) {
      setModalMessage(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = registeredEvents.has(event._id);
          const isProcessing = processingId === event._id;

          return (
            <div
              key={event._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/event/${event._id}`)}
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>{event.location}</p>
              <p>
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                {event.registeredCount} / {event.capacity}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isRegistered) handleRegister(event._id);
                }}
                disabled={isRegistered || isProcessing}
                className={`mt-4 w-full py-2 rounded ${
                  isRegistered
                    ? "border border-green-500 text-green-600 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isRegistered
                  ? "Registered ✓"
                  : isProcessing
                  ? "Processing..."
                  : "Register"}
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </div>
  );
};

export default Events;
