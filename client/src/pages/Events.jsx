import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Events = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    updateURL();
    fetchEvents();
  }, [search, category, location, date, page]);

  const updateURL = () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (location) params.location = location;
    if (date) params.date = date;
    if (page > 1) params.page = page;
    setSearchParams(params);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = { search, category, location, date, page };

      const [eventsRes, registrationsRes] = await Promise.all([
        axios.get("/events", { params }),
        axios.get("/registrations/my"),
      ]);

      setEvents(eventsRes.data.events);
      setTotalPages(eventsRes.data.totalPages);

      const ids = new Set(
        registrationsRes.data.map((r) => r.event?._id)
      );
      setRegisteredIds(ids);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    try {
      setProcessingId(id);
      await axios.post(`/registrations/${id}`);
      setModalMessage("Registration Successful!");
      fetchEvents();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setDate("");
    setPage(1);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => { setPage(1); setCategory(e.target.value); }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Conference">Conference</option>
        </select>

        <select
          value={location}
          onChange={(e) => { setPage(1); setLocation(e.target.value); }}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => { setPage(1); setDate(e.target.value); }}
          className="border p-2 rounded"
        />

        <button
          onClick={clearFilters}
          className="bg-gray-200 rounded p-2"
        >
          Clear
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = registeredIds.has(event._id);
          const isFull = event.registeredCount >= event.capacity;

          return (
            <div
              key={event._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/event/${event._id}`)}
            >
              <h2 className="font-semibold">{event.name}</h2>
              <p>{event.location}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>

              {isRegistered ? (
                <button disabled className="mt-4 w-full border border-green-600 text-green-600 rounded py-2">
                  Registered
                </button>
              ) : isFull ? (
                <button disabled className="mt-4 w-full bg-gray-400 text-white rounded py-2">
                  Fully Booked
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event._id);
                  }}
                  disabled={processingId === event._id}
                  className="mt-4 w-full bg-blue-600 text-white rounded py-2"
                >
                  {processingId === event._id ? "Processing..." : "Register"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );
};

export default Events;
