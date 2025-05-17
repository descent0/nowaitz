import React, { useRef } from "react";

const ServiceSlider = ({ services, selectedService, setSelectedService }) => {
  const scrollRef = useRef(null);

  // Function to toggle service selection
  const toggleSelection = (service) => {
    const isSelected = selectedService.find((s) => s._id === service._id);
    if (isSelected) {
      setSelectedService(selectedService.filter((s) => s._id !== service._id)); // Deselect
    } else {
      setSelectedService([...selectedService, service]); // Select
    }
  };

  return (
    <div className="relative w-full shadow-sm rounded-lg">
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 px-4 py-2 no-scrollbar">
        {services.length === 0 ? (
          <div className="text-gray-500 text-center">No Services Available</div>
        ) : (
          services.map((service) => {
            const isSelected = selectedService.find((s) => s._id === service._id);

            return (
              <div
                key={service._id}
                onClick={() => toggleSelection(service)}
                className={`flex flex-col min-w-[10rem] p-4 rounded-xl cursor-pointer 
                  transition-shadow border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 shadow-md'
                      : 'bg-white hover:shadow-md border-gray-100'
                  }`}
              >
                <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                  {service.name}
                </h3>
                <div className={`mt-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                  <span className="text-sm font-medium">
                    <b>Price: </b>
                  </span>
                  ₹{service.price}
                </div>
                <div className={isSelected ? 'text-blue-600' : 'text-gray-600'}>
                  <span className="text-sm font-medium">
                    <b>Duration: </b>
                  </span>
                  {service.duration} min
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ServiceSlider;
