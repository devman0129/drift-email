import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "./EditInboxDialog.scss";
import { isEmpty } from "utils";

const EditInboxDialog = (props) => {
  const inboxList = useSelector((state) => state.account.inboxes);
  const [updateInbox, setUpdateInbox] = useState({
    name: "",
    email: "",
  });
  const [handleChangeCallable, setHandleChangeCallable] = useState(false);

  useEffect(() => {
    if (!isEmpty(inboxList)) {
      let temp = inboxList.filter((item) => item._id === props.userId);
      if (!isEmpty(temp)) {
        setUpdateInbox(temp[0]);
      }
    }
  }, [inboxList, props.userId]);

  const handleChange = (event) => {
    setHandleChangeCallable(true);
    setUpdateInbox({ ...updateInbox, name: event.target.value });
  };

  return (
    <Fragment>
      <ValidatorForm onSubmit={() => console.log(1)}>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          className="edit-inbox-dialog"
          fullWidth
        >
          <DialogTitle>Rename an Inbox connection</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change the name associated with an Inbox
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
              value={updateInbox.name ?? ""}
              fullWidth
              required={true}
              error={!updateInbox.name ? true : false}
              helperText={!updateInbox.name ? "Name field is requried!" : ""}
            />
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0px 22px 15px 0px",
            }}
          >
            <Button
              onClick={() => {
                props.onSubmit(updateInbox);
                setHandleChangeCallable(false);
              }}
              type="submit"
              variant="contained"
              disabled={
                !updateInbox.name || !handleChangeCallable ? true : false
              }
              sx={{
                textTransform: "none",
              }}
            >
              Save
            </Button>
            <Button
              onClick={props.handleClose}
              variant="outlined"
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

export default EditInboxDialog;
