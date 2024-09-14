import React from "react";
import { ToastContainer } from "react-toastify";

import "./Layout.scss";

import NavBarContainer from "./NavBarContainer";
// import NotificationBar from "./NotificationBar";

const Layout = () => {
  return (
    <div className="home-body-inner-layout">
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
      {/* <NotificationBar /> */}
      <NavBarContainer />
    </div>
  );
};

export default Layout;
