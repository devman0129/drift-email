import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import isEmail from "validator/lib/isEmail";
import { emptyErrorMsg } from "redux/User/userSlice";
import "./AddUserDialog.scss";

const AddUserDialog = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [errMsg, setErrMsg] = useState(" ");
  const [oneUser, setOneUser] = useState({
    name: "",
    email: "",
    role: 0,
  });
  const [validationMsg, setValidationMsg] = useState({
    name: "",
    email: "",
  });
  const [validEmail, setValidEmail] = useState(true);

  useEffect(() => {
    setErrMsg(user.msg ? user.msg : "");
  }, [user.msg]);

  const handleChange = (event) => {
    dispatch(emptyErrorMsg());

    let elementName = event.target.name;
    setOneUser({ ...oneUser, [elementName]: event.target.value });
    if (event.target.value.length === 0) {
      setValidEmail(true);
      setValidationMsg({
        ...validationMsg,
        [elementName]: "This field is required!",
      });
    } else {
      if (event.target.name === "email") {
        if (isEmail(event.target.value)) {
          setValidEmail(true);
        } else {
          setValidEmail(false);
        }
      }
      setValidationMsg({
        ...validationMsg,
        [elementName]: "",
      });
    }
  };

  return (
    <Fragment>
      <ValidatorForm
        onSubmit={() => {
          props.onSubmit(oneUser);
        }}
      >
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          className="add-user-dialog"
          fullWidth
        >
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Use this form to add a user to your Drift Email account. They will
              be sent a welcome email with login instructions. All fields are
              required.
            </DialogContentText>
            <TextValidator
              autoFocus
              size="small"
              margin="dense"
              type="name"
              label="Name"
              onChange={handleChange}
              id="name"
              name="name"
              value={oneUser.name}
              fullWidth
              required={true}
              error={validationMsg.name ? true : false}
              helperText={validationMsg.name}
            />
            <TextValidator
              autoFocus
              size="small"
              margin="dense"
              type="email"
              label="Email"
              onChange={handleChange}
              id="email"
              name="email"
              value={oneUser.email}
              fullWidth
              // validators={['isEmail']}
              // errorMessages={['email is not valid']}
              error={validationMsg.email ? true : false}
              helperText={validationMsg.email}
            />
            {validEmail ? (
              <></>
            ) : (
              <p className="invalid-error">Invalied Email!</p>
            )}
            {errMsg ? (
              <p className="invalid-error">Email already exist!</p>
            ) : (
              <></>
            )}
            <FormControl
              sx={{ minWidth: 120 }}
              size="small"
              margin="dense"
              fullWidth
            >
              <InputLabel id="demo-select-small">Role</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                defaultValue={0}
                label="Role"
                name="role"
                onChange={handleChange}
              >
                <MenuItem value={0}>User</MenuItem>
                <MenuItem value={1}>Manager</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0px 22px 15px 0px",
            }}
          >
            {user.loading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                sx={{
                  textTransform: "none",
                }}
              >
                Save
              </LoadingButton>
            ) : (
              <Button
                onClick={() => props.onSubmit(oneUser)}
                type="submit"
                variant="contained"
                className="AddUserBtn"
                disabled={
                  validationMsg.name ||
                  validationMsg.email ||
                  !validEmail ||
                  errMsg
                    ? true
                    : false
                }
                sx={{
                  textTransform: "none",
                }}
              >
                Save
              </Button>
            )}

            <Button
              onClick={props.handleClose}
              variant="outlined"
              className="AddUserBtn"
              sx={{
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </ValidatorForm>
    </Fragment>
  );
};

export default AddUserDialog;
