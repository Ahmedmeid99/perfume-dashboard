const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_PERMISSIONS_SUCCESS`:
    case `FETCH_PERMISSIONS_ACTIVE_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_PERMISSIONS_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
