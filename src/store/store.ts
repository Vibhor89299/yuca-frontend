import reviewsSlice from './slices/reviewsSlice';
import categoriesSlice from './slices/categoriesSlice';
import usersSlice from './slices/usersSlice';
import { configureStore } from '@reduxjs/toolkit';



import productSlice from './slices/productSlice';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';


export const store = configureStore({
  reducer: {
  products: productSlice,
  auth: authSlice,
  cart: cartSlice,
  order: orderSlice,
  users: usersSlice,
  categories: categoriesSlice,
  reviews: reviewsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
