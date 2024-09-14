import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-body">
      <Layout />
      <Outlet />
    </div>
  );
};

export default Home;
