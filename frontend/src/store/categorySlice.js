import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:5002/api/cate";

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiUrl,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAllApprovedCategories=createAsyncThunk(
  "category/getAllApprovedCategories",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Inside the slice");
      const response = await axios.get(`${apiUrl}/approved`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data.categories);
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, categoryData,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/${id}`,{
         headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    category: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Categories
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Category by ID
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get all approved categories
      .addCase(getAllApprovedCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(getAllApprovedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        }
        )
        .addCase(getAllApprovedCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        });
  },
});

export default categorySlice.reducer;
