import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Modal from "../components/Modal";


const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, registrationsRes] = await Promise.all([
        axios.get(`/events/${id}`),
        axios.get("/registrations/my"),
      ]);

      setEvent(eventRes.data);

      const registeredIds = new Set(
        registrationsRes.data.map((reg) => reg.event?._id)
      );

      setIsRegistered(registeredIds.has(id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setProcessing(true);
      await axios.post(`/registrations/${id}`);
      setModalMessage("Registration Successful!");
      await fetchData();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      await axios.delete(`/registrations/${id}`);
      setModalMessage("Registration Cancelled!");
      await fetchData();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Event not found
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 font-medium"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

        <p className="mb-2"><strong>Organizer:</strong> {event.organizer}</p>
        <p className="mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="mb-2">
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="mb-2"><strong>Category:</strong> {event.category}</p>
        <p className="mb-4"><strong>Description:</strong> {event.description}</p>

        <p className="mb-4">
          <strong>Capacity:</strong> {event.registeredCount} / {event.capacity}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
  <div
    className="bg-blue-600 h-3 rounded-full"
    style={{
      width: `${(event.registeredCount / event.capacity) * 100}%`,
    }}
  />
</div>

        {isRegistered ? (
          <button
            onClick={handleCancel}
            disabled={processing}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {processing ? "Processing..." : "Cancel Registration"}
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Fully Booked
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={processing}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {processing ? "Processing..." : "Register"}
          </button>
        )}
      </div>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );
};

export default EventDetails;
