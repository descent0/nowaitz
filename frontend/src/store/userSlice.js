import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_URL = `${process.env.REACT_APP_BACKEND_API}/api/auth`;

// Async thunk for signup
export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData,{withCredentials:true});
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during signup';
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData,{withCredentials:true});
    console.log(response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during login';
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    console.log("logout called");
    const response = await axios.post(`${API_URL}/logout`,{},{
      withCredentials: true,  
      headers: {
          "Content-Type": "application/json"
      }
  });
  console.log(response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during logout';
    console.log(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for checking authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Checking authentication status...");
      const response = await axios.get(`${API_URL}/checkAuth`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data) {
        console.log("User not authenticated");
        return rejectWithValue("User not authenticated");
      }

      console.log("Authenticated User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in checkAuthStatus:", error);
      const errorMessage = error.response?.data?.message || "Internal Server Error";
      return rejectWithValue(errorMessage);
    }
  }
);


export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        });
        console.log("response data", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during fetching all users';
      console.log(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);



// Google login callback thunk
export const googleLoginCallback = createAsyncThunk('auth/googleLoginCallback', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/google/callback`, { withCredentials: true });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during Google login callback';
    return rejectWithValue(errorMessage);
  }
});

export const updateUserDetails = createAsyncThunk(
  'auth/updateUserDetails',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while updating user details';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for sending OTP
export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email }, { withCredentials: true });
    console.log("response data" + response);
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to send OTP';
    console.log("error again happendes");
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for verifying OTP
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
    return rejectWithValue(errorMessage);
  }
});

export const forgotPassword=createAsyncThunk('auth/forgot-password', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email }, { withCredentials: true });
    return response.data;
  } catch (error) {  
    const errorMessage = error.response?.data?.message || 'Failed to send forgot password email';
    return rejectWithValue(errorMessage);
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',async (data, { rejectWithValue }) => {
    const {token,password}= data;
  try {
   const response = await axios.put(`${API_URL}/resetPassword/${token}`, { password })
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to reset password';
    return rejectWithValue(errorMessage);
  }
});


const initialState = {
  user: null,
  users: [],
  totalUsers: 0,
  isAuthenticated: false,
  authLoading: false,
  otpLoading: false,
  error: null,
  message: '',
  otpSent: false,
  emailVerified: false,
};


// Auth Slice
const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
   resetState: (state) => {
  state.user = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
}

  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = 'Logout successful';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuthStatus.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.authLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // OTP Send
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.message = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.emailVerified = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // OTP Verify
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.emailVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.authLoading = false;
        state.users = action.payload.users;        // <-- store the array
        state.totalUsers = action.payload.totalUsers; // <-- store the count
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })
      // Google Login Callback
      .addCase(googleLoginCallback.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(googleLoginCallback.fulfilled, (state, action) =>
        {
          state.authLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(googleLoginCallback.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })
      // Update User Details
      .addCase(updateUserDetails.pending, (state) =>
        {
          state.authLoading = true;
        }
      )
      .addCase(updateUserDetails.fulfilled, (state, action) =>
        {
          state.authLoading = false;
          state.user = action.payload;
          state.message = action.payload.message;
        }
      )
      .addCase(updateUserDetails.rejected, (state, action) =>
        {
          state.authLoading = false;
          state.error = action.payload;
        }
      );
  // Handle any other actions that might not be covered
  // by the above cases
  }
});

// Actions
export const { resetState } = authUserSlice.actions;

// Reducer
export default authUserSlice.reducer;