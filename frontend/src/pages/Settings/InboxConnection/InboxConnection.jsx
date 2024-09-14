import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "components/Base/Widget";
import Img from "components/Base/Img";
import EditInboxDialog from "./EditInboxDialog";
import DeleteInboxDialog from "./DeleteInboxDialog";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { BarLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import {
  addNewInboxAccount,
  editInboxAccount,
  getInboxAccountList,
  deleteInboxAccount,
  sendAuthorizationCode,
} from "redux/Account/accountSlice";
import GoogleImg from "assets/img/sign-in-with-google-light.png";
import OutlookImg from "assets/img/sign-in-with-o365-light.png";
import GmailIcon from "assets/img/gmail-icon.png";
import "./InboxConnection.scss";

const InboxConnections = () => {
  const [spinState, setSpinState] = useState(false);
  const [open, setOpen] = useState({
    deleteVisible: false,
    editVisible: false,
    id: "",
    email: "",
  });

  const dispatch = useDispatch();
  const inboxList = useSelector((state) => state.account.inboxes);
  const rows = inboxList;

  useEffect(() => {
    dispatch(getInboxAccountList());
  }, [dispatch]);

  const formatDate = (date) => {
    var ndate = new Date(date);
    var year = ndate.getFullYear().toString().slice(-2);
    var month = (ndate.getMonth() + 1).toString().padStart(2, 0);
    var day = ndate.getDate().toString().padStart(2, 0);
    return `${day}/${month}/${year}`;
  };

  const addNewInbox = () => {
    setSpinState(true);
    dispatch(addNewInboxAccount(setSpinState));
  };

  const handleClickOpen = (id) => {
    setOpen({ ...open, editVisible: true, id: id });
  };

  const handleDeleteClickOpen = (id, email) => {
    setOpen({ ...open, deleteVisible: true, id: id, email: email });
  };

  const handleClose = () => {
    setOpen({ ...open, editVisible: false, deleteVisible: false });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("code")) {
      const authorizationCode = urlParams.get("code");
      dispatch(sendAuthorizationCode(authorizationCode, setSpinState));
    }
  }, [dispatch]);

  const onSubmit = (updateInbox) => {
    const updateData = {
      name: updateInbox.name,
      email: updateInbox.email,
    };
    dispatch(editInboxAccount(updateData));
    setOpen({ ...open, editVisible: false });
  };

  const onDelete = (userId) => {
    dispatch(deleteInboxAccount(userId));
    setOpen({ ...open, deleteVisible: false });
  };

  return (
    <div className="inbox-connection flex flex-col gap-4">
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
      {spinState ? (
        <div className="spinner-background">
          <p style={{ color: "white", marginBottom: "8px" }}>Processing...</p>
          <BarLoader color="#ffc825" loading size={20} speedMultiplier={1} />
        </div>
      ) : (
        <></>
      )}
      <Widget
        text={"Connect with Gmail or Outlook"}
        style={{ marginTop: "-16px" }}
      >
        <div className="flex flex-col mx-[15px] gap-4">
          <div>
            Connect to an inbox you can access (e.g. marketing@abc.com,
            events@abc.com)
          </div>
          <div className="flex gap-2">
            <img
              src={GoogleImg}
              alt={"sign-in-with-google"}
              style={{ cursor: "pointer" }}
              onClick={addNewInbox}
            />
            <img
              src={OutlookImg}
              alt={"sign-in-with-outlook"}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="help-text">
            You can connect multiple inboxes to Drift Email and we'll
            automatically process the email replies.
          </div>
        </div>
      </Widget>
      <Widget text={"Connected Inboxes"}>
        <TableContainer component={Paper} className="inbox-table-box">
          <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className="inbox-table-cell">Name</TableCell>
                <TableCell className="inbox-table-cell">Email</TableCell>
                <TableCell align="left" className="inbox-table-cell">
                  Added
                </TableCell>
                <TableCell align="left" className="inbox-table-cell">
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  className="inbox-table-cell"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className="inbox-table-cell"
                >
                  <TableCell
                    component="th"
                    scope="row"
                    // key={column.id}
                    style={{ minWidth: 100, color: "#4e5c65" }}
                  >
                    <div className="flex gap-2">
                      <Img src={GmailIcon} alt={"gmail icon"} />
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    // key={column.id}
                    style={{ minWidth: 150, color: "#4e5c65" }}
                  >
                    {row.email}
                  </TableCell>
                  <TableCell
                    align="left"
                    // key={column.id}
                    style={{ minWidth: 150, color: "#4e5c65" }}
                  >
                    {formatDate(row.added_date)}
                  </TableCell>
                  <TableCell
                    align="left"
                    // key={column.id}
                    style={{ minWidth: 50, color: "#4e5c65" }}
                  >
                    {row.status === 1 ? (
                      <i
                        className="icon-ok-circled tone-high"
                        style={{ fontStyle: "normal" }}
                      >
                        Good
                      </i>
                    ) : (
                      <i
                        className="icon-attention-circled tone-low"
                        style={{ fontStyle: "normal" }}
                      >
                        Failing
                      </i>
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    // key={column.id}
                    style={{ minWidth: 80, color: "#4e5c65" }}
                  >
                    <button
                      className="action-btn-white mr-4"
                      onClick={() => handleDeleteClickOpen(row._id, row.email)}
                    >
                      <i className="icon-trash-empty text-[#4e5c65]"></i>
                      Delete
                    </button>
                    <button
                      className="action-btn-white"
                      onClick={() => handleClickOpen(row._id)}
                    >
                      <i className="icon-pencil text-[#4e5c65]"></i>
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Widget>
      <EditInboxDialog
        open={open.editVisible}
        userId={open.id}
        handleClose={handleClose}
        onSubmit={onSubmit}
      />
      <DeleteInboxDialog
        open={open.deleteVisible}
        userId={open.id}
        userEmail={open.email}
        handleClose={handleClose}
        onDelete={onDelete}
      />
    </div>
  );
};

export default InboxConnections;
