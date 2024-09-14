import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { isEmpty } from "utils";

const AuthRoute = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const curRole = localStorage.getItem('role');

  useEffect(() => {
    if (isEmpty(token)) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div>{props.children}</div>;
};

export default AuthRoute;
