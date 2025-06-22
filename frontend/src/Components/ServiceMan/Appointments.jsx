import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentsByShopId, updateAppointmentStatus } from '../../store/appointmentSlice';
import { checkShop } from '../../store/shopSlice';

const Appointments = () => {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.shop.shop);
  const shopId = shop?._id;
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);

  const [view, setView] = useState('upcoming'); // State to toggle between views

  useEffect(() => {
    dispatch(checkShop());
  }, [dispatch]);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchAppointmentsByShopId({ shopId }));
    }
  }, [dispatch, shopId]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Wait for the update to complete before fetching again
      await dispatch(updateAppointmentStatus({ id, status: newStatus })).unwrap();
      // Then fetch the updated list
      if (shopId) {
        await dispatch(fetchAppointmentsByShopId({ shopId })).unwrap();
      }
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const today = new Date();

  // Divide appointments into upcoming and past
  const upcomingAppointments = appointments && Array.isArray(appointments) 
    ? appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.schedule?.[0]?.date);
        return appointmentDate >= today;
      })
    : [];

  const pastAppointments = appointments && Array.isArray(appointments)
    ? appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.schedule?.[0]?.date);
        return appointmentDate < today;
      })
    : [];

  // Handle error display safely to avoid rendering objects directly
  const errorMessage = error ? (typeof error === 'object' ? error.message || JSON.stringify(error) : error) : null;
  
  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl border-2 border-blue-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-blue-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Appointments</h2>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setView('upcoming')}
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold ${
                view === 'upcoming' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-blue-800'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setView('past')}
              className={`ml-2 px-3 sm:px-4 py-2 rounded-md font-semibold ${
                view === 'past' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-blue-800'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {view === 'upcoming' && (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mt-4 sm:mt-6 ml-3 sm:ml-5">
                Upcoming Appointments
              </h3>
              {upcomingAppointments.length === 0 ? (
                <p className="p-4 text-blue-800">No upcoming appointments found.</p>
              ) : (
                <table className="w-full mt-4 text-sm sm:text-base">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Customer Name</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Service</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Date</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Time</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Status</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-t border-blue-100">
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.customer?.name || 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {Array.isArray(appointment.service)
                            ? appointment.service.map((s) => s.name).join(', ')
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.schedule?.[0]?.date
                            ? new Date(appointment.schedule[0].date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.schedule?.[0]?.slot
                            ? appointment.schedule[0].slot.split('-')[0].trim()
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                              appointment.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                            className="border-2 border-blue-800 rounded-md px-2 sm:px-3 py-1 text-blue-800"
                          >
                            <option value="Confirmed">Confirm</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {view === 'past' && (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mt-4 sm:mt-6 ml-3 sm:ml-5">
                Past Appointments
              </h3>
              {pastAppointments.length === 0 ? (
                <p className="p-4 text-blue-800">No past appointments found.</p>
              ) : (
                <table className="w-full mt-4 text-sm sm:text-base">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Customer Name</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Service</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Date</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Time</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Status</th>
                      <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-t border-blue-100">
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.customer?.name || 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {Array.isArray(appointment.service)
                            ? appointment.service.map((s) => s.name).join(', ')
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.schedule?.[0]?.date
                            ? new Date(appointment.schedule[0].date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                          {appointment.schedule?.[0]?.slot
                            ? appointment.schedule[0].slot.split('-')[0].trim()
                            : 'N/A'}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                              appointment.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                            className="border-2 border-blue-800 rounded-md px-2 sm:px-3 py-1 text-blue-800"
                          >
                            <option value="Confirmed">Confirm</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;