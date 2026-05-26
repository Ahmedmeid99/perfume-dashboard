const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_ORDERS_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_ORDERS_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
