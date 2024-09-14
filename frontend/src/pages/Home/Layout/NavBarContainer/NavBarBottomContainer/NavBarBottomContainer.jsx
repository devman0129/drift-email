import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, Popover } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import jwt_decode from "jwt-decode";
import UserProfileImg from "assets/img/user-profile.svg";
import Setting from "assets/img/settings-deactive.svg";
import SettingActive from "assets/img/settings-active.svg";
import { isEmpty } from "utils";
import "./NavBarBottomContainer.scss";

const NavBarBottomContainer = () => {
  const [logoutState, setLogoutState] = useState(false);
  const [payload, setPayload] = useState("");

  const location = useLocation();
  const urls = location.pathname;
  const url = urls.slice(urls.indexOf("/") + 1);
  useEffect(() => {
    if (!isEmpty(localStorage.getItem("token"))) {
      setPayload(jwt_decode(localStorage.getItem("token")));
    }
  }, []);

  const activeStatus = useMemo(() => {
    return {
      setting: url === "settings",
    };
  }, [url]);

  const logout = () => {
    localStorage.clear();
  };

  const onPopoverChange = () => {
    setLogoutState(!logoutState);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    console.log(name);
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name[0]}`,
    };
  }

  return (
    <div className="NavBarSettingContainer">
      <Tooltip
        title={"Settings"}
        arrow
        placement="right"
        sx={{
          maxWidth: 600,
          minHeight: 300,
          backgroundColor: "#465259",
          fontSize: "20px",
        }}
      >
        <a href="/settings" className="NavSettingsItem">
          {activeStatus.setting ? (
            <img
              src={SettingActive}
              alt="setting"
              style={{ maxWidth: "24px" }}
            />
          ) : (
            <img src={Setting} alt="setting" style={{ maxWidth: "24px" }} />
          )}
        </a>
      </Tooltip>
      {!isEmpty(payload?.picture) ? (
        <img
          className="avatar"
          onClick={onPopoverChange}
          src={payload.picture}
          alt="profile"
        />
      ) : payload.name ? (
        <Avatar
          className="avatar"
          onClick={onPopoverChange}
          {...stringAvatar(payload.name)}
        />
      ) : (
        <></>
      )}
      <Popover
        open={logoutState}
        onClose={onPopoverChange}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 1000, left: 60 }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          boxShadow:
            "0 3px 6px rgb(53 63 69 / 10%), 0 10px 20px rgb(53 63 69 / 15%);",
        }}
      >
        <div className="popover-content">
          <div className="popover-content-username">{payload.name}</div>
          <div className="popover-content-account">Cypress Learning</div>
          <div className="popover-content-email">{payload.email}</div>
          <Link
            className="popover-content-signout"
            to="/login"
            onClick={logout}
          >
            Sign out
          </Link>
        </div>
      </Popover>
    </div>
  );
};

export default NavBarBottomContainer;
