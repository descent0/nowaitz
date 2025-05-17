import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5002/api/sche"; 

// Fetch all schedules
export const fetchSchedules = createAsyncThunk("schedules/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch schedule by ID
export const fetchScheduleById = createAsyncThunk("schedules/fetchById", async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/id/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch schedules by shop ID
export const fetchSchedulesByShop = createAsyncThunk("schedules/fetchByShop", async (shopId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/shop/${shopId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch schedules by employee ID
export const fetchSchedulesByEmployee = createAsyncThunk("schedules/fetchByEmployee", async (employeeId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch schedules by date
export const fetchSchedulesByDate = createAsyncThunk("schedules/fetchByDate", async (date, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/date?date=${date}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch available schedules by date
export const fetchAvailableSchedules = createAsyncThunk("schedules/fetchAvailable", async (date, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/available?date=${date}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Fetch schedules by date and employee ID
export const fetchScheduleByDateAndEmployee = createAsyncThunk("schedules/fetchByDateAndEmployee", async ({ date, employeeId }, thunkAPI) => {
  try {
    console.log(date,employeeId);
    const response = await axios.get(`${API_URL}/date/employee?date=${date}&employeeId=${employeeId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Update schedule by ID
export const updateSchedule = createAsyncThunk("schedules/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/id/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Delete schedule by ID
export const deleteSchedule = createAsyncThunk("schedules/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/id/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const scheduleSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: [],
    schedule: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.schedule = action.payload;
      })
      .addCase(fetchSchedulesByShop.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesByEmployee.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesByDate.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchAvailableSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchScheduleByDateAndEmployee.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter((s) => s._id !== action.payload);
      });
  },
});

export default scheduleSlice.reducer;
