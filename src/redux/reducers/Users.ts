const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_USERS_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_USERS_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    case `FETCH_USERS_LISTS_SUCCESS`:
      return { ...state, lists: action.payload.data };
    default:
      return state;
  }
};
