import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import axios from "axios";

const initialState = {
  token: "",
  msg: "",
  error: "",
  userProfile: {},
  success: { state: false },
  users: [],
  loading: false,
  resendLoading: { state: true, email: "" },
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    addUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    resendInviteLoading: (state, action) => {
      state.resendLoading.state = action.payload.state;
      state.resendLoading.email = action.payload.email;
    },
    alreadyExist: (state, action) => {
      state.msg = action.payload;
      state.success.state = false;
    },
    getUser: (state, action) => {
      state.userProfile = action.payload;
      // state.success.state = true;
    },
    getUserList: (state, action) => {
      state.users = action.payload;
      state.success.state = true;
    },
    getError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addUserLoading,
  resendInviteLoading,
  alreadyExist,
  getUser,
  getUserList,
  getError,
} = userSlice.actions;

export default userSlice.reducer;

// Redux Thunk function
export const addNewUser = (userData) => (dispatch) => {
  dispatch(addUserLoading(true));
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/user/register`, userData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      switch (res.data.code) {
        default:
          toast.success("New account added successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          dispatch(getAllUser());
      }
      dispatch(addUserLoading(false));
    })
    .catch((err) => {
      switch (err.response.data.code) {
        case 422:
          toast.error(`This email is already exist!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          dispatch(alreadyExist("already exist"));
          break;
        case 400:
          toast.error(`Can't send invite. Please send invite again!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          dispatch(getAllUser());
          break;
        default:
          break;
      }
      dispatch(getError(err.response.data));
    });
};

export const getAllUser = () => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}api/user/getAll`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      dispatch(getUserList(res.data.result));
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};

export const getOneUser = (data) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/user/getOne`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.data.code === 200) dispatch(getUser(res.data.result));
    })
    .catch((err) => {
      dispatch(getError(err.response.data));
    });
};

export const updateUser = (updateUserData) => (dispatch) => {
  let id = updateUserData._id;
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/user/update/` + id,
      updateUserData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        toast.success("Edited successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getAllUser());
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getAllUser());
      dispatch(getError(err.response.data));
    });
};

export const updateOneUser = (updateData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/user/updateOne`, updateData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Edited successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getOneUser(updateData.email));
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getError(err.response.data));
    });
};

export const deleteUser = (id) => (dispatch) => {
  axios
    .delete(`${process.env.REACT_APP_BASE_URL}api/user/delete/` + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getAllUser());
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getError(err.response.data));
    });
};

export const emptyErrorMsg = () => (dispatch) => {
  dispatch(alreadyExist(""));
};

export const resendInvite = (data) => (dispatch) => {
  dispatch(resendInviteLoading({ state: true, email: data.email }));
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/user/resendInvite`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      console.log(res.data.code);
      if (res.data.code === 200)
        toast.success("Invite resent successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      dispatch(resendInviteLoading({ state: false, email: data.email }));
    })
    .catch((err) => {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.log(err);
    });
};

export const updateOnePassword = (updateData) => (dispatch) => {
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/user/updateOnePassword`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        toast.success("Updated password successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getOneUser(updateData.email));
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getError(err.response.data.error));
    });
};
