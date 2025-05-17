import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { checkShop, logoutShop } from '../../store/shopSlice';
import { getServicesByShopId } from '../../store/serviceSlice';
import { fetchAppointmentsByShopId } from '../../store/appointmentSlice';
import Schedule from './Schedule';
import { logoutUser } from '../../store/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const shop = useSelector((state) => state.shop.shop);
  const shopId = shop?._id;

  const services = useSelector((state) => state.services.services) || [];
  const appointments = useSelector((state) => state.appointments.appointments) || [];

  const loadingServices = useSelector((state) => state.services.loading);
  const loadingAppointments = useSelector((state) => state.appointments.loading);
  const loadingShop = useSelector((state) => state.shop.loading);

  const errorServices = useSelector((state) => state.services.error);
  const errorAppointments = useSelector((state) => state.appointments.error);
  const errorShop = useSelector((state) => state.shop.error);

  // Check authentication first, before attempting to load any data
  useEffect(() => {
    const checkAuthentication = async () => {
      await dispatch(checkShop());
      setIsInitialized(true);
    };
    
    checkAuthentication();
  }, [dispatch]);

  // Only fetch shop-specific data when we have a shop and shopId
  useEffect(() => {
    if (isInitialized && shopId) {
      dispatch(getServicesByShopId(shopId));
      dispatch(fetchAppointmentsByShopId({ shopId }));
    }
  }, [dispatch, shopId, isInitialized]);

  // Handle redirect when not authenticated
  useEffect(() => {
    if (isInitialized && !shop && !loadingShop) {
      navigate("/login", { replace: true });
    }
  }, [shop, navigate, isInitialized, loadingShop]);

  const handleShopLogout = async (e) => {
    e.preventDefault();
    try {
      setShowDropdown(false);
      await dispatch(logoutShop()).unwrap();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 50);
    } catch (error) {
      console.log("Error during logout:", error);
      navigate("/login", { replace: true });
    }
  };

  const today = new Date();
  // Make sure appointments is defined before filtering
  const totalTodayAppointments = appointments?appointments.filter((appointment) => {
    if (
      !appointment ||
      !appointment.schedule ||
      !appointment.schedule[0] ||
      !appointment.schedule[0].date
    ) {
      return false;
    }
    const appointmentDate = new Date(appointment.schedule[0].date);
    const isToday =

      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate();
   
    const isConfirmed = appointment.status != "Cancelled";
    return isToday && isConfirmed;
  }) : [];


  const todayAppointments = appointments
  ? appointments.filter((appointment) => {
      if (
        !appointment ||
        !appointment.schedule ||
        !appointment.schedule[0] ||
        !appointment.schedule[0].date
      ) {
        return false;
      }

      const appointmentDate = new Date(appointment.schedule[0].date);
      const isToday =
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate();
        const [slotHour, slotMinute] = appointment.schedule[0].slot
        .split('-')[0]
        .trim()
        .split(':')
        .map(Number);
      const slotTime = new Date();
      slotTime.setHours(slotHour, slotMinute, 0, 0);

  
      const isConfirmed = appointment.status === "Confirmed";

      return isToday && isConfirmed && slotTime > today;

    })
  : [];

  const pendingUpcomingRequest = appointments
  ? appointments.filter((appointment) => {
      if (
        !appointment ||
        !appointment.schedule ||
        !appointment.schedule[0] ||
        !appointment.schedule[0].date ||
        !appointment.schedule[0].slot
      ) {
        return false;
      }

      const [slotHour, slotMinute] = appointment.schedule[0].slot
        .split('-')[0]
        .trim()
        .split(':')
        .map(Number);

      const appointmentDateTime = new Date(appointment.schedule[0].date);
      appointmentDateTime.setHours(slotHour, slotMinute, 0, 0); // Set the time from the slot

      const isConfirmed = appointment.requestStatus === "Pending";

      return isConfirmed && appointmentDateTime > new Date();
    })
  : [];


  console.log("pending appointemnt",pendingUpcomingRequest);

  // Safely calculate revenue
  const totalRevenue = todayAppointments.reduce((total, appointment) => 
    total + (appointment.totalAmount || 0), 0);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Improved loading state handling
  if (!isInitialized || loadingShop) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication information...</div>;
  }

  if (!shop) {
    // If we're not loading and don't have a shop, we should redirect
    // This serves as a fallback in case the useEffect redirect doesn't fire
    return null;
  }

  if (loadingServices || loadingAppointments) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard data...</div>;
  }

  if (errorShop) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error fetching shop details: {errorShop}</div>;
  }

  if (errorServices) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error fetching services: {errorServices}</div>;
  }

  if (errorAppointments) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error fetching appointments: {errorAppointments}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      {/* Shop Sign */}
      <div className="bg-white text-center p-8 rounded-lg shadow-xl mb-8 bg-gradient-to-r from-blue-800 to-blue-900 transform relative">
        <h1 className="text-4xl font-bold text-white font-serif tracking-wider">
          {shop?.name || 'My Shop'}
        </h1>
        <div className="text-blue-200 text-lg mt-2">{shop?.location || 'Location'}</div>

        {/* Profile Icon */}
        <div className="absolute top-4 right-4">
          <div
            className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors"
            onClick={toggleDropdown}
          >
            👤
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                  <Link to="shop-look">Your Shop</Link>
                </li>
                <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                  <button onClick={handleShopLogout}>Sign Out</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Window - Quick Stats */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-blue-800">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-6 h-6 mr-2 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs">S</span>
            Today's Business
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="mx-auto text-2xl text-blue-800 mb-2 font-bold">👥</div>
              <p className="text-3xl font-bold text-blue-800">{totalTodayAppointments.length}</p>
              <p className="text-sm text-blue-600">Appointments Today</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="mx-auto text-2xl text-blue-800 mb-2 font-bold">💰</div>
              <p className="text-3xl font-bold text-blue-800">${totalRevenue}</p>
              <p className="text-sm text-blue-600">Today's Revenue</p>
            </div>
            <Link to={"pending-requests"}>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="mx-auto text-2xl text-blue-800 mb-2 font-bold">🙏🏻</div>
              <p className="text-3xl font-bold text-blue-800">{pendingUpcomingRequest.length}</p>
              <p className="text-sm text-blue-600">Pending Request</p>
            </div>
            </Link>
          </div>
        </div>

        {/* Center Window - Quick Actions */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-blue-800">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-6 h-6 mr-2 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs">T</span>
            Shop Management
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="appointments" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 mb-2 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">📅</div>
              <span className="text-blue-800">Appointments</span>
            </Link>
            <Link to="services" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 mb-2 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">🛍️</div>
              <span className="text-blue-800">Services</span>
            </Link>
            <Link to="schedule" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 mb-2 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">⏰</div>
              <span className="text-blue-800">Schedule</span>
            </Link>
            <Link to="manage-employee" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 mb-2 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">👤</div>
              <span className="text-blue-800">Team</span>
            </Link>
          </div>
        </div>

        {/* Right Window - Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-blue-800">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-6 h-6 mr-2 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs">N</span>
            Next in Line
          </h2>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment._id} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-800">
                  <div className="font-bold text-blue-800">{appointment.customer?.name || 'N/A'}</div>
                  <div className="text-sm text-blue-600">
                    <span>{Array.isArray(appointment.service) ? appointment.service.map((s) => s?.name || 'Unknown').join(', ') : 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <span>{appointment.schedule && appointment.schedule[0] ? appointment.schedule[0].slot.split('-')[0].trim() : 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-800">
                No appointments remaining for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;