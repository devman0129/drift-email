import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { refreshNewEmail } from "redux/Mail/mailSlice";
import "./PageHeading.scss";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";

const PageHeading = () => {
  const dispatch = useDispatch();
  const [loadingEmails, setLoadingEmails] = useState(false);

  const mailTotalCount = useSelector((state) => state.mail.mailTotalCount);
  const fetchMailLoadingState = useSelector(
    (state) => state.mail.mailFetchLoading
  );

  const refreshDB = () => {
    dispatch(refreshNewEmail());
  };

  useEffect(() => {
    setLoadingEmails(fetchMailLoadingState);
  }, [fetchMailLoadingState]);

  return (
    <div className="flex justify-between inbox-page-heading">
      <div className="head-text-left">
        <div>{`Emails: (${mailTotalCount ?? 0})`}</div>
      </div>
      <div className="head-text-right flex gap-2">
        {loadingEmails ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            sx={{
              textTransform: "none",
            }}
          >
            Loading
          </LoadingButton>
        ) : (
          <Button
            variant="outlined"
            className="inbox-refresh"
            onClick={refreshDB}
          >
            <span className="icon-cw" />
            Refresh
          </Button>
        )}
        <Button
          variant="contained"
          className="inbox-export"
          sx={{
            px: 4,
          }}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default PageHeading;
