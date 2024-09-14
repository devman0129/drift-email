import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import EditUserDialog from "pages/Settings/Users/EditUserDialog";
import DeleteUserDialog from "pages/Settings/Users/DeleteUserDialog";
import jwt_decode from "jwt-decode";
import "./WidgetTable.scss";
import {
  getAllUser,
  updateUser,
  deleteUser,
  resendInvite,
} from "redux/User/userSlice";

const WidgetTable = (props) => {
  const payload = jwt_decode(localStorage.getItem("token"));
  const [open, setOpen] = React.useState({
    deleteVisible: false,
    editVisible: false,
    id: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userList = user.users;
  const rows = userList;

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleClose = () => {
    setOpen({ ...open, editVisible: false });
  };

  const handleDeleteClose = () => {
    setOpen({ ...open, deleteVisible: false });
  };

  const onSubmit = (userData) => {
    setOpen({ ...open, editVisible: false });
    dispatch(updateUser(userData));
  };

  const deleteUserAction = (id) => {
    setOpen({ ...open, deleteVisible: false });
    dispatch(deleteUser(id));
  };

  const sendInvite = (email, name) => {
    const invitor = payload.name;
    dispatch(resendInvite({ email: email, name: name, invitor: invitor }));
  };

  const formatDate = (date) => {
    var ndate = new Date(date);
    var year = ndate.getFullYear().toString().slice(-2);
    var month = (ndate.getMonth() + 1).toString().padStart(2, 0);
    var day = ndate.getDate().toString().padStart(2, 0);

    return `${day}/${month}/${year}`;
  };

  const findRole = (role) => {
    switch (role) {
      case 1:
        return "manager";
      case 2:
        return "Admin";
      default:
        return "user";
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="user-table-box">
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className="user-table-cell">Name</TableCell>
              <TableCell className="user-table-cell">Email</TableCell>
              <TableCell align="left" className="user-table-cell">
                Added
              </TableCell>
              <TableCell align="left" className="user-table-cell">
                Role
              </TableCell>
              <TableCell align="center" className="user-table-cell">
                Status
              </TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className="user-table-cell"
              >
                <TableCell
                  component="th"
                  scope="row"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align="left"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  align="left"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {formatDate(row.added_date)}
                </TableCell>
                <TableCell
                  align="left"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {findRole(row.role)}
                </TableCell>
                <TableCell
                  align="center"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.status === 1 ? (
                    <i className="icon-ok-circled tone-high"></i>
                  ) : user.resendLoading.state &&
                    row.email === user.resendLoading.email ? (
                    <LoadingButton
                      key={row.id}
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                      style={{
                        fontSize: "12px",
                        color: "#4e5c65",
                        padding: "2px 6px",
                        textTransform: "lowercase",
                        borderColor: "#9eabb3",
                        border: "1px solid #9eabb3",
                        borderRadius: "3px",
                      }}
                    >
                      Invite
                    </LoadingButton>
                  ) : (
                    <button
                      className="btn action-btn-white"
                      onClick={() => sendInvite(row.email, row.name)}
                      style={{ fontSize: "12px", color: "#4e5c65" }}
                    >
                      <i className="icon-attention-circled tone-med"></i>
                      Invite
                    </button>
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.email !== payload.email ? (
                    <>
                      <button
                        className="action-btn-white mr-4"
                        onClick={() =>
                          setOpen({ ...open, deleteVisible: true, id: row._id })
                        }
                      >
                        Delete
                      </button>
                      <button
                        className="action-btn-white"
                        onClick={() =>
                          setOpen({ ...open, editVisible: true, id: row._id })
                        }
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <div></div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditUserDialog
        open={open.editVisible}
        handleClose={handleClose}
        onSubmit={onSubmit}
        id={open.id}
      ></EditUserDialog>
      <DeleteUserDialog
        open={open.deleteVisible}
        handleClose={handleDeleteClose}
        onClick={deleteUserAction}
        id={open.id}
      ></DeleteUserDialog>
    </>
  );
};

export default WidgetTable;
