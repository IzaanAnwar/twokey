import React, { useState, useEffect } from "react";
import FileViewer from "./FileViewer";
import FileDetails from "./FileDetails";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useAuth } from "../context/authContext";
import axios from "axios";

const FileView = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const { screenshotDetected, screenshotAlert } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [preUrl, setPreUrl] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(true);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    closeDrawer();
  };

  useEffect(() => {
    if (screenshotDetected) {
      screenshotAlert(fileInfo.id);
    }
  }, [screenshotDetected, fileInfo.id, screenshotAlert]);

  useEffect(() => {
    openDialog();
  }, []);

  useEffect(() => {
    const getPresignedUrl = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));

        const body = {
          latitude: 18.44623721673684,
          longitude: 73.82762833796289,
        };
        const presignedUrl = await axios.post(
          `https://twokeybackend.onrender.com/file/getPresigned/${fileInfo.id}/`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("presignedUrl:", presignedUrl.data.signed_url);
        setPreUrl(presignedUrl.data.signed_url);
        setLoadingUrl(false);
      } catch (error) {
        console.log("Error while getPresignedUrl", error);
        setLoadingUrl(false);
      }
    };

    getPresignedUrl();
  }, [fileInfo.id]);

  return (
    <div className="">
      <Dialog open={isOpen} onClose={closeDialog} fullScreen>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        >
          <div className={`flex ${screenshotDetected ? "blur" : ""}`}>
            <div className="w-4/5">
              {loadingUrl ? (
                <div className="text-center pt-20">Fetching URL...</div>
              ) : preUrl.length ? (
                <FileViewer preUrl={preUrl} />
              ) : (
                <div className="text-center pt-20">
                  You do not have access to the file.
                </div>
              )}
            </div>
            <div className="w-1/5">
              <FileDetails
                fileInfo={fileInfo}
                sharedFileInfo={sharedFileInfo}
                closeDrawer={closeDrawer}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
