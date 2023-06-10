import { configureStore } from '@reduxjs/toolkit';
import rootReducers from '../rootReducers';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: rootReducers,
  middleware: [thunk],
});

export default store;
