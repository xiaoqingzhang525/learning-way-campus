import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { fetchCourseAdjustmentFromAPI } from '../integrations/courseAdjustmentFetch';

// service
export const fetchCourseAdjustment = createAsyncThunk(
  '/orders/1/courseAdjustments/1',
  async () => {
    const data = await fetchCourseAdjustmentFromAPI();
    return data;
  }
);

const initialState = {
  isLoading: false,
  error: null,
  adjustmentDetails: null,
};

const courseAdjustmentPersistConfig = {
  key: 'courseAdjustment',
  whitelist: ['adjustmentDetails'],
  storage,
};

export const courseAdjustmentSlice = createSlice({
  name: 'courseAdjustment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourseAdjustment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCourseAdjustment.fulfilled, (state, action) => {
      state.adjustmentDetails = action.payload.data;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchCourseAdjustment.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

// export const { decrementRetryCount } = courseAdjustmentSlice.actions;

const persistedCourseAdjustmentReducer = persistReducer(
  courseAdjustmentPersistConfig,
  courseAdjustmentSlice.reducer
);

// selectors
export const selectAdjustmentDetails = (state) =>
  state.courseAdjustmentReducer.adjustmentDetails;
export const selectLoadingStatus = (state) =>
  state.courseAdjustmentReducer.isLoading;
export const selectError = (state) => state.courseAdjustmentReducer.error;

export default persistedCourseAdjustmentReducer;
