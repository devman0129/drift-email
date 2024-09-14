import { configureStore } from "@reduxjs/toolkit";

import mailReducer from "./Mail/mailSlice";
import userReducer from "./User/userSlice";
import authReducer from "./Auth/authSlice";
import accountReducer from "./Account/accountSlice";
import typeReducer from "./Type/typeSlice";

export const store = configureStore({
  reducer: {
    mail: mailReducer,
    user: userReducer,
    auth: authReducer,
    account: accountReducer,
    type: typeReducer,
  },
});
