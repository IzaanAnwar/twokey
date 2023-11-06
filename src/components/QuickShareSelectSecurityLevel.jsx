import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

export default function QuickShareSelectSecurityLevel({
  open,
  selectedUsers,
  onClose,
  droppedFiles,
  handleRemoveFile,
}) {
  const [alignment, setAlignment] = useState("low");

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
      margin: theme.spacing(0.2),
      border: 0,
      "&.Mui-disabled": {
        border: 0,
      },
      "&:not(:first-of-type)": {
        borderRadius: theme.shape.borderRadius,
      },
      "&:first-of-type": {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }));

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment);
  };

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle>Security Level</DialogTitle>
      <DialogContent className="bg-gray-100">
        <div className="w-80 py-4">
          <ul className="my-2">
            {droppedFiles.map((file, index) => (
              <li
                key={file.name}
                className="text-xs bg-white border border-gray-200 border-b-2 border-b-green-600 rounded-md py-1 px-4 mb-1 flex items-center justify-between "
              >
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-white bg-gray-200 rounded-full h-4 w-4 text-xs hover:text-gray-700 focus:outline-none"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 text-sm font-semibold">Security Level</p>

          <ul>
            {selectedUsers.map((user) => (
              <li key={user.id}>
                <p>{user.email}</p>
              </li>
            ))}
          </ul>

          {/* <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            size="small"
            className=" bg-slate-200 my-2 border-none"
            style={{ border: "none" }}
          >
            <ToggleButton value="low">
              <p className="capitalize">low</p>
            </ToggleButton>
            <ToggleButton value="moderate">
              <p className="capitalize">moderate</p>
            </ToggleButton>
            <ToggleButton value="enhanced">
              <p className="capitalize">enhanced</p>
            </ToggleButton>
            <ToggleButton value="high">
              <p className="capitalize">high</p>
            </ToggleButton>
            <ToggleButton value="maximum">
              <p className="capitalize">maximum</p>
            </ToggleButton>
          </ToggleButtonGroup> */}

          <StyledToggleButtonGroup
            size="small"
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
            sx={{ backgroundColor: "#E9EDF5" }}
          >
            <ToggleButton value="low">
              <p className="capitalize">low</p>
            </ToggleButton>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButton value="moderate">
              <p className="capitalize">moderate</p>
            </ToggleButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButton value="enhanced">
              <p className="capitalize">enhanced</p>
            </ToggleButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButton value="high">
              <p className="capitalize">high</p>
            </ToggleButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButton value="maximum">
              <p className="capitalize">maximum</p>
            </ToggleButton>
          </StyledToggleButtonGroup>
        </div>
      </DialogContent>
      <DialogActions style={{ margin: "5px" }}>
        <button
          onClick={onClose}
          className="text-black border border-gray-300 py-1 px-3 rounded-lg"
        >
          Cancel
        </button>
        <button
          //   onClick={handleUploadClick}
          className="bg-blue-700 text-white py-1 px-3 rounded-lg"
        >
          Upload
        </button>
      </DialogActions>
    </Dialog>
  );
}
