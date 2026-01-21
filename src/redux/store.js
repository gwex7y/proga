import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slice'; 

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
  },
});