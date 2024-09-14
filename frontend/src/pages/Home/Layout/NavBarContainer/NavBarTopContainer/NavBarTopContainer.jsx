import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import InboxImg from "assets/img/inbox-full.svg";
import LightInboxImg from "assets/img/inbox-full-light.svg";
// import TypesImg from "assets/img/types.svg";
// import LightTypesImg from "assets/img/types-light.svg";
import UserImg from "assets/img/users.svg";
import LightUserImg from "assets/img/users-light.svg";
import LogoImage from "assets/img/Icon.png";

import NavItem from "./NavItem";
import "./NavBarTopContainer.scss";

const NavBarTopContainer = () => {
  const location = useLocation();
  const urls = location.pathname;
  const url = urls.slice(urls.indexOf("/") + 1);

  const activeStatus = useMemo(() => {
    return {
      inbox: url === "inbox",
      types: url === "skills",
      user: url === "user",
    };
  }, [url]);

  return (
    <div className="NavBarTopContainer">
      <div className="logo-icon flex items-center">
        <img src={LogoImage} alt={"logo"} />
      </div>
      <NavItem
        keys={"inbox"}
        toolTipName={"Inbox"}
        ImgSrc={activeStatus.inbox ? InboxImg : LightInboxImg}
        active={activeStatus.inbox}
        ImgAlt={"inbox"}
        link={"/inbox"}
        width={"32px"}
      />
      <NavItem
        keys={"user"}
        toolTipName={"user"}
        ImgSrc={activeStatus.user ? UserImg : LightUserImg}
        active={activeStatus.user}
        ImgAlt={"user"}
        link={"/user"}
        width={"34px"}
      />
      {/* <NavItem
        keys={"types"}
        toolTipName={"types"}
        ImgSrc={activeStatus.types ? TypesImg : LightTypesImg}
        active={activeStatus.types}
        ImgAlt={"types"}
        link={"/types"}
      /> */}
    </div>
  );
};

export default NavBarTopContainer;
