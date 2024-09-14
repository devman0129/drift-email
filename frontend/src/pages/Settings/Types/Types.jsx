import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import Widget from "components/Base/Widget";
import AddTypeDialog from "./AddTypeDialog/AddTypeDialog";
import EditTypeDialog from "./EditTypeDialog/EditTypeDialog";
import DeleteTypeDialog from "./DeleteTypeDialog/DeleteTypeDialog";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewType,
  getTypes,
  deleteType,
  editType,
} from "redux/Type/typeSlice";
import jwt_decode from "jwt-decode";
import { isEmpty } from "utils";

const Types = () => {
  const [open, setOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    name: "",
  });
  const [editModalState, setEditModalState] = useState({
    open: false,
    editData: [],
  });
  const [rows, setRows] = useState([]);
  const typeData = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const payload = jwt_decode(localStorage.getItem("token"));

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(typeData.types)) setRows(typeData.types.result);
  }, [typeData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (chips, name, badgeColor) => {
    const typeData = {
      typeName: name,
      keywords: chips,
      color: badgeColor,
      email: payload.email,
    };
    dispatch(addNewType(typeData));
    setOpen(false);
  };

  const onEditSubmit = (chips, name, badgeColor, id) => {
    const typeEditData = {
      typeName: name,
      keywords: chips,
      color: badgeColor,
      email: payload.email,
      id: id,
    };
    dispatch(editType(typeEditData));
    setEditModalState({ ...editModalState, open: false });
  };

  const handleDeleteClose = () => {
    setDeleteModalState({ ...deleteModalState, open: false });
  };

  const deleteUserAction = (name) => {
    dispatch(deleteType(name));
    setDeleteModalState({ ...deleteModalState, open: false });
  };

  const handleEditClose = () => {
    setEditModalState({ ...editModalState, open: false });
  };

  return (
    <Widget text={"Types"}>
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
      <TableContainer component={Paper} className="user-table-box">
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className="user-table-cell">Name</TableCell>
              <TableCell className="user-table-cell">Keywords</TableCell>
              <TableCell align="left" className="user-table-cell">
                Color
              </TableCell>
              <TableCell align="center" className="user-table-cell">
                Operation
              </TableCell>
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
                  style={{ minWidth: 150, color: "#4e5c65" }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align="left"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.keyword.map((value) => {
                    return <p>{value}</p>;
                  })}
                </TableCell>
                <TableCell
                  align="left"
                  // key={column.id}
                  style={{ minWidth: 100, color: "#4e5c65" }}
                >
                  {row.color.colorName}
                </TableCell>
                <TableCell
                  align="center"
                  // key={column.id}
                  style={{ minWidth: 150, color: "#4e5c65" }}
                >
                  <button
                    className="action-btn-white mr-4"
                    onClick={() =>
                      setDeleteModalState({
                        ...deleteModalState,
                        open: true,
                        name: row.name,
                      })
                    }
                  >
                    Delete
                  </button>
                  <button
                    className="action-btn-white"
                    onClick={() =>
                      setEditModalState({
                        ...editModalState,
                        open: true,
                        editData: row,
                      })
                    }
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
            Add Type
          </Button>
          <AddTypeDialog
            open={open}
            handleClose={handleClose}
            onSubmit={onSubmit}
          ></AddTypeDialog>
          <EditTypeDialog
            open={editModalState.open}
            handleClose={handleEditClose}
            onSubmit={onEditSubmit}
            editData={editModalState.editData}
          ></EditTypeDialog>
          <DeleteTypeDialog
            open={deleteModalState.open}
            handleClose={handleDeleteClose}
            onClick={deleteUserAction}
            name={deleteModalState.name}
          ></DeleteTypeDialog>
        </div>
      </div>
    </Widget>
  );
};

export default Types;
