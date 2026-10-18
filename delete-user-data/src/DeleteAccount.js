import React, { useState } from "react";
import axios from "axios";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const ApiUrl = process.env.REACT_APP_BACKEND_URL;

  const handleDelete = async () => {
    try {
      if (!password || !email) {
        setMessage(" All input fields are required");
        return;
      }
      const response = await axios.post(`${ApiUrl}/user/deleteMyData`, {
        email,
        password,
      });
      if (response.data.success) {
        setMessage("Account deleted successfully.");
      } else {
        setMessage("Failed to delete account.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-md rounded-md border border-gray-200 text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Delete Account
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={handleDelete}
        className="w-full px-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none"
      >
        Delete Account
      </button>

      {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
    </div>
  );
};

export default DeleteAccount;
