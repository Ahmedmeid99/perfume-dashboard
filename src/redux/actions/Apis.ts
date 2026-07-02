import { snakeCase } from "lodash";
import axios from "../../services/api/axiosInstance";
import { toast } from "react-toastify";
import {
  FETCH_START,
  FETCH_ERROR,
  FETCH_SUCCESS,
  SHOW_MESSAGE,
} from "../../constants/ActionTypes";

export const fetchResource = (resource: string, id: any) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .get(`/${resource}/${id}`)
      .then(({ data }) => {
        if (data.data !== undefined) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({
            type: `FETCH_${snakeCase(resource).toUpperCase()}_SHOW_SUCCESS`,
            payload: data.data,
          });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error || "Failed to fetch resource");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
      });
  };
};


export const fetchCollection = (resource: string) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .get(`/${resource}`)
      .then(({ data }) => {
        if (data.data) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({
            type: `FETCH_${snakeCase(resource.split('?')[0]).toUpperCase()}_SUCCESS`,
            payload: data,
          });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error || "Failed to fetch data");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
      });
  };
};
export const fetchSubCollection = (path: string, resource: string) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .get(`/${path}`)
      .then(({ data }) => {
        if (data.data) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({
            type: `FETCH_${snakeCase(resource).toUpperCase()}_SUCCESS`,
            payload: data,
          });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error || "Failed to fetch data");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
      });
  };
};

export const fetchCollectionNew = (
  resource: string,
  pagination: any = {},
  search: string = "",
  filters: any = null,
  _sorter: any = null
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });

    let queryList = [];
    if (pagination.current) queryList.push(`pageNumber=${pagination.current}`);
    if (pagination.pageSize) queryList.push(`pageSize=${pagination.pageSize}`);
    if (search) queryList.push(`search=${search}`);
    if (filters) queryList.push(`filters=${JSON.stringify(filters)}`);

    const query = queryList.length > 0 ? `?${queryList.join("&")}` : "";

    axios
      .get(`/${resource}${query}`)
      .then(({ data }) => {
        if (data.data) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({
            type: `FETCH_${snakeCase(resource).toUpperCase()}_SUCCESS`,
            payload: data,
          });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
      });
  };
};

export const createResource = (
  resource: string,
  payload: any,
  callback = (res: any, _data?: any) => res
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .post(`/${resource}`, payload)
      .then(({ data }) => {
        if (data.message) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
          toast.success(data.message);
          callback(200, data.data);
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error);
        }
      })
      .catch((error) => {
        const body = error.response?.data;
        const message = body?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
        callback(body);
      });
  };
};

export const updateResource = (
  resource: string,
  id: any,
  payload: any,
  callback = (res: any) => res
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .put(`/${resource}/${id || ""}`, payload)
      .then(({ data }) => {
        if (data.message) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
          toast.success(data.message);
          callback(200);
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error);
        }
      })
      .catch((error) => {
        const body = error.response?.data;
        const message = body?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
        callback(body);
      });
  };
};

export const deleteResource = (resource: string, id: any) => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_START });
    try {
      const { data } = await axios.delete(`/${resource}/${id}`);
      if (data.message) {
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: SHOW_MESSAGE, payload: data.message });
        toast.success(data.message);
        return true;
      } else {
        dispatch({ type: FETCH_ERROR, payload: data.error });
        toast.error(data.error);
        return false;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: FETCH_ERROR, payload: message });
      toast.error(message);
      return false;
    }
  };
};

export const uploadFile = (
  resource: string,
  id: any,
  file: File,
  subPath: string = "image",
  callback = (res: any, _data?: any) => res
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`/${resource}/${id}/${subPath}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        if (data.data) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
          toast.success(data.message);
          callback(200, data.data);
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error);
          callback(400);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
        callback(error.response?.status || 500);
      });
  };
};

export const deleteFile = (
  resource: string,
  id: any,
  _isProduct: boolean = true,
  subPath: string = "image",
  callback = (res: any) => res
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    // If subPath is not "image", use it directly (like for companies logo)
    const url = subPath === "image" ? `/${resource}/image/${id}` : `/${resource}/${id}/${subPath}`;
    axios
      .delete(url)
      .then(({ data }) => {
        if (data.message) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
          toast.success(data.message);
          callback(200);
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error);
          callback(400);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
        callback(error.response?.status || 500);
      });
  };
};

export const updateOrderStatus = (
  orderId: number,
  status: number,
  callback = (res: any) => res
) => {
  return (dispatch: any) => {
    dispatch({ type: FETCH_START });
    axios
      .patch(`/Orders/${orderId}/status?status=${status}`)
      .then(({ data }) => {
        if (data.message) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
          toast.success(data.message);
          dispatch(fetchResource("Orders", orderId) as any);
          callback(200);
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          toast.error(data.error || "Failed to update order status");
          callback(400);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_ERROR, payload: message });
        toast.error(message);
        callback(error.response?.status || 500);
      });
  };
};

