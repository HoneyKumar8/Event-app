import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const MyRegistrations = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/registrations/my");
      setRegistrations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      setProcessingId(eventId);
      await axios.delete(`/registrations/${eventId}`);
      setModalMessage("Registration Cancelled!");
      fetchRegistrations();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const now = new Date();

  const upcoming = registrations.filter(
    (reg) => new Date(reg.event?.date) >= now
  );

  const past = registrations.filter(
    (reg) => new Date(reg.event?.date) < now
  );

  // Sort upcoming by nearest date
  const sortedUpcoming = [...upcoming].sort(
    (a, b) =>
      new Date(a.event.date) - new Date(b.event.date)
  );

  const nextUpcoming = sortedUpcoming[0];

  const renderCard = (reg) => (
    <div
      key={reg._id}
      className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/event/${reg.event?._id}`)}
    >
      <h2 className="text-lg font-semibold">
        {reg.event?.name}
      </h2>

      <p className="text-gray-600">
        {reg.event?.location}
      </p>

      <p className="text-gray-500 text-sm">
        {new Date(reg.event?.date).toLocaleDateString()}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCancel(reg.event?._id);
        }}
        disabled={processingId === reg.event?._id}
        className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        {processingId === reg.event?._id
          ? "Processing..."
          : "Cancel Registration"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Registrations
      </h1>

      {/* 📊 SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Registered</p>
          <h2 className="text-2xl font-bold">
            {registrations.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Upcoming Events</p>
          <h2 className="text-2xl font-bold text-green-600">
            {upcoming.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Past Events</p>
          <h2 className="text-2xl font-bold text-gray-600">
            {past.length}
          </h2>
        </div>
      </div>

      {/* 🌟 NEXT UPCOMING HIGHLIGHT */}
      {nextUpcoming && (
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-8">
          <h2 className="font-semibold text-green-700 mb-2">
            Next Upcoming Event
          </h2>
          <p className="font-medium">
            {nextUpcoming.event.name}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(
              nextUpcoming.event.date
            ).toLocaleDateString()} —{" "}
            {nextUpcoming.event.location}
          </p>
        </div>
      )}

      {/* UPCOMING SECTION */}
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Upcoming Events
      </h2>

      {upcoming.length === 0 ? (
        <p className="mb-6 text-gray-500">
          No upcoming events.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sortedUpcoming.map(renderCard)}
        </div>
      )}

      {/* PAST SECTION */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Past Events
      </h2>

      {past.length === 0 ? (
        <p className="text-gray-500">
          No past events.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {past.map(renderCard)}
        </div>
      )}

      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage("")}
        />
      )}
    </div>
  );
};

export default MyRegistrations;
