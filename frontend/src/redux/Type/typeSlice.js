import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = { types: {}, error: "" };

export const typeSlice = createSlice({
  name: "typeSlice",
  initialState,
  reducers: {
    getTypesList: (state, action) => {
      state.types = action.payload;
    },
    getError: (state, action) => {
      state.error = action.payload;
      // state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getTypesList, getError } = typeSlice.actions;

export default typeSlice.reducer;

// Redux Thunk function
export const addNewType = (typeData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/type/addType`, typeData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.data.code === 200) {
        toast.success("New type added successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getTypes());
      }
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};

export const editType = (typeData) => (dispatch) => {
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/type/editType`,
      { typeData },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((res) => {
      if (res.data.code === 200) {
        toast.success("New type updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getTypes());
      }
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};

export const getTypes = () => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/type/getTypes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      dispatch(getTypesList(res.data));
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};

export const deleteType = (name) => (dispatch) => {
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/type/deleteType`,
      { name },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((res) => {
      if (res.status === 200)
        toast.success("New type added successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      dispatch(getTypes());
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};
