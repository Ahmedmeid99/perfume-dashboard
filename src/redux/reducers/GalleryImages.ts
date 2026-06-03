const initialState: any = {
  data: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case "FETCH_GALLERY_IMAGES_SUCCESS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
