import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Img from "components/Base/Img";
import Logo from "assets/img/logo.png";
import { sendVerify } from "redux/Auth/authSlice";
import "./NewUser.scss";

const NewUser = () => {
  const [inputState, setInputState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const location = useLocation();
  const token = location.pathname.slice(location.pathname.indexOf("/", 2) + 1);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChange = (e) => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  const verifyUser = () => {
    dispatch(
      sendVerify({ token: token, password: inputState.password }, navigate)
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="registerform">
        <h2 className="headerTitle">
          <div
            style={{ width: "450px", margin: "0 auto", paddingBottom: "10px" }}
          >
            <Img src={Logo} alt="logo" />
          </div>
          {inputState.password !== inputState.confirmPassword &&
          inputState.confirmPassword !== "" ? (
            <p style={{ color: "red" }}>Confirm password not matched</p>
          ) : (
            <p>Change your new password</p>
          )}
        </h2>

        <div className="form-field">
          <label>{"New password"}</label>
          <input
            name="password"
            placeholder={"Enter your new password"}
            onChange={onChange}
            type={showPassword ? "text" : "password"}
            style={{ background: "transparent", borderRadius: "5px" }}
          />
          <IconButton
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            className="show-password-button"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <div className="form-field" style={{ paddingTop: "10px" }}>
          <label>{"Confirm password"}</label>
          <input
            name="confirmPassword"
            placeholder={"Confirm your password"}
            onChange={onChange}
            type={showConfirmPassword ? "text" : "password"}
            style={{ background: "transparent", borderRadius: "5px" }}
          />
          <IconButton
            onClick={handleClickShowConfirmPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            className="show-password-button"
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <div className="form-field-login-button" style={{ paddingTop: "25px" }}>
          {inputState.password === "" ||
          inputState.confirmPassword === "" ||
          inputState.password !== inputState.confirmPassword ? (
            <button style={{ background: "#dbdbdb" }} disabled>
              {"Continiue"}
            </button>
          ) : (
            <button onClick={verifyUser}>{"Continiue"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewUser;
