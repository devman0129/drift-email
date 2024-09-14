import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Inbox from "pages/Inbox";
import Login from "pages/Login";
import NewUser from "pages/NewUser";
import Home from "pages/Home";
import Settings from "pages/Settings";
import Users from "pages/Settings/Users";
import AuthRoute from "./AuthRoute";
import NotFound from "pages/NotFound";
import MyProfile from "pages/Settings/MyProfile";
import InboxConnection from "pages/Settings/InboxConnection";
import Types from "pages/Settings/Types";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/newUser",
    element: <NewUser />,
    children: [{ path: "*", element: <NewUser /> }],
  },
  {
    path: "/",
    element: (
      <AuthRoute role={[0, 1, 2]}>
        <Home />
      </AuthRoute>
    ),
    children: [
      {
        path: "/",
        element: <Inbox />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "skills",
        element: <Inbox />,
      },
      {
        path: "user",
        element: <Inbox />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "",
            element: <MyProfile />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "inboxConnection",
            element: <InboxConnection />,
          },
          {
            path: "types",
            element: <Types />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
