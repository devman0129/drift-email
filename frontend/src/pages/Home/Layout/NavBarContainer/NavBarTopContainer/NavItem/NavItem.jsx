import React from "react";
import Tooltip from "@mui/material/Tooltip";
import classNames from "classnames";
import Img from "components/Base/Img";
import "./NavItem.scss";

const NavItem = (props) => {
  return (
    <Tooltip
      title={props.toolTipName}
      arrow
      placement="right"
      sx={{
        maxWidth: 600,
        minHeight: 300,
        backgroundColor: "#465259",
        fontSize: "20px",
      }}
    >
      <a
        href={props.link}
        className={props.active ? classNames("nav-item", "active") : "nav-item"}
      >
        <Img src={props.ImgSrc} alt={props.ImgAlt} width={props.width} />
      </a>
    </Tooltip>
  );
};

export default NavItem;
