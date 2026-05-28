const initialState: any = {
  data: {
    summary: null,
    monthlySales: null,
    latestOrders: [],
    company: null,
  },
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case `FETCH_DASHBOARD_SUCCESS`:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
