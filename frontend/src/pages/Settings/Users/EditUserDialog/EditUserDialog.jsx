import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "./EditUserDialog.scss";

const EditUserDialog = (props) => {
  const user = useSelector((state) => state.user);
  const [oneUser, setOneUser] = useState({});
  const [validationMsg, setValidationMsg] = useState({
    name: "",
    email: "",
  });
  const [handleChangeCallable, setHandleChangeCallable] = React.useState(false);

  useEffect(() => {
    if (user.users.length !== 0) {
      let temp = user.users.filter((item) => item._id === props.id);
      if (temp.length !== 0) {
        setOneUser(temp[0]);
      }
    }
  }, [user, props.id]);

  const handleChange = (event) => {
    setHandleChangeCallable(true);
    let elementName = event.target.name;
    setOneUser({ ...oneUser, [elementName]: event.target.value });
    setValidationMsg({
      ...validationMsg,
      [elementName]: "",
    });
  };

  return (
    <Fragment>
      <ValidatorForm onSubmit={() => console.log(1)}>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          className="edit-user-dialog"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>Use this form to edit a user</DialogContentText>
            <TextValidator
              autoFocus
              size="small"
              margin="dense"
              type="name"
              label="Name"
              onChange={handleChange}
              id="name"
              name="name"
              value={oneUser.name ? oneUser.name : ""}
              required={true}
              error={validationMsg.name ? true : false}
              helperText={validationMsg.name}
              fullWidth
            />
            <TextValidator
              autoFocus
              size="small"
              margin="dense"
              type="email"
              label="Email"
              // onChange={handleChange}
              id="email"
              name="email"
              value={oneUser.email ? oneUser.email : ""}
              disabled={true}
              fullWidth
            />
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
                value={oneUser.role ? `${oneUser.role}` : 0}
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
            <Button
              onClick={() => {
                props.onSubmit(oneUser);
                setHandleChangeCallable(false);
              }}
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
              onClick={props.handleClose}
              variant="outlined"
              className="EditUserBtn"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </ValidatorForm>
    </Fragment>
  );
};

export default EditUserDialog;
