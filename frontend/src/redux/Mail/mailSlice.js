import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  mailListData: [],
  mailTotalCount: 0,
  mailDetail: [],
  mailLoading: true,
  mailFetchLoading: false,
  error: "",
};

export const mailSlice = createSlice({
  name: "mailSlice",
  initialState,
  reducers: {
    getMailDetail: (state, action) => {
      state.mailDetail = action.payload;
    },
    getMailListData: (state, action) => {
      state.mailListData = action.payload;
    },
    getMailTotalCount: (state, action) => {
      state.mailTotalCount = action.payload;
    },
    getError: (state, action) => {
      state.error = action.payload;
    },
    setMailLoading: (state, action) => {
      state.mailLoading = action.payload;
    },
    setMailFetchLoadingState: (state, action) => {
      state.mailFetchLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getMailData,
  getError,
  getMailListData,
  getMailDetail,
  getMailTotalCount,
  setMailLoading,
  setMailFetchLoadingState,
} = mailSlice.actions;

export default mailSlice.reducer;

// Redux Thunk function
export const getEmailDetail = (id) => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/getEmailDetail/` + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      dispatch(getMailDetail(res.data));
    })
    .catch((err) => dispatch(getError(err.response.data)));
};

export const getMailList =
  (filter = {}) =>
  (dispatch) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}api/getMailList`,
        { filter },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        dispatch(getMailListData(res.data));
        dispatch(getMailTotalCount(res.data.length));
        dispatch(getEmailDetail(res.data[0].mailId));
        dispatch(setMailLoading(false));
      })
      .catch((err) => dispatch(getError(err.response)));
  };

export const refreshNewEmail = () => (dispatch) => {
  dispatch(setMailFetchLoadingState(true));
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/mail/refresh`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      dispatch(setMailFetchLoadingState(false));
      toast.success(`${res.data.result}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getMailList());
    })
    .catch((err) => dispatch(getError(err.response.data)));
};
