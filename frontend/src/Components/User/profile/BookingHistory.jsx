import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAppointmentsByUserId,
  sendRequest 
} from "../../../store/appointmentSlice";
import { useNavigate } from "react-router-dom";

function BookingHistory() {
  const [activeFilter, setActiveFilter] = useState("Confirmed");
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.authUser);
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);
  const requestStatus = useSelector((state) => state.appointments.requestStatus);
  const [pendingRequests, setPendingRequests] = useState({});
  const navigate = useNavigate();
  
  // Modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");
  // Updated time slots from 12:00 PM to 6:00 PM
  const [availableSlots, setAvailableSlots] = useState([
    "12:00 - 13:00", 
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00"
  ]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchAppointmentsByUserId({ userId: user._id }));
    }
  }, [dispatch, user]);

  const filterButtons = [
    { id: "Confirmed", label: "Upcoming", icon: "📅" },
    { id: "Completed", label: "Completed", icon: "✅" },
    { id: "Cancelled", label: "Cancelled", icon: "❌" },
    { id: "all", label: "All Bookings", icon: "📋" },
  ];

  const filteredAppointments = appointments
    ? appointments.filter((appointment) => {
        if (activeFilter === "all") {
          return true;
        }

        if (activeFilter === "Confirmed") {
          const appointmentDate = new Date(appointment.schedule?.[0]?.date);
          const currentDate = new Date();
          const appointmentTime = appointment.schedule?.[0]?.time || "00:00";
          const [hours, minutes] = appointmentTime.split(":").map(Number);
          appointmentDate.setHours(hours, minutes, 0, 0);

          return (
            appointmentDate >= currentDate && // Date is today or in the future
            (appointmentDate > currentDate ||
              appointmentDate.getTime() > currentDate.getTime()) // Time is later than now
          );
        }

        return appointment.status === activeFilter;
      })
    : [];

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(""); // Reset date
    setRescheduleSlot(""); // Reset slot
    setShowRescheduleModal(true);
  };

  // Handle request submission
  const handleRequestSubmit = (appointmentId, requestType) => {
    if (requestType === 'Rescheduling') {
      openRescheduleModal(appointments.find(app => app._id === appointmentId));
      return;
    }
    
    const requestData = {
      requestType,
      requestReason: `Customer requested ${requestType}`,
    };

    dispatch(sendRequest({ id: appointmentId, requestData }));

    setPendingRequests({
      ...pendingRequests,
      [appointmentId]: requestType,
    });
  };

  // Submit reschedule request with modal data
  const submitRescheduleRequest = () => {
    if (!rescheduleDate || !rescheduleSlot) {
      alert("Please select both date and time slot");
      return;
    }

    const requestData = {
      requestType: "Rescheduling",
      requestReason: "Customer requested rescheduling",
      rescheduleDate: rescheduleDate,
      rescheduleSlot: rescheduleSlot,
    };

    dispatch(sendRequest({ id: selectedAppointment._id, requestData }));

    setPendingRequests({
      ...pendingRequests,
      [selectedAppointment._id]: "Rescheduling",
    });

    setShowRescheduleModal(false);
  };

  // Get min date (today) for date picker
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get max date (today + 10 days) for date picker
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10); // Add 10 days to today
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0');
    const day = String(maxDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Loading component
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    // Handle error properly, ensuring we display a string
    const errorMessage =
      typeof error === "object"
        ? error.message || "An unknown error occurred"
        : error;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4">
            ❌
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Appointments
          </h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => dispatch(fetchAppointmentsByUserId({ userId: user._id }))}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No appointments found
  if (!loading && !error && (!appointments || appointments.length === 0)) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-2xl mb-4">
            📅
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-600">
            You don't have any bookings in your history yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Booking History
          </h2>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            {appointments.length} Bookings
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveFilter(button.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  activeFilter === button.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span>{button.icon}</span>
              <span>{button.label}</span>
            </button>
          ))}
        </div>

        {/* Booking Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  // Check if this appointment has a pending request
                  const hasPendingRequest = pendingRequests[appointment._id] || 
                                            appointment.requestStatus === 'pending';
                  
                  return (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.schedule?.[0]?.date
                            ? new Date(
                                appointment.schedule[0].date
                              ).toLocaleDateString()
                            : "N/A"}
                            <br />
                            {appointment.schedule?.[0]?.slot
                              ? appointment.schedule[0].slot.split('-')[0].trim()
                              : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                          {appointment.service[0].name}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => {
                          navigate(
                            `/${appointment.shop.category}/${appointment.shop.shopID}`
                          );
                        }}
                      >
                        <div className="text-sm text-gray-900">
                          {appointment.shop?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          ${appointment.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm
                          ${
                            appointment.status === "Confirmed"
                              ? "bg-blue-50 text-blue-700"
                              : appointment.status === "Completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {
                          appointment.status !== "Confirmed" ? (
                            <div className="text-sm text-gray-500 font-medium">
                              No requests available
                              </div>
                              ) : 
                        hasPendingRequest || appointment.requestStatus === 'Pending' ? (
                          <div className="text-sm text-amber-600 font-medium">
                            Your {pendingRequests[appointment._id] || appointment.requestType} request is pending
                          </div>
                        ) : appointment.requestStatus === 'Approved' ? (
                          <div className="text-sm text-green-600 font-medium">
                            Your {appointment.requestType} request was approved
                          </div>
                        ) : appointment.requestStatus === 'Rejected' ? (
                          <div className="text-sm text-red-600 font-medium">
                            Your {appointment.requestType} request was rejected
                          </div>
                        ) :(
                          <select
                            className="border border-gray-300 rounded-md p-2"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleRequestSubmit(appointment._id, e.target.value);
                              }
                            }}
                          >
                            <option value="" disabled>
                              Request
                            </option>
                            <option value="Rescheduling">Reschedule</option>
                            <option value="Cancellation">Cancel</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reschedule Appointment
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Appointment:</p>
              <p className="font-medium">
                {selectedAppointment?.schedule?.[0]?.date
                  ? new Date(selectedAppointment.schedule[0].date).toLocaleDateString()
                  : "N/A"}{" "}
                at{" "}
                {selectedAppointment?.schedule?.[0]?.slot
                  ? selectedAppointment.schedule[0].slot
                  : "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select New Date (Next 10 Days Only)
              </label>
              <input
                type="date"
                min={getTodayDate()}
                max={getMaxDate()}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select New Time Slot (12 PM - 6 PM)
              </label>
              <select
                value={rescheduleSlot}
                onChange={(e) => setRescheduleSlot(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select a time slot
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRescheduleRequest}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingHistory;