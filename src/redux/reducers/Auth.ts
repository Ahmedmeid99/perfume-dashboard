import { AuthActionTypes } from "../actions/Auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  permissionIds: number[];
}

const getInitialState = (): AuthState => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    return JSON.parse(authData);
  }
  return {
    accessToken: null,
    refreshToken: null,
    user: null,
    permissionIds: [],
  };
};

const initialState = getInitialState();

export default (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case AuthActionTypes.Login: {
      const newState = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
        permissionIds: action.payload.permissionIds,
      };
      localStorage.setItem("auth", JSON.stringify(newState));
      return newState;
    }
    case AuthActionTypes.RefreshToken: {
      const newState = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      localStorage.setItem("auth", JSON.stringify(newState));
      return newState;
    }
    case AuthActionTypes.Logout: {
      localStorage.removeItem("auth");
      return {
        accessToken: null,
        refreshToken: null,
        user: null,
        permissionIds: [],
      };
    }
    case AuthActionTypes.SetUser: {
      const newState = { ...state, user: action.payload };
      localStorage.setItem("auth", JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};
