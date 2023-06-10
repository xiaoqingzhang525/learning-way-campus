import persistedCourseAdjustmentReducer, {
  fetchCourseAdjustment,
} from '../courseAdjustmentReducer';
import { configureStore } from '@reduxjs/toolkit';
import courseAdjustment from '../../mocks/data/courseAdjustment.json';

describe('reducers', () => {
  const initialState = {
    isLoading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(
      persistedCourseAdjustmentReducer(initialState, { type: 'unknown' })
    ).toEqual({
      isLoading: false,
      error: null,
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
    store.dispatch(fetchCourseAdjustment());
    const state = store.getState();
    expect(state.isLoading).toBe(true);
  });

  it('should handle fulfilled request with data', () => {
    store.dispatch(fetchCourseAdjustment.fulfilled({ data: courseAdjustment }));
    const state = store.getState();
    expect(state.adjustmentDetails).toEqual(courseAdjustment);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle fulfilled request with empty data', () => {
    store.dispatch(
      fetchCourseAdjustment.fulfilled({
        data: { ...courseAdjustment, adjustmentList: [] },
      })
    );
    const state = store.getState();
    expect(state.adjustmentDetails.adjustmentList.length).toEqual(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle rejected getHousingInfos', () => {
    const error = { name: 'error', message: 'HTTP error! status: 500' };
    store.dispatch(fetchCourseAdjustment.rejected(error));
    const state = store.getState();
    expect(state.error.message).toEqual('HTTP error! status: 500');
    expect(state.isLoading).toBe(false);
  });

  it('should handle rejected getHousingInfos when there is network', () => {
    const error = { name: 'Typeerror', message: 'NetworkError' };
    store.dispatch(fetchCourseAdjustment.rejected(error));
    const state = store.getState();
    expect(state.error.message).toEqual('NetworkError');
    expect(state.isLoading).toBe(false);
  });
});
