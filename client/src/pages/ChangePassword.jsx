import { useState } from "react";
import axios from "../api/axios";
import Modal from "../components/Modal";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setModalMessage(res.data.message);
    } catch (error) {
      setModalMessage(
        error.response?.data?.message || "Error occurred"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          required
          className="w-full border p-2 mb-3"
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          required
          className="w-full border p-2 mb-3"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <Modal
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </div>
  );
};

export default ChangePassword;
