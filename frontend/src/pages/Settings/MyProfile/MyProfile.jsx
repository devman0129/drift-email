import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer } from "react-toastify";
import Widget from "components/Base/Widget";
import {
  getOneUser,
  updateOneUser,
  updateOnePassword,
} from "redux/User/userSlice";
import { isEmpty } from "utils";
import jwt_decode from "jwt-decode";

const MyProfile = () => {
  const payload = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
  });
  const [validationMsg, setValidationMsg] = useState({
    name: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState({
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [handleChangeCallable, setHandleChangeCallable] = useState(false);
  const [handlePasswordChangeCallable, setHandlePasswordChangeCallable] =
    useState({ password: false, password2: false });

  // const [errMsg, setErrMsg] = useState('');
  const profileData = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    dispatch(getOneUser(payload.email));
  }, [dispatch, payload.email]);

  useEffect(() => {
    // setErrMsg(user.error ? user.error : '');
    if (!isEmpty(user.error)) {
      setHandlePasswordChangeCallable({
        ...handlePasswordChangeCallable,
        password: true,
        password2: true,
      });
    }
  }, [user.error, handlePasswordChangeCallable]);

  useEffect(() => {
    if (!isEmpty(profileData)) {
      setUserProfile({
        ...userProfile,
        name: profileData.name,
        email: profileData.email,
      });
    }
  }, [profileData]);

  const handleChange = (event) => {
    setHandleChangeCallable(true);

    let elementName = event.target.name;
    console.log(elementName, event.target.value);
    setUserProfile({ ...userProfile, [elementName]: event.target.value });
    setValidationMsg({
      ...validationMsg,
      [elementName]: "",
    });
  };
  const handlePasswordChange = (event) => {
    setNewPassword({
      ...newPassword,
      password: event.target.value,
    });
    setHandlePasswordChangeCallable({
      ...handlePasswordChangeCallable,
      password: true,
    });
  };
  const handlePassword2Change = (event) => {
    setNewPassword({
      ...newPassword,
      password2: event.target.value,
    });
    setHandlePasswordChangeCallable({
      ...handlePasswordChangeCallable,
      password2: true,
    });
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const passwordSubmitDisableState = () => {
    return !newPassword.password ||
      !newPassword.password2 ||
      newPassword.password !== newPassword.password2 ||
      !handlePasswordChangeCallable.password ||
      !handlePasswordChangeCallable.password2
      ? true
      : false;
  };

  const onChangeSubmit = () => {
    let updateData = {
      name: userProfile.name,
      email: profileData.email,
    };
    dispatch(updateOneUser(updateData));
    setHandleChangeCallable(false);
  };

  const passwordChange = () => {
    let updatePassword = {
      password: newPassword.password,
      email: profileData.email,
    };
    dispatch(updateOnePassword(updatePassword));
    setHandlePasswordChangeCallable({
      ...handlePasswordChangeCallable,
      password: false,
      password2: false,
    });
  };

  return (
    <div className="flex flex-col gap-4 min-w-[740px] max-w-[1044px]">
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
      <Widget text={"Name & Email Address"} style={{ marginTop: "-16px" }}>
        <DialogContent>
          <TextField
            autoFocus
            size="small"
            margin="dense"
            type="name"
            label="Name"
            onChange={handleChange}
            id="name"
            name="name"
            value={userProfile.name ? userProfile.name : ""}
            fullWidth
            required={true}
            error={validationMsg.name ? true : false}
            helperText={validationMsg.name}
          />
          <TextField
            autoFocus
            size="small"
            margin="dense"
            type="email"
            label="Email"
            id="email"
            name="email"
            value={userProfile.email ? userProfile.email : ""}
            disabled={true}
            fullWidth
            style={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 12px 0" }}>
          <Button
            onClick={onChangeSubmit}
            type="submit"
            variant="contained"
            className="AddUserBtn"
            disabled={
              validationMsg.name || !handleChangeCallable ? true : false
            }
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setUserProfile({ ...userProfile, name: profileData.name });
            }}
            variant="outlined"
            className="EditUserBtn"
            disabled={
              validationMsg.name || !handleChangeCallable ? true : false
            }
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Widget>
      <Widget text={"Change Password"}>
        <DialogContent>
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel htmlFor="outlined-adornment-password">
              New password
            </InputLabel>
            <OutlinedInput
              onChange={handlePasswordChange}
              id="password1"
              label="New password"
              name="password"
              required={true}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            margin="dense"
            style={{ marginTop: "20px" }}
            error={
              newPassword.password2 &&
              newPassword.password !== newPassword.password2
                ? true
                : false
            }
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm new password
            </InputLabel>
            <OutlinedInput
              id="password2"
              name="password"
              required={true}
              label="Confirm new password"
              onChange={handlePassword2Change}
              fullWidth
              type={showPassword2 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword2}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="component-error-text">
              {newPassword.password === newPassword.password2
                ? ""
                : "confirm password not matched"}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 12px 0" }}>
          <Button
            onClick={passwordChange}
            type="submit"
            variant="contained"
            className="AddUserBtn"
            disabled={passwordSubmitDisableState()}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setUserProfile({ ...userProfile, name: profileData.name });
            }}
            variant="outlined"
            className="EditUserBtn"
            disabled={passwordSubmitDisableState()}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Widget>
    </div>
  );
};

export default MyProfile;
