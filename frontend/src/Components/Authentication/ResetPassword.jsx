import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/userSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const { error, message: globalMessage } = useSelector(
    (state) => state.authUser
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      dispatch(resetPassword({ token, password }));
      setMessage("✅ Password reset successful");
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Error resetting password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔐 Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Reset Password
          </button>
        </form>

        {/* Local error message */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}

        {/* Global Redux error or success */}
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">❌ {error}</p>
        )}
        {globalMessage && !error && (
          <p className="mt-2 text-center text-sm text-green-600">
            ✅ {globalMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
