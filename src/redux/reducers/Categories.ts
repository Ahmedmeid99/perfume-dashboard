const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_PRODUCT_CATEGORIES_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_PRODUCT_CATEGORIES_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
