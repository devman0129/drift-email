import React from "react";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="-mt-[200px]">
        <p
          className="zoom-area"
          style={{ color: "antiquewhite", fontSize: "22px" }}
        >
          <b>Ooops,</b> Looks like you got lost.
          <br /> Go back to the homepage!
          <br />
          `(currently this page not made yet!)`
        </p>
        <section className="error-container">
          <span className="four">
            <span className="screen-reader-text">4</span>
          </span>
          <span className="zero">
            <span className="screen-reader-text">0</span>
          </span>
          <span className="four">
            <span className="screen-reader-text">4</span>
          </span>
        </section>
        <div className="link-container flex items-center justify-center">
          <a href="/inbox" className="more-link justify-center items-center">
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
