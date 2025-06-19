// src/features/shop/shopSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:5002/api/shop";

export const checkShop = createAsyncThunk(
  "shop/checkShop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/checkShop`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAllShopByCategory = createAsyncThunk(
  "shop/getShopByCategory",
  async (shopCategory, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/shop/${shopCategory}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAllShopByShopId = createAsyncThunk(
  "shop/getShopByShopId", // Fixed action type name here
  async (shopID, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/${shopID}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
       console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const getAllShops = createAsyncThunk(
  "shop/getAllShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/allShop`,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const registerShop = createAsyncThunk(
  "shop/registerShop",
  async (formData, { rejectWithValue }) => {
    try {
      console.log('Sending form data:', formData);
      const response = await axios.post(`${apiUrl}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const approveShop = createAsyncThunk(
  "shop/approveShop",
  async (shop_id, { rejectWithValue }) => {
    try {
      console.log("under rtk " + shop_id);
      const response = await axios.put(`${apiUrl}/approve/${shop_id}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateShopStatus = createAsyncThunk(
  "shop/updateShopStatus",
  async ({ shop_id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/status/${shop_id}`, { status },{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const logoutShop = createAsyncThunk('auth/logoutShop', async (_, { rejectWithValue }) => {
  try {
    console.log("logout called");
    const response = await axios.post(`${apiUrl}/logout`,{},{
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

// Update Shop Info
export const updateShopInfo = createAsyncThunk(
  "shop/updateShopInfo",
  async (shopData, { rejectWithValue }) => {
    try {
      console.log("inside slice called", shopData);
      const response = await axios.put(`${apiUrl}/update`, shopData, {
        withCredentials: true,
      });
      console.log("inside slicce called 2 ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Shop Password
export const updateShopPassword = createAsyncThunk(
  "shop/updateShopPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/update-password`, passwordData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Shop by ID
export const getShopById = createAsyncThunk(
  "shop/getShopById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/shop/${id}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    shop: null,
    shops: [],
    loading: false,
    error: null,
    isShopRegistered: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Check Shop
      .addCase(checkShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
        state.isShopRegistered = action.payload ? true : false;
      })
      .addCase(checkShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout User
      .addCase(logoutShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = null;
        state.shops = [];
        state.isShopRegistered = false;
        state.error = null;
      })
      .addCase(logoutShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shops by Category
      .addCase(getAllShopByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllShopByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(getAllShopByCategory.rejected, (state, action) => {
        state.loading = false;
        state.shops=[];
        state.error = action.payload;
      })

      // Get Shop by Shop ID (Fixed action type)
      .addCase(getAllShopByShopId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllShopByShopId.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload; // Assuming you want to overwrite shop with this data
      })
      .addCase(getAllShopByShopId.rejected, (state, action) => {
        state.loading = false;
        state.shops = [];
        state.error = action.payload;
      })

      // Get all shops
      .addCase(getAllShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(getAllShops.rejected, (state, action) => {
        state.loading = false;
        state.shops = [];
        state.error = action.payload;
      })

      // Register shop
      .addCase(registerShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
      })
      .addCase(registerShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve shop
      .addCase(approveShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
      })
      .addCase(approveShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Shop Status
      .addCase(updateShopStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
        const index = state.shops.findIndex(shop => shop.shopID === action.payload.shopID);
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
      })
      .addCase(updateShopStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Shop Info
      .addCase(updateShopInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
      })
      .addCase(updateShopInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Shop Password
      .addCase(updateShopPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateShopPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shop by ID
      .addCase(getShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopById.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
      })
      .addCase(getShopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shopSlice.reducer;
