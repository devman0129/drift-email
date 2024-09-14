import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  inboxes: [],
  error: "",
};

export const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.token = action.payload;
    },
    getError: (state, action) => {
      state.error = action.payload;
    },
    getInboxList: (state, action) => {
      state.inboxes = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addUser, getError, getInboxList } = accountSlice.actions;

export default accountSlice.reducer;

// Redux Thunk function
export const addNewInboxAccount = (setSpinState) => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/inbox/getURL`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((results) => {
      if (results.data.redirectURL) {
        window.location.href = results.data.redirectURL;
        setSpinState(false);
      }
    })
    .catch((err) => {
      toast.error(`Something went wrong!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setSpinState(false);
    });
};

export const sendAuthorizationCode =
  (authorizationCode, setSpinState) => (dispatch) => {
    setSpinState(true);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}api/inbox/integrateInbox`,
        { authorizationCode },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((results) => {
        const result = results.data;
        console.log(result.CODE);
        if (result.CODE === 200) {
          toast.success(`${result.DETAIL}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setSpinState(false);
          dispatch(getInboxAccountList());
        }
        // window.location.href = 'http://localhost:3000/settings/inboxConnection';
      })
      .catch((results) => {
        toast.error(`Something went wrong!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setSpinState(false);
        dispatch(getInboxAccountList());
      });
  };

export const getInboxAccountList = () => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/inbox/getInboxList`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((result) => {
      if (result.data.code === 200) dispatch(getInboxList(result.data.result));
    })
    .catch(() => {});
};

export const editInboxAccount = (updateData) => (dispatch) => {
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/inbox/updateInbox`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((result) => {
      if (result.status === 200) {
        toast.success("Account Edited successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getInboxAccountList());
      }
    })
    .catch(() => {});
};

export const deleteInboxAccount = (id) => (dispatch) => {
  axios
    .delete(`${process.env.REACT_APP_BASE_URL}api/inbox/deleteInbox/` + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((result) => {
      if (result.status === 200) {
        toast.success("Account deleted successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getInboxAccountList());
      }
    })
    .catch(() => {});
};
