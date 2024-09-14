import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MuiChipsInput } from "mui-chips-input";
import { ColorPalette } from "mui-color";
import { Divider } from "@mui/material";

const palette = {
  red: "#ff1744",
  blue: "#00b0ff",
  green: "#00e676",
  yellow: "#ffee33",
  gray: "#696969",
  orange: "#ff9100",
  purple: "#dd33fa",
  white: "#e0e0e0",
  lime: "#d4e157",
  ligntPink: "#ffc0cb",
  teal: "#a7ffeb",
  indigo: "#3d5afe",
  pink: "#ff4081",
  deepPurple: "#7c4dff",
  brown: "#8d6e63",
  blueGray: "#78909c",
  deepOrange: "#ff5722",
};

const AddTypeDialog = (props) => {
  const [chips, setChips] = useState([]);
  const [name, setName] = useState("");
  const [badgeColor, setBadgeColor] = useState({ colorName: "", color: "" });

  const handleChipInputChange = (newChips) => {
    setChips(newChips);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleBadgeColor = (colorName, color) => {
    setBadgeColor({ ...badgeColor, colorName, color });
  };

  const handleSubmit = () => {
    setChips([]);
    setName("");
    props.onSubmit(chips, name, badgeColor);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      className="add-type-dialog"
      fullWidth
    >
      <DialogTitle>Add type</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Use this form to add a type to mark incoming emails. The Keyword can
          be more than one value for each type. <br />
          (Ex: Type = Vacation, Keywords = “I am on Vacation”, “I will be on
          Vacation”)
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="type"
          label="Type"
          type="type"
          fullWidth
          variant="outlined"
          size="small"
          value={name}
          onChange={handleInputChange}
          placeholder="Type name"
        />
        <MuiChipsInput
          fullWidth
          variant="outlined"
          id="keyword"
          label="Keyword"
          type="keyword"
          value={chips}
          size="small"
          onChange={handleChipInputChange}
          sx={{ marginTop: "8px" }}
        />
        <p className="text-center my-2">Select Badge Color</p>
        <Divider />
        <ColorPalette palette={palette} onSelect={handleBadgeColor} />
        <Divider />
      </DialogContent>
      <DialogActions
        sx={{
          padding: "0px 22px 15px 0px",
        }}
      >
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          className="AddUserBtn"
          disabled={name && chips.length !== 0 && badgeColor ? false : true}
          sx={{
            textTransform: "none",
          }}
        >
          Save
        </Button>

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
  );
};

export default AddTypeDialog;
