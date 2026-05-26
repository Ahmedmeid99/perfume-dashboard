const initialState = {
  data: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_REVIEWS_SUCCESS`:
      return action.payload;
    default:
      return state;
  }
};
