import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import adminApi from './services/adminApi';
import adminReducer from './slices/adminSlice';
import categoryReducer from './slices/categorySlice';

// Create a persist config
const persistConfig = {
  key: 'root',
  storage, // Use localStorage as the default storage
  whitelist: ['admin','category']
};

// Combine reducers
const rootReducer = combineReducers({
  [adminApi.reducerPath]: adminApi.reducer,
  category: categoryReducer,
  admin: adminReducer
});

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: true
});

// Optional, but recommended to enable refetching on focus/refocus
setupListeners(store.dispatch);


// Optional, but recommended to enable refetching on focus/refocus
setupListeners(store.dispatch);

// Types for store
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
