import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  HIDE_MESSAGE,
  SHOW_MESSAGE,
  FETCH_LISTS_SUCCESS,
  SHOW_SEARCH_BOX,
  UPDATE_SEARCH,
  SET_FORMATED_LIST,
} from "../../constants/ActionTypes";

interface CommonState {
  error: string;
  loading: boolean;
  message: string;
  pathname: string;
  searchBox: any;
  searchText: string;
  formatedList: any[];
  lists: any;
}

const INIT_STATE: CommonState = {
  error: "",
  loading: false,
  message: "",
  pathname: "/",
  searchBox: null,
  searchText: "",
  formatedList: [],
  lists: {},
};

export default (state = INIT_STATE, action: any): CommonState => {
  switch (action.type) {
    case FETCH_START: {
      return { ...state, error: "", message: "", loading: true };
    }
    case FETCH_SUCCESS: {
      return { ...state, error: "", message: "", loading: false };
    }
    case FETCH_LISTS_SUCCESS: {
      return { ...state, lists: action.payload, loading: false };
    }
    case SET_FORMATED_LIST: {
      return { ...state, formatedList: action.payload };
    }
    case SHOW_MESSAGE: {
      return { ...state, error: "", message: action.payload, loading: false };
    }
    case FETCH_ERROR: {
      return { ...state, loading: false, error: action.payload, message: "" };
    }
    case HIDE_MESSAGE: {
      return { ...state, loading: false, error: "", message: "" };
    }
    case SHOW_SEARCH_BOX: {
      return { ...state, searchBox: action.payload };
    }
    case UPDATE_SEARCH: {
      return { ...state, searchText: action.payload };
    }
    default:
      return state;
  }
};
