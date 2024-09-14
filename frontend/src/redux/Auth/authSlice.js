import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  token: "",
};

export const userSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    getError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getError } = userSlice.actions;

export default userSlice.reducer;

// Redux Thunk function
export const loginAction = (userData, setSpinState) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}api/user/login`, userData)
    .then((res) => {
      switch (res.data.code) {
        default:
          toast.success("your login successed", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          if (res.data.token !== null) {
            const token = res.data.token;
            localStorage.setItem("token", token);
          }
          window.location.href = "/";
          setSpinState(false);
          break;
      }
    })
    .catch((err) => {
      switch (err.response.data.code) {
        case 400:
          toast.error(`The email address is invalid.`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          break;
        case 401:
          toast.error(`Password is invalid.`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          break;
        default:
          break;
      }
      setSpinState(false);
      dispatch(getError(err.response.data));
    });
};

export const sendVerify = (data, navigate) => (dispatch) => {
  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}api/user/confirmation/` + data.token,
      {
        password: data.password,
      }
    )
    .then((res) => {
      switch (res.data.code) {
        case 400:
          toast.error(`This link has been expired`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          break;
        default:
          navigate("/");
          toast.success("Your account successfully activated", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });

          if (res.data.token !== null) {
            localStorage.setItem("token", res.data.token);
          }
          break;
      }
    })
    .catch((err) => dispatch(getError(err)));
};

export const googleLoginAction =
  (tokenResponse, setSpinState) => (dispatch) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}api/user/googleLogin`,
        tokenResponse
      )
      .then((res) => {
        switch (res.data.code) {
          default:
            toast.success("your login successed", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            if (res.data.token !== null) {
              const token = res.data.token;
              localStorage.setItem("token", token);
            }
            setSpinState(false);
            window.location.href = "/inbox";
            break;
        }
      })
      .catch((err) => {
        switch (err.response.data.code) {
          case 400:
            toast.error(`You have no permission to login`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            break;
          case 500:
            toast.error(`Something went wrong`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            break;
          default:
            break;
        }
        setSpinState(false);
        dispatch(getError(err.response.data));
      });
  };
