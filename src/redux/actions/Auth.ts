import axios from "../../services/api/axiosInstance";
export const AuthActionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  RefreshToken: "[RefreshToken] Action",
  SetUser: "[Set User] Action",
};

export const logout = () => {
  return {
    type: AuthActionTypes.Logout,
    payload: null,
  };
};
export const authLogin = (email: string, password: string) => async (dispatch: any) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });

    if (!response.data.success) throw new Error(response.data.message || "Login failed");

    const { accessToken, refreshToken, user, permissionIds } = response.data.data;

    dispatch({
      type: AuthActionTypes.Login,
      payload: { accessToken, refreshToken, user, permissionIds },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Login failed:", error);
    return { success: false, message: error.message };
  }
};
