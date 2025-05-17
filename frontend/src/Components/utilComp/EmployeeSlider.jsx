import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeesByShopId } from '../../store/employeeSlice';

const EmployeeSlider = ({ shopId, selectedEmployee, setSelectedEmployee }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployeesByShopId(shopId));
  
  }, [dispatch, shopId]);
 

  const employees = useSelector((state) => state.employee.employees);
  const loading = useSelector((state) => state.employee.loading);
  const error = useSelector((state) => state.employee.error);



  const scrollRef = React.useRef(null);


  return (
    <div className="relative w-full shadow-sm rounded-lg">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-12 py-4 no-scrollbar"
      >
        {loading ? (
          <div className="text-blue-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : (
          employees.map((employee) => {
            const isSelected = selectedEmployee === employee._id;

            return (
              <button
                key={employee.id}
                onClick={() => setSelectedEmployee(employee._id)}
                className={`flex flex-col items-center justify-center min-w-[6rem] p-4 rounded-xl 
                  transition-shadow border ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 border-blue-600 shadow-md'
                      : 'bg-white hover:shadow-md text-gray-700 border-gray-100'
                  }`}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                  {employee.name}
                </span>
                <span className={`text-xs mt-1 ${isSelected ? 'text-blue-500' : 'text-gray-600'}`}>
                  {employee.role}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmployeeSlider;
