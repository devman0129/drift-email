import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SettingsNavItem from "./SettingsNavItem";
import "./Settings.scss";

const Settings = () => {
  const location = useLocation();
  const urls = location.pathname;
  const sliceNumber = urls.indexOf("s", 2) + 1;
  const url = urls.slice(sliceNumber);

  const activeStatus = useMemo(() => {
    return {
      myProfile: url === "",
      inboxConnection: url === "/inboxConnection",
      users: url === "/users",
      types: url === "/types",
    };
  }, [url]);

  return (
    <div className="settings-layout-container">
      <div className="settings-inner-container">
        <div className="w-full flex">
          <div className="settings-page-heading w-1/2 pr-4">Settings</div>
          <div className="w-1/2"></div>
        </div>
        <div className="setting-nav w-full flex gap-4">
          <div className="w-1/4">
            <div className="pr-4">
              <SettingsNavItem
                text="My Profile"
                keys={"myProfile"}
                active={activeStatus.myProfile}
                link={""}
              ></SettingsNavItem>
              <SettingsNavItem
                text="Inbox Connections"
                keys={"inboxConnection"}
                active={activeStatus.inboxConnection}
                link={"inboxConnection"}
              ></SettingsNavItem>
              <SettingsNavItem
                text="Users"
                keys={"users"}
                active={activeStatus.users}
                link={"users"}
              ></SettingsNavItem>
              <SettingsNavItem
                text="Types"
                keys={"types"}
                active={activeStatus.types}
                link={"types"}
              ></SettingsNavItem>
            </div>
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
