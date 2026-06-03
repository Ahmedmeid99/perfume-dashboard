import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth";
import commonReducer from "./reducers/Common";
import productsReducer from "./reducers/Products";
import categoriesReducer from "./reducers/Categories";
import ordersReducer from "./reducers/Orders";
import usersReducer from "./reducers/Users";
import rolesReducer from "./reducers/Roles";
import permissionsReducer from "./reducers/Permissions";
import reviewsReducer from "./reducers/Reviews";
import companiesReducer from "./reducers/Companies";
import dashboardReducer from "./reducers/Dashboard";
import galleryImagesReducer from "./reducers/GalleryImages";

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  products: productsReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  users: usersReducer,
  roles: rolesReducer,
  permissions: permissionsReducer,
  reviews: reviewsReducer,
  companies: companiesReducer,
  dashboard: dashboardReducer,
  galleryImages: galleryImagesReducer,
  // Add other reducers here as they are created
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
