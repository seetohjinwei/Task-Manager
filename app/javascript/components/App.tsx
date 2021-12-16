import IUser from "./interfaces/InterfaceUser";
import Access from "./auth/Access";
import Dashboard from "./Dashboard";
import axios from "axios";
import React, { useEffect, useState } from "react";

// main application page

const initUser: IUser = {
  loginStatus: false,
  username: "",
  password: "",
  password_confirmation: "",
  authenticationErrors: "",
};

const App = () => {
  const checkLoginStatus = () => {
    axios
      .get("http://localhost:3000/logged_in", { withCredentials: true })
      .then((response) => {
        if (response.data.logged_in) {
          // is logged in
          setUserDetails({
            ...userDetails,
            loginStatus: true,
            username: response.data.user.username,
          });
        } else {
          // not logged in
          setUserDetails({
            ...userDetails,
            loginStatus: false,
            username: "",
            password: "",
            password_confirmation: "",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(checkLoginStatus, []);

  const [userDetails, setUserDetails] = useState(initUser);
  if (userDetails.loginStatus) {
    return <Dashboard {...{ userDetails, setUserDetails }} />;
  } else {
    return <Access {...{ userDetails, setUserDetails }} />;
  }
};

export default App;
