import { checkLoginStatus } from "./Functions/CheckLogin";
import IUser from "./interfaces/InterfaceUser";
import NavigationBar from "./NavigationBar";
import SettingsForm from "./SettingsForm";
import React, { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

/** Page for /settings */
const Settings = ({
  userDetails,
  setUserDetails,
}: {
  userDetails: IUser;
  setUserDetails: React.Dispatch<React.SetStateAction<IUser>>;
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!userDetails.login_status) {
      // loginStatus is true means that user was re-directed here, as opposed to navigating from URL manually.
      checkLoginStatus(userDetails, setUserDetails, navigate, "/settings");
    }
  }, []);

  return (
    <div>
      <NavigationBar {...{ userDetails, setUserDetails }}></NavigationBar>
      <div className="m-5">
        <Row>
          <Col className="col-2"></Col>
          <Col>
            <h1>{"Settings for " + userDetails.username}</h1>
            <SettingsForm {...{ userDetails, setUserDetails }}></SettingsForm>
          </Col>
          <Col className="col-2"></Col>
        </Row>
      </div>
    </div>
  );
};

export default Settings;
