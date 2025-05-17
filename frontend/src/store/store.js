import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './serviceSlice';
import shopReducer from './shopSlice';
import scheduleReducer from './scheduleSlice';
import employeeReducer from './employeeSlice';
import authUserReducer from './userSlice';
import paymentSlice from './paymentSlice'
import categorySlice from './categorySlice';
import appointmentSlice from './appointmentSlice';


const store = configureStore({
  reducer: {
    services: serviceReducer,
    shop: shopReducer,
    schedule:scheduleReducer,
    employee: employeeReducer,
    authUser:authUserReducer,
    payment:paymentSlice,
    category:categorySlice,
    appointments:appointmentSlice,
  },
});

export default store;
