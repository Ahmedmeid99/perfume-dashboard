import { AuthActionTypes } from "../../redux/actions/Auth";
import type { Store } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

export default function setupAxios(axios: AxiosInstance, store: Store) {
  axios.interceptors.request.use(
    (config) => {
      const authData = localStorage.getItem("auth");
      const { accessToken } = authData ? JSON.parse(authData) : {};

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      if (error.response?.status === 423) {
        toast.error("تم قفل الحساب. يرجى التواصل مع المسؤول.");
        window.location.href = "/account-locked";
      }

      if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const authData = localStorage.getItem("auth");
          const { refreshToken } = authData ? JSON.parse(authData) : {};

          if (!refreshToken) throw new Error("No refresh token");

          // Create a new axios instance to avoid infinite loop
          const axiosNoAuth = axios.create();

          const res = await axiosNoAuth.post(
            `${import.meta.env.VITE_API_URL}/refresh-token`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data && res.data.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

            store.dispatch({
              type: AuthActionTypes.RefreshToken,
              payload: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              },
            });

            // Update original request header
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          toast.error("انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.");
          store.dispatch({ type: AuthActionTypes.Logout });
          window.location.replace("/login");
        }
      }

      return Promise.reject(error);
    }
  );
}
