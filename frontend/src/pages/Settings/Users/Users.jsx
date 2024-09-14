import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Widget from "components/Base/Widget";
import WidgetTable from "components/Base/WidgetTable";
import AddUserDialog from "./AddUserDialog";
import Button from "@mui/material/Button";
import { addNewUser } from "redux/User/userSlice";
import jwt_decode from "jwt-decode";
import "./Users.scss";

const Users = () => {
  const payload = jwt_decode(localStorage.getItem("token"));
  const invitor = payload.name;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (userData) => {
    userData.invitor = invitor ?? "Reply Intelligence";
    dispatch(addNewUser(userData));
  };

  useEffect(() => {
    if (user.success.state) {
      setOpen(false);
    }
  }, [user]);

  return (
    <Widget text={"Users"}>
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
      <WidgetTable />
      <div className="flex justify-between items-center mx-4">
        <div>
          <Button
            variant="contained"
            className="addUser"
            onClick={handleClickOpen}
            sx={{
              textTransform: "none",
            }}
          >
            Add User
          </Button>
          <AddUserDialog
            open={open}
            handleClose={handleClose}
            onSubmit={onSubmit}
          ></AddUserDialog>
        </div>
        <div className="flex text-[12px] item-center justify-center gap-4">
          <div>
            <i className="icon-ok-circled tone-high"></i> Valid login
          </div>
          <div>
            <i className="icon-attention-circled tone-med"></i> Hasn't logged in
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default Users;
