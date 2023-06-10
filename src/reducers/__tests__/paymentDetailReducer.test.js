import persistedCourseAdjustmentReducer, {
  fetchPaymentDetail,
  decrementRetryCount,
} from '../paymentDetailReducer';
import { configureStore } from '@reduxjs/toolkit';
import paymentDetailData from '../../mocks/data/paymentDetail.json';

describe('reducers', () => {
  const initialState = {
    isLoading: false,
    error: null,
    retryCount: 3,
  };

  it('should handle initial state', () => {
    expect(
      persistedCourseAdjustmentReducer(initialState, decrementRetryCount())
    ).toEqual({
      isLoading: false,
      error: null,
      retryCount: 2,
    });
  });

  it('should decrement 1 when invoke decrementRetry', () => {
    expect(
      persistedCourseAdjustmentReducer(initialState, {
        type: 'decrementRetryCount',
      })
    ).toEqual({
      isLoading: false,
      error: null,
      retryCount: 3,
    });
  });
});

describe('extraReducers', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: persistedCourseAdjustmentReducer,
    });
  });

  it('should handle pending request', () => {
    store.dispatch(fetchPaymentDetail());
    const state = store.getState();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fulfilled request with data', () => {
    store.dispatch(fetchPaymentDetail.fulfilled({ data: paymentDetailData }));
    const state = store.getState();
    expect(state.paymentDetail).toEqual(paymentDetailData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle rejected getHousingInfos', () => {
    const error = { name: 'error', message: 'HTTP error! status: 500' };
    store.dispatch(fetchPaymentDetail.rejected(error));
    const state = store.getState();
    expect(state.error.message).toEqual('HTTP error! status: 500');
    expect(state.isLoading).toBe(false);
    expect(state.paymentDetail).toBe(null);
  });

  it('should handle rejected getHousingInfos when there is network', () => {
    const error = { name: 'Typeerror', message: 'NetworkError' };
    store.dispatch(fetchPaymentDetail.rejected(error));
    const state = store.getState();
    expect(state.error.message).toEqual('NetworkError');
    expect(state.isLoading).toBe(false);
    expect(state.paymentDetail).toBe(null);
  });
});
