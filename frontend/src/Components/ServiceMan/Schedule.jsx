import React, { useEffect, useState } from "react";
import DateSlider from "../utilComp/DateSlider";
import EmployeeSlider from "../utilComp/EmployeeSlider";
import { useDispatch, useSelector } from "react-redux";
import { checkShop } from "../../store/shopSlice";
import { fetchScheduleByDateAndEmployee, updateSchedule, deleteSchedule } from './../../store/scheduleSlice';
import { getEmployeesByShopId } from "../../store/employeeSlice";

const Schedule = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewType, setViewType] = useState("grid"); // "grid" or "string"
  const [statusMessage, setStatusMessage] = useState(""); 

  const dispatch = useDispatch();
  const shopData = useSelector((state) => state.shop.shop);
  const schedules = useSelector((state) => state.schedule.schedules);
  const shopId = shopData?._id;

  useEffect(() => {
    dispatch(checkShop());
    if (shopId) {
      dispatch(getEmployeesByShopId(shopId));
    }
  }, [dispatch, shopId]);

  useEffect(() => {
    if (selectedDate && selectedEmployee) {
      let date;
      console.log("Selected date under useEffect:", selectedDate);
      if (typeof selectedDate === 'string') {
        const [year, month, day] = selectedDate.split('-').map(Number);
        date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      } else if (selectedDate instanceof Date) {
        // Ensure we clear time part and use UTC
        date = new Date(Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0, 0, 0
        ));
      } else {
        console.error("selectedDate is not a string or Date:", selectedDate);
        return;
      }
  
      console.log("Adjusted date in UTC:", date.toISOString());
  
      dispatch(
        fetchScheduleByDateAndEmployee({
          date: date.toISOString(),
          employeeId: selectedEmployee,
        })
      );
    }
  }, [dispatch, selectedDate, selectedEmployee]);
    
  const getSlotStatus = (slot) => {
    return slot?.isBooked ? 'Booked' : 'Available';
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get('status');
    const slotData = {
      time: selectedSlot.slot,
      isBooked: status === 'booked' // Convert to boolean for consistency
    };

    try {
      if (selectedSlot._id) {
        await dispatch(updateSchedule({
          id: selectedSlot._id,
          data: { ...selectedSlot, ...slotData }
        }));
        setStatusMessage('Slot updated successfully!');
      }
      setShowForm(false);
      
      // Refresh the schedule data after update
      if (selectedDate && selectedEmployee) {
        let date;
        if (typeof selectedDate === 'string') {
          const [year, month, day] = selectedDate.split('-').map(Number);
          date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        } else if (selectedDate instanceof Date) {
          date = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0, 0, 0
          ));
        }
        
        dispatch(
          fetchScheduleByDateAndEmployee({
            date: date.toISOString(),
            employeeId: selectedEmployee,
          })
        );
      }
    } catch (error) {
      setStatusMessage('Error updating slot');
      console.error('Update error:', error);
    }
  };

  const handleDeleteSlot = async () => {
    try {
      if (selectedSlot?._id) {
        await dispatch(deleteSchedule(selectedSlot._id));
        setStatusMessage('Slot deleted successfully!');
        setShowForm(false);
        
        // Refresh the schedule data after deletion
        if (selectedDate && selectedEmployee) {
          let date;
          if (typeof selectedDate === 'string') {
            const [year, month, day] = selectedDate.split('-').map(Number);
            date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
          } else if (selectedDate instanceof Date) {
            date = new Date(Date.UTC(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              0, 0, 0
            ));
          }
          
          dispatch(
            fetchScheduleByDateAndEmployee({
              date: date.toISOString(),
              employeeId: selectedEmployee,
            })
          );
        }
      }
    } catch (error) {
      setStatusMessage('Error deleting slot');
      console.error('Delete error:', error);
    }
  };

  const renderStringView = () => {
    return (
      <div className="space-y-4">
        {schedules.map((slot) => {
          const status = getSlotStatus(slot);
          return (
            <div
              key={slot._id}
              onClick={() => handleSlotClick(slot)}
              className="p-4 bg-white rounded-lg shadow-md border-2 border-blue-800 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">{slot.slot}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${status === 'Booked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {schedules.map((slot) => {
          const status = getSlotStatus(slot);
          return (
            <div
              key={slot._id}
              onClick={() => handleSlotClick(slot)}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${status === 'Booked' ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-green-200 bg-green-50 hover:bg-green-100'}`}
            >
              <span className="block font-medium text-center text-blue-800">{slot.slot}</span>
              <span className="block text-sm text-center text-blue-600">{status}</span>
              {slot.customerName && (
                <span className="block text-xs text-center mt-1 text-blue-600 truncate">
                  {slot.customerName}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md z-50 mb-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Schedule Management</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setViewType(viewType === "grid" ? "string" : "grid")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                {viewType === "grid" ? "String View" : "Grid View"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {/* Date and Employee Sliders */}
        <div className="bg-white rounded-lg shadow-xl border-2 border-blue-800 p-6 mb-6">
          <DateSlider selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          
          {selectedDate && (
            <div className="mt-6">
              <EmployeeSlider
                shopId={shopId}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
              />
            </div>
          )}
        </div>

        {/* Schedule View */}
        {selectedEmployee && selectedDate && (
          <div className="bg-white rounded-lg shadow-xl border-2 border-blue-800 p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Schedule</h2>
            {schedules && schedules.length > 0 ? (
              viewType === "grid" ? renderGridView() : renderStringView()
            ) : (
              <p className="text-center text-gray-500">No schedules available for this date and employee.</p>
            )}
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg border-2 border-blue-800">
            {statusMessage}
            <button 
              onClick={() => setStatusMessage("")} 
              className="ml-4 text-blue-600 hover:text-blue-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-blue-900/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border-2 border-blue-800 p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-blue-800 mb-4">
                {selectedSlot ? 'Edit Slot' : 'Add New Slot'}
              </h2>
              <form onSubmit={handleSlotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={selectedSlot?.isBooked ? 'booked' : 'available'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    name="time"
                    defaultValue={selectedSlot?.slot || ''}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {selectedSlot && (
                <div className="mt-4 border-t border-blue-100 pt-4">
                  <button
                    onClick={handleDeleteSlot}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Delete Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;