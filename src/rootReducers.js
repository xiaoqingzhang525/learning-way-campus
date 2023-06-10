import { combineReducers } from '@reduxjs/toolkit';
import persistedCourseAdjustmentReducer from './reducers/courseAdjustmentReducer';
import persistedPaymentDetailReducer from './reducers/paymentDetailReducer';

const rootReducers = combineReducers({
  courseAdjustmentReducer: persistedCourseAdjustmentReducer,
  paymentDetailReducer: persistedPaymentDetailReducer,
});

export default rootReducers;
