import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction, googleLoginAction } from "redux/Auth/authSlice";
import isEmail from "validator/lib/isEmail";
import { ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useGoogleLogin } from "@react-oauth/google";
import Img from "components/Base/Img";
import Logo from "assets/img/logo.png";
import LoginImage from "assets/img/login-google.png";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

const Login = () => {
  const dispatch = useDispatch();

  const [inputState, setInputState] = useState({
    username: "",
    password: "",
  });
  const [validEmail, setValidEmail] = useState(true);
  const [spinState, setSpinState] = useState(false);

  const onChange = (e) => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      if (isEmail(e.target.value)) {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
    }
  };

  const login = () => {
    setSpinState(true);
    var user = {
      email: inputState.username,
      password: inputState.password,
    };
    dispatch(loginAction(user, setSpinState));
  };

  const googleAuthSuccess = (tokenResponse) => {
    setSpinState(true);
    dispatch(googleLoginAction(tokenResponse, setSpinState));
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => googleAuthSuccess(tokenResponse),
  });

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
      <div className="loginform">
        <h2 className="headerTitle">
          <div style={{ width: "450px", margin: "0 auto" }}>
            <Img src={Logo} alt="logo" />
          </div>
        </h2>
        {spinState ? (
          <BeatLoader
            color="rgba(2, 122, 0, 0.53)"
            cssOverride={{
              margin: "0 auto",
              top: "24vh",
              left: "260px",
              position: "absolute",
              background: "#b5b5b552",
              borderRadius: "4px",
              padding: "20px 20px 14px 20px",
            }}
            loading
            size={20}
            speedMultiplier={1}
          />
        ) : (
          <></>
        )}
        <div>
          <div className="form-field">
            <label>{"Username"}</label>
            <input
              type={"text"}
              name="username"
              placeholder={"Enter your username"}
              onChange={onChange}
              style={{ background: "transparent" }}
            />
          </div>
          <div className="form-field">
            <label>{"Password"}</label>
            <input
              type={"password"}
              name="password"
              placeholder={"Enter your password"}
              onChange={onChange}
              style={{ background: "transparent" }}
            />
          </div>
          <div
            className="form-field login-button"
            style={{ paddingTop: "35px" }}
          >
            {inputState.username === "" ||
            inputState.password === "" ||
            !validEmail ? (
              <button style={{ background: "#dbdbdb" }} disabled>
                {"Log in"}
              </button>
            ) : (
              <button onClick={login}>{"Log in"}</button>
            )}
          </div>
        </div>
        <div className="alternative-login">
          <label>Or sign in with:</label>
          <div className="icon-group">
            <button onClick={() => googleLogin()}>
              <Img src={LoginImage} alt={"login button"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
