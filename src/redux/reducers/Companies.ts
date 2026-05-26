const initialState: any = {
  data: [],
  show: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_COMPANIES_SUCCESS`:
      return { ...state, ...action.payload };
    case `FETCH_COMPANIES_SHOW_SUCCESS`:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
