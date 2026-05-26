const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_PRODUCTS_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_PRODUCTS_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    case `FETCH_PRODUCTS_LISTS_SUCCESS`:
      return { ...state, lists: action.payload.data };
    default:
      return state;
  }
};
