import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = `${process.env.REACT_BACKEND_API}/api/appointments`;

// Async thunks for CRUD operations

// Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      console.log("fetching all appointments");
      const response = await axios.get(`${API_URL}/fetchAllAppointment`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch a single appointment by ID
export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchAppointmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch appointments by shop ID
export const fetchAppointmentsByShopId = createAsyncThunk(
  'appointments/fetchAppointmentsByShopId',
  async ({ shopId, queryParams = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shop/${shopId}`, { params: queryParams },{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch appointments by user ID
export const fetchAppointmentsByUserId = createAsyncThunk(
  'appointments/fetchAppointmentsByUserId',
  async ({ userId, queryParams = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, { params: queryParams },{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new appointment
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, appointmentData,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      console.log("updateint ")
      const response = await axios.patch(`${API_URL}/${id}/status`, { status },{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cancel an appointment
export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, cancellationData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/cancel`, cancellationData,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Send a request for cancellation or rescheduling
export const sendRequest = createAsyncThunk(
  'appointments/sendRequest',
  async ({ id, requestData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/request`, requestData,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Handle a request (approve/reject) by the shop owner
export const handleRequest = createAsyncThunk(
  'appointments/handleRequest',
  async ({ id, requestStatus }, { rejectWithValue }) => {
    try {
      console.log("request status ",requestStatus);
      const response = await axios.post(`${API_URL}/${id}/verify-request`, { requestStatus },{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Appointment slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    appointment: null,
    loading: false,
    error: null,
    requestStatus: null, // Track request status
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAppointment: (state) => {
      state.appointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch appointments by shop ID
      .addCase(fetchAppointmentsByShopId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByShopId.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsByShopId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch appointments by user ID
      .addCase(fetchAppointmentsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send request
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestStatus = action.payload.message;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle request
      .addCase(handleRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload.appointment._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload.appointment;
        }
      })
      .addCase(handleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;