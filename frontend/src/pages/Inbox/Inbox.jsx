import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners";
import MailBoxList from "./MailBoxList";
import PageHeading from "./PageHeading";
import MailBoxDetail from "./MailBoxDetail";
import PageFilter from "./PageFilter";
import "./Inbox.scss";

const Inbox = () => {
  const [spinState, setSpinState] = useState(true);
  const isLoading = useSelector((state) => state.mail.isLoading);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setSpinState(isLoading);
  }, [isLoading]);

  return (
    <>
      {spinState ? (
        <div className="spinner-background">
          <p className="loading-text">Loading...</p>
          <BarLoader color="#ffc825" loading size={20} speedMultiplier={1} />
        </div>
      ) : (
        <div className="inbox-layout-container">
          <div className="inbox-inner-container">
            <PageHeading />
            <PageFilter filter={filter} setFilter={setFilter} />
            <div className="inbox-content flex">
              <MailBoxList filter={filter} />
              <MailBoxDetail />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inbox;
