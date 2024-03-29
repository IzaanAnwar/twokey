import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ReadIcon from "../assets/read.svg";
import UnfoldIcon from "../assets/unfold.svg";
import { useDarkMode } from "../context/darkModeContext";
import { useAuth } from "../context/authContext";
import Avatar from "@mui/material/Avatar";

const ProfileLogs = ({ logs }) => {
  const { darkMode } = useDarkMode();

  const location = useLocation();

  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "text-gray-800"}`}>
      <Box sx={{ width: "100%" }}>
        <TableContainer component={Paper} sx={{ height: "300px" }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7F9FCCC" }}>
                <TableCell />
                <TableCell>
                  <p className="flex flex-row items-center">
                    FILE NAME <img src={UnfoldIcon} alt="↓" />
                  </p>
                </TableCell>
                <TableCell>OWNER</TableCell>
                <TableCell align="center">
                  STATUS
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell align="center">SIZE</TableCell>
                <TableCell align="center">
                  SECURITY
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell align="center">
                  <p className="flex flex-row items-center">
                    LAST UPDATED <img src={UnfoldIcon} alt="↓" />
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs && logs.length > 0 ? (
                logs.map((row) => <Row key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [Logs, setLogs] = useState([]);
  const { formatFileSize } = useAuth();

  const getLogs = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const accessLogs = await axios.get(
        `https://twokeybackend.onrender.com/file/getLogs/access/${fileId}`,

        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log(`received`, accessLogs.data);

      setLogs(accessLogs.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowClick = async () => {
    setOpen(!open);
    // Call getLogs only if the row is opened
    if (!open) {
      await getLogs(row.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    const options = {
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          cursor: "pointer",
        }}
        onClick={handleRowClick}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <p className="text-indigo-600 font-medium">{row.name}</p>
        </TableCell>
        <TableCell align="center">
          <Tooltip title={row.owner_email} arrow>
            <Avatar
              sx={{ width: "30px", height: "30px" }}
              src={row.profile_pic}
              alt="Owner"
              variant="rounded"
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <p className="bg-gray-100 text-gray-800 rounded-md py-1">
            {/* {row.status} */}
            Team
          </p>
        </TableCell>
        <TableCell align="center">
          {row.metadata && row.metadata.size ? (
            <p className="bg-gray-100 text-gray-800 rounded-md py-1">
              {formatFileSize(row.metadata.size)}
            </p>
          ) : (
            <p className="bg-gray-100 text-gray-800 rounded-md py-1">N/A</p>
          )}
        </TableCell>
        <TableCell align="center">
          <strong className="bg-green-100 text-green-700  rounded-md py-1 px-4">
            {/* {row.security} */}
            Enhanced
          </strong>
        </TableCell>
        <TableCell align="center">
          <p className="">{formatTimestamp(row.metadata.lastModified)}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Stepper activeStep={Logs.length - 1} orientation="vertical">
                {Logs.length > 0 ? (
                  Logs.map((log, index) => (
                    <Step key={index}>
                      <StepLabel
                        icon={
                          <img
                            src={ReadIcon}
                            alt="read"
                            className="bg-indigo-300 rounded-full p-0.5"
                          />
                        }
                      >
                        <div>
                          <p className="text-sm tracking-wide space-x-1">
                            <strong>{log.username}</strong>{" "}
                            <span className="text-gray-600">
                              {log.event === "screenshot"
                                ? "Took Screenshot of"
                                : "accessed"}
                            </span>{" "}
                            <span className="text-indigo-500 ">file</span>
                            <span className="text-gray-400">
                              on {formatTimestamp(log.timestamp)}
                            </span>
                          </p>
                        </div>
                      </StepLabel>
                    </Step>
                  ))
                ) : (
                  <Step key={0}>
                    <StepLabel icon={<p>.</p>}>
                      <p className="text-center">No logs found!</p>
                    </StepLabel>
                  </Step>
                )}
              </Stepper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ProfileLogs;
