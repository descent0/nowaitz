import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAppointmentsByShopId, 
  handleRequest, 
  updateAppointmentStatus 
} from '../../store/appointmentSlice';
import { checkShop } from '../../store/shopSlice';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative">
      <div className="w-12 h-12 rounded-full absolute border-4 border-blue-200"></div>
      <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-800 border-t-transparent"></div>
    </div>
    <p className="ml-4 text-blue-800 font-medium">Loading requests...</p>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded shadow-md my-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 my-4">
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <p className="mt-4 text-lg font-medium text-gray-600">{message}</p>
  </div>
);

const PendingRequest = () => {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.shop.shop);
  const shopId = shop?._id;
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);

  const [view, setView] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    dispatch(checkShop());
  }, [dispatch]);

  useEffect(() => {
    if (shopId) {
      loadAppointments();
    }
  }, [dispatch, shopId]);

  const loadAppointments = async () => {
    if (shopId) {
      try {
        await dispatch(fetchAppointmentsByShopId({ shopId })).unwrap();
        setActionError(null);
      } catch (err) {
        console.error('Failed to load appointments:', err);
      }
    }
  };

  const handleRequestStatusChange = async (id, newStatus) => {
    try {
      setActionInProgress(id);
      setActionError(null);
      
      await dispatch(handleRequest({ id, requestStatus: newStatus })).unwrap();
      
      if (shopId) {
        await dispatch(fetchAppointmentsByShopId({ shopId })).unwrap();
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
      setActionError({ id, message: 'Failed to update status. Please try again.' });
    } finally {
      setActionInProgress(null);
    }
  };

  const requests = appointments
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
        appointmentDateTime.setHours(slotHour, slotMinute, 0, 0);

        const isConfirmed = appointment.requestStatus === "Pending";

        return isConfirmed && appointmentDateTime > new Date();
      })
    : [];

  const cancellationRequests = requests?.filter((req) => req.requestType === 'Cancellation') || [];
  const reschedulingRequests = requests?.filter((req) => req.requestType === 'Rescheduling') || [];
  const allRequests = [...cancellationRequests, ...reschedulingRequests];

  const errorMessage = error ? (typeof error === 'object' ? error.message || JSON.stringify(error) : error) : null;

  const renderActionButtons = (request) => (
    <>
      <button
        onClick={() => handleRequestStatusChange(request._id, 'Approved')}
        disabled={actionInProgress === request._id}
        className={`${
          actionInProgress === request._id 
            ? 'bg-green-300 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white px-3 py-1 rounded-md transition duration-200 flex items-center justify-center min-w-[80px]`}
      >
        {actionInProgress === request._id ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </span>
        ) : (
          'Approve'
        )}
      </button>
      <button
        onClick={() => handleRequestStatusChange(request._id, 'Rejected')}
        disabled={actionInProgress === request._id}
        className={`${
          actionInProgress === request._id 
            ? 'bg-red-300 cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white px-3 py-1 rounded-md ml-2 transition duration-200 min-w-[80px]`}
      >
        Reject
      </button>
      {actionError && actionError.id === request._id && (
        <p className="text-xs text-red-600 mt-1">{actionError.message}</p>
      )}
    </>
  );

  const renderContent = () => {
    // Handle main loading state
    if (loading) {
      return <LoadingSpinner />;
    }
    
    // Handle main error state
    if (errorMessage) {
      return <ErrorDisplay message={errorMessage} onRetry={loadAppointments} />;
    }

    // Handle empty shop state
    if (!shopId) {
      return <EmptyState message="No shop information available. Please set up your shop first." />;
    }
    
    let currentRequests = [];
    let emptyMessage = "";
    
    // Determine which requests to show based on view
    switch (view) {
      case 'cancellation':
        currentRequests = cancellationRequests;
        emptyMessage = "No cancellation requests found.";
        break;
      case 'rescheduling':
        currentRequests = reschedulingRequests;
        emptyMessage = "No rescheduling requests found.";
        break;
      case 'all':
      default:
        currentRequests = allRequests;
        emptyMessage = "No pending requests found.";
        break;
    }

    // If there are no requests to display
    if (currentRequests.length === 0) {
      return <EmptyState message={emptyMessage} />;
    }

    // Choose the correct table to render based on the view
    return renderTable(view, currentRequests);
  };

  const renderTable = (viewType, requests) => {
    switch (viewType) {
      case 'cancellation':
        return (
          <table className="w-full mt-4 text-sm sm:text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Customer Name</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Reason</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-t border-blue-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.customer?.name || 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.reason || 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6">
                    {renderActionButtons(request)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'rescheduling':
        return (
          <table className="w-full mt-4 text-sm sm:text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Customer Name</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Proposed Date</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Reason</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-t border-blue-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.customer?.name || 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.rescheduleDate
                      ? new Date(request.rescheduleDate).toLocaleDateString() + " " + 
                        (request.rescheduleSlot || 'N/A')
                      : 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.reason || 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6">
                    {renderActionButtons(request)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'all':
      default:
        return (
          <table className="w-full mt-4 text-sm sm:text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Customer Name</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Type</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Details</th>
                <th className="py-2 sm:py-4 px-4 sm:px-6 text-left text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-t border-blue-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.customer?.name || 'N/A'}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6 text-blue-800">
                    {request.requestType === 'Cancellation'
                      ? request.reason || 'N/A'
                      : `Proposed Date: ${
                          request.rescheduleDate 
                            ? (
                              new Date(request.rescheduleDate).toLocaleDateString()+" "+
                              (request.rescheduleSlot || 'N/A')
                            ) : 'N/A'
                        }`}
                  </td>
                  <td className="py-2 sm:py-4 px-4 sm:px-6">
                    {renderActionButtons(request)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl border-2 border-blue-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-blue-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Appointment Requests</h2>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setView('all')}
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition duration-200 ${
                view === 'all' ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300 text-blue-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setView('cancellation')}
              className={`ml-2 px-3 sm:px-4 py-2 rounded-md font-semibold transition duration-200 ${
                view === 'cancellation' ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300 text-blue-800'
              }`}
            >
              Cancellation
            </button>
            <button
              onClick={() => setView('rescheduling')}
              className={`ml-2 px-3 sm:px-4 py-2 rounded-md font-semibold transition duration-200 ${
                view === 'rescheduling' ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300 text-blue-800'
              }`}
            >
              Rescheduling
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          {view === 'all' && (
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4">
              All Requests
            </h3>
          )}
          
          {view === 'cancellation' && (
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4">
              Cancellation Requests
            </h3>
          )}
          
          {view === 'rescheduling' && (
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4">
              Rescheduling Requests
            </h3>
          )}
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PendingRequest;