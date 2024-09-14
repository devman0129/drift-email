import React, { Fragment, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";

import "./DeleteInboxDialog.scss";
import { isEmpty } from "utils";

const DeleteInboxDialog = (props) => {
  const userId = useMemo(() => {
    if (!isEmpty(props.userId)) {
      return props.userId;
    }
  }, [props.userId]);

  return (
    <Fragment>
      <ValidatorForm onSubmit={() => console.log(1)}>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          fullWidth
          className="delete-inbox-dialog"
          sx={{
            "& .css-tlc64q-MuiPaper-root-MuiDialog-paper": {
              maxWidth: 625,
            },
          }}
        >
          <DialogTitle>Delete this connected inbox?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete the inbox sync for 
              ${props.userEmail ?? " "}? This will stop Drift Email from
              processing future replies but past data will remain in your
              account.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0px 22px 15px 0px",
            }}
          >
            <Button
              onClick={() => {
                props.onDelete(userId);
              }}
              type="submit"
              variant="contained"
              className="AddUserBtn"
              sx={{ textTransform: "none" }}
            >
              Submit
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

export default DeleteInboxDialog;
