import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeleteTypeDialog = (props) => {
  const deleteUser = () => {
    props.onClick(props.name);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      className="delete-user-dialog"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this Type?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "0px 22px 15px 0px",
        }}
      >
        <Button
          onClick={deleteUser}
          autoFocus
          variant="contained"
          className="AddUserBtn"
          sx={{ textTransform: "none" }}
        >
          Submit
        </Button>
        <Button
          onClick={props.handleClose}
          className="AddUserBtn"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTypeDialog;
