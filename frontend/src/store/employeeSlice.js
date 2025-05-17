import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5002/api/employee";  // changed from "/api/emp" to "/api/employee"

// Async Thunks
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, employeeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employees/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getEmployeesByShopId = createAsyncThunk(
  "employees/getEmployeesByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      console.log("shopId fetching employees", shopId);
      const { data } = await axios.get(`${API_URL}/shop/${shopId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, employeeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Initial State
const initialState = {
  employees: [],
  status: "idle",
  error: null,
};

// Slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => { state.status = "loading"; })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getEmployees.pending, (state) => { state.status = "loading"; })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getEmployeeById.pending, (state) => { state.status = "loading"; })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = [action.payload];
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getEmployeesByShopId.pending, (state) => { state.status = "loading"; })
      .addCase(getEmployeesByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(getEmployeesByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => { state.status = "loading"; })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.employees.findIndex((emp) => emp._id === action.payload._id);
        if (index !== -1) state.employees[index] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteEmployee.pending, (state) => { state.status = "loading"; })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = state.employees.filter((emp) => emp._id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
