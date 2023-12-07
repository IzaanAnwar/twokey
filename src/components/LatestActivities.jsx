import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Checkmark from "../assets/checkmark.svg";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useDarkMode } from "../context/darkModeContext";
import { useLocation } from "react-router-dom";
// import { supabase } from "../helper/supabaseClient";
import Skeleton from "@mui/material/Skeleton";

import { createClient } from "@supabase/supabase-js";
// Initialize the Supabase client with your Supabase URL and API key
// export function supabaseAuth() {
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjN2ZzladWc1Y3lPbitFd20iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAyMDE1MzE5LCJpYXQiOjE3MDE5MjUzMjAsImlzcyI6Imh0dHBzOi8vZHhxcmttemFncmVlaXluY3Bsenguc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImQyYTA2NWUzLTQ3ODMtNDdkOS04YTQ5LWI2ZmY4NzBkNzA3NSIsImVtYWlsIjoib25seWZvcnNhdmUxQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoiYWthc2giLCJvcmdhbml6YXRpb24iOiJiY2MzODIxMC0yNTFiLTQwOTAtOGExMC1lMjE5NjVmY2VjNDgifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcwMTkyNTMyMH1dLCJzZXNzaW9uX2lkIjoiOGJmMWUyNTQtNjc4My00OTVlLWIwMzAtNGRmMzZkNmZlMDAyIn0.xt1VjCcdsT7xfYTIluyCEda5GHNSegQ0Hk1hVcUYkL4`,
      },
    },
  }
);

const LatestActivities = () => {
  const { darkMode } = useDarkMode();
  const [selectedValue, setSelectedValue] = useState("");
  const [logs, setLogs] = useState([]);
  const location = useLocation();
  const isUserProfile = location.pathname.includes("/profile");

  // useEffect(() => {
  //   const getCommonLogs = async () => {
  //     try {
  //       let token = JSON.parse(sessionStorage.getItem("token"));

  //       // Check if the user is on the profile

  //       // Use the appropriate URL based on the user's location
  //       const logsEndpoint = isUserProfile
  //         ? "https://twokeybackend.onrender.com/file/getLogs?global=0&recs=5"
  //         : "https://twokeybackend.onrender.com/file/getLogs/?recs=10";

  //       const accessLogs = await axios.get(logsEndpoint, {
  //         headers: {
  //           Authorization: `Bearer ${token.session.access_token}`,
  //         },
  //       });

  //       setLogs(accessLogs.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getCommonLogs();
  // }, []);

  useEffect(() => {
    const getCommonLogs = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));

        const logsEndpoint = isUserProfile
          ? "https://twokeybackend.onrender.com/file/getLogs?global=0&recs=5"
          : "https://twokeybackend.onrender.com/file/getLogs/?recs=10";

        const accessLogs = await axios.get(logsEndpoint, {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        });

        setLogs(accessLogs.data);
      } catch (error) {
        console.log(error);
      }
    };

    const channel = supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        console.log("Change received!", payload);
        // setLogs((prevLogs) => [payload.new, ...prevLogs]);
      })
      .subscribe();

    getCommonLogs();

    return () => {
      channel.unsubscribe();
    };
  }, [isUserProfile]); // Added isUserProfile to the dependency array

  const formatTimestamp = (timestamp) => {
    const options = {
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log("Selected Value:", value);
  };

  const skeletons = [];
  for (let i = 0; i < 4; i++) {
    skeletons.push(
      <div key={i} className="p-3 border-b rounded-lg flex items-center gap-2">
        <Skeleton
          key={i}
          variant="circular"
          width={24}
          height={24}
          className="mr-2"
        />

        <span className="w-full">
          <Skeleton className="w-3/5" height={20} />
          <Skeleton className="w-2/5" height={20} />
        </span>
      </div>
    );
  }

  return (
    <div className={`${isUserProfile ? "w-full" : "w-full md:w-2/5"}`}>
      <Paper elevation={isUserProfile ? 0 : 1} className="h-72 ">
        <div
          className={`flex justify-between items-center p-4 ${
            darkMode ? "bg-gray-600 text-gray-200" : " "
          }`}
        >
          <span className="flex flex-row items-center gap-1">
            <p className="text-sm font-semibold">Latest Activities</p>
            <select
              className="text-sm text-gray-400"
              onChange={handleSelectChange}
              value={selectedValue}
            >
              <option value="All">All</option>
              <option value="Requested">Requested</option>
              <option value="Access">Access</option>
            </select>
          </span>
        </div>

        <div className="h-56 overflow-y-scroll scrollbar-hide">
          {logs.length ? (
            logs?.map((log, index) => (
              <div key={index} className="border-b">
                <span className="flex flex-row gap-2 p-2">
                  <Tooltip title={log.user} arrow>
                    <Avatar
                      src={log.profile_pic}
                      alt="owner pic"
                      sx={{ width: 25, height: 25 }}
                    />
                  </Tooltip>
                  <span>
                    <p className="text-sm">
                      <span className="font-semibold">{log.username}</span>{" "}
                      {log.event === "screenshot"
                        ? "took Screenshot of"
                        : "accessed"}
                      <span className="font-semibold"> {log.file_name}</span>{" "}
                      file.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {formatTimestamp(log.timestamp)}
                    </p>
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="h-56 overflow-y-scroll scrollbar-hide">
              {skeletons}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default LatestActivities;

// service role key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cXJrbXphZ3JlZWl5bmNwbHp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NzQ1MDU2NiwiZXhwIjoyMDEzMDI2NTY2fQ.biLOfzpkrpp3zJ74xblbHwUJg1bziRwRzcUomcJKZo0"
