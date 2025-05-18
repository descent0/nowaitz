import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DateSlider from "../utilComp/DateSlider";
import EmployeeSlider from "../utilComp/EmployeeSlider";
import ServiceSlider from "../utilComp/ServiceSlider";
import {
  fetchScheduleByDateAndEmployee,
  updateSchedule,
} from "../../store/scheduleSlice";
import { getAllShopByShopId } from "../../store/shopSlice";
import { getEmployeesByShopId } from "../../store/employeeSlice";
import { getServicesByShopId } from "../../store/serviceSlice";
import PaymentComponent from "../utilComp/Payment";

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedService, setSelectedService] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [viewType, setViewType] = useState("grid");
  const [statusMessage, setStatusMessage] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [amount,setAmount]=useState(0);
  const[appointmentData,setAppointmentData]=useState({})

  const { shop: shopID } = useParams();
  const dispatch = useDispatch();

  const shopData = useSelector((state) => state.shop.shop) || [];
  const schedules = useSelector((state) => state.schedule.schedules) || [];
  const services = useSelector((state) => state.services.services) || [];
  const {user}=useSelector(state=>state.authUser);

  const shopId = shopData.length > 0 ? shopData[0]._id : null;

  const employeeSectionRef = useRef(null);
  const serviceSectionRef = useRef(null);
  const scheduleSectionRef = useRef(null);
  const bookSlotButtonRef = useRef(null);

  useEffect(() => {
    if (shopID) dispatch(getAllShopByShopId(shopID));
  }, [dispatch, shopID]);

  useEffect(() => {
    if (shopId) {
      dispatch(getEmployeesByShopId(shopId));
      dispatch(getServicesByShopId(shopId));
    }
  }, [dispatch, shopId]);

  useEffect(() => {
    if (selectedDate && selectedEmployee) {
      let date;
    console.log("Selected date under use useEffect:", selectedDate);
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
  

  // Scroll to the next section after selection
  useEffect(() => {
    if (selectedDate && employeeSectionRef.current) {
      employeeSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedEmployee && serviceSectionRef.current) {
      serviceSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (selectedSlot && bookSlotButtonRef.current) {
      bookSlotButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSlot]);

  useEffect(() => {
    const total = selectedService.reduce(
      (acc, service) => acc + service.duration,
      0
    );

    const amnt=selectedService.reduce((acc,service)=>acc+service.price,0);
    setSelectedSlot([]);
    setTotalTime(total);
    setAmount(amnt);
  }, [selectedService]);


  const getDurationInMinutes = (timeRange) => {
    const [start, end] = timeRange.split(" - ");
    
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    
    // Convert to total minutes
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Calculate duration
    return endTimeInMinutes - startTimeInMinutes;
};


const handleBookAppointment=()=>{

  console.log("handle Book APpointment is clickerd");
  const date = new Date(selectedDate);
  if (!isNaN(date.getTime())) {
    date.setUTCHours(0, 0, 0, 0);
  }
  const isoDateString=date.toISOString();
  const serviceIds=selectedService.map((service)=>service._id);
  const slotIds=selectedSlot.map(slot=>slot._id);
    
  const appointmentData={
    isoDateString,
    selectedEmployee,
    serviceIds,
    slotIds,
    shopId,
    status:"pending",
    paymentStatus:"pending",
    amount,
    user
  }
  console.log(appointmentData);
  setAppointmentData(appointmentData);
}



  const handleSlotClick = (slot) => {
  

    if (!slot.isBooked) {
        const selectedSlots = [];
        let totalSelectedTime = 0;

        // Add the clicked slot first
        selectedSlots.push(slot);
        totalSelectedTime += getDurationInMinutes(slot.slot);
    

        // Find the index of clicked slot
        const startIndex = schedules.findIndex(s => s === slot);
   

        let nextSlotIndex = startIndex + 1;
  
        // Add consecutive slots until totalTime is reached
        while (totalSelectedTime < totalTime && nextSlotIndex < schedules.length) {
            const nextSlot = schedules[nextSlotIndex];

            

            if (!nextSlot.isBooked) {
                selectedSlots.push(nextSlot);
                totalSelectedTime += getDurationInMinutes(nextSlot.slot);

            } else {
            
                break;
            }

            nextSlotIndex++;
        }

        if (totalSelectedTime >= totalTime) {
            setSelectedSlot(selectedSlots);
            setStatusMessage("");
           
        } else {
            setSelectedSlot([]); // Just select the clicked slot if not enough consecutive slots
            setStatusMessage("Not enough consecutive available slots.");
          
        }
    } else {
        setSelectedSlot([]); // Clear selection if clicked on booked slot
        setStatusMessage("This slot is already booked.");
       
    }
};



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mt-20 p-6 mx-auto max-w-7xl">
        <div className="space-y-8">
          {/* Date Selection */}
          <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Select Date</h2>
            <DateSlider
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </section>

          {/* Employee Selection */}
          {selectedDate && (
            <section ref={employeeSectionRef} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-blue-600 mb-4">Choose Your Stylist</h2>
              <EmployeeSlider
                shopId={shopId}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
              />
            </section>
          )}

          {/* Service Selection */}
          {selectedEmployee && (
            <section ref={serviceSectionRef} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-blue-600 mb-4">Select Services</h2>
              <ServiceSlider
                services={services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </section>
          )}

          {/* Schedule Selection */}
          {selectedService.length > 0 && (
            <section ref={scheduleSectionRef} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-blue-600 mb-4">Choose Time Slot</h2>
              {statusMessage && (
                <div className="mt-4 p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
                  {statusMessage}
                </div>
              )}
              <div className={
                viewType === "grid"
                  ? "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"
                  : "mt-6 space-y-4"
              }>
                {selectedService&&schedules.map((slot) => (
                  <div
                    key={slot._id}
                    onClick={() => !slot.isBooked && handleSlotClick(slot)}
                    className={`p-4 rounded-lg cursor-pointer transition-all transform
                      ${slot.isBooked 
                        ? "bg-red-50 text-red-600 border border-red-200 pointer-events-none opacity-50" 
                        : selectedSlot.find((s)=>s._id === slot._id)
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-600 shadow-lg scale-105 font-medium"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                      }`}
                  >
                    <span className={`block text-center font-medium ${
                      selectedSlot.find((s)=>s._id === slot._id) ? 'text-blue-700' : ''
                    }`}>
                      {slot.slot}
                    </span>
                    <span className={`block text-sm text-center mt-1 ${
                      selectedSlot.find((s)=>s._id === slot._id)
                        ? 'text-blue-600'
                        : slot.isBooked ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        {
          console.log("selectedSlot",selectedSlot)
        }

          {/* Payment Section */}
          {selectedSlot.length !== 0 && selectedService.length > 0 && (
            <section ref={bookSlotButtonRef} onClick={handleBookAppointment} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <PaymentComponent appointmentData={appointmentData}/>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
