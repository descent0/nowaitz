// src/features/shop/shopSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_BACKEND_API}/api/serv`; // Adjusted the base API URL

// Fetch all services (with optional filters)
export const fetchAllServices = createAsyncThunk('shop/fetchAllServices', async (filters, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/services`, {
      params: filters, // Send filters as query parameters
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Get service by ID
export const getServiceById = createAsyncThunk('shop/getServiceById', async (serviceId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/services/${serviceId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Get services by Shop ID
export const getServicesByShopId = createAsyncThunk(
  "services/getServicesByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/services/shop/${shopId}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Create a new service
export const createService = createAsyncThunk('shop/createService', async (serviceData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/services`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data; // Return newly created service
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Delete a service
export const deleteService = createAsyncThunk('shop/deleteService', async (serviceId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${apiUrl}/services/${serviceId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return serviceId; // Return serviceId to remove from state
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Update a service
export const updateService = createAsyncThunk('shop/updateService', async ({ serviceId, serviceData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${apiUrl}/services/${serviceId}`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data; // Return updated service
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Shop slice
const serviceSlice = createSlice({
  name: 'shop',
  initialState: {
    services: [],
    service: null, // Store a single service when fetched by ID
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServicesByShopId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesByShopId.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServicesByShopId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        // Update the service in the state
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
