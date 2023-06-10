import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { fetchPaymentDetailFromAPI } from '../integrations/paymentDetailFetch';

// service
export const fetchPaymentDetail = createAsyncThunk(
  '/orders/1/payments/9',
  async () => {
    const data = await fetchPaymentDetailFromAPI();
    return data;
  }
);

const initialState = {
  isLoading: false,
  error: null,
  paymentDetail: null,
  retryCount: 3,
};

const paymentDetailPersistConfig = {
  key: 'paymentDetail',
  whitelist: [],
  storage,
};

export const paymentDetailSlice = createSlice({
  name: 'paymentDetail',
  initialState,
  reducers: {
    decrementRetryCount(state) {
      state.retryCount--;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentDetail.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.error = null;
      state.paymentDetail = action.payload.data;
    });
    builder.addCase(fetchPaymentDetail.rejected, (state, action) => {
      state.error = action.error;
      state.paymentDetail = null;
      state.isLoading = false;
    });
  },
});

export const { decrementRetryCount } = paymentDetailSlice.actions;

const persistedCourseAdjustmentReducer = persistReducer(
  paymentDetailPersistConfig,
  paymentDetailSlice.reducer
);

// selectors
export const selectPaymentDetail = (state) =>
  state.paymentDetailReducer.paymentDetail;
export const selectIsLoading = (state) => state.paymentDetailReducer.isLoading;
export const selectError = (state) => state.paymentDetailReducer.error;
export const selectRetryCount = (state) =>
  state.paymentDetailReducer.retryCount;

export default persistedCourseAdjustmentReducer;
