import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API requests
const API_BASE_URL = `${process.env.REACT_APP_BACKEND_API}/api/razor-pay`;

// 🔹 Create a new Razorpay order
export const createOrder = createAsyncThunk(
    "payment/createOrder",
    async (appointmentData, { rejectWithValue }) => {
      try {
      
        const response = await axios.post(`${API_BASE_URL}/order`, appointmentData,{
           headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        });
        return response.data.data;
        
        
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Order creation failed");
      }
    }
  );
  
  // 🔹 Verify payment after user completes checkout
  export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/payment/verify`, paymentData,{
           headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Payment verification failed");
      }
    }
  );

// 🔹 Fetch order details
export const fetchOrder = createAsyncThunk("payment/fetchOrder", async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${orderId}`,{
       headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch order details");
  }
});

// 🔹 Fetch payment details
export const fetchPayment = createAsyncThunk("payment/fetchPayment", async (paymentId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/${paymentId}`,{
       headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch payment details");
  }
});

// 🔹 Fetch refund details
export const fetchRefund = createAsyncThunk("payment/fetchRefund", async (refundId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/refund/${refundId}`,{
       headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch refund details");
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    order: null,
    payment: null,
    refund: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payment = action.payload;
      })
      .addCase(fetchRefund.fulfilled, (state, action) => {
        state.refund = action.payload;
      });
  },
});

export default paymentSlice.reducer;
