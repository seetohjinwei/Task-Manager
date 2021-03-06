import {
  fetchChangePassword,
  fetchChangeTheme,
  fetchSearchOptions,
  fetchTheme,
  themes,
} from "./Functions/Fetch";
import { toTitleCase } from "./Functions/Misc";
import IUser, { sort_methods } from "./interfaces/InterfaceUser";
import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";

/** Settings Form within /settings */
const SettingsForm = ({
  userDetails,
  setUserDetails,
}: {
  userDetails: IUser;
  setUserDetails: React.Dispatch<React.SetStateAction<IUser>>;
}) => {
  const [optionsForm, setOptionsForm] = useState({
    display_done: userDetails.display_done,
    strict_search: userDetails.strict_search,
    sort_method: userDetails.sort_method,
    theme: fetchTheme(),
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");

  /** Handles search options change. */
  const handleOptionsChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setOptionsForm({ ...optionsForm, [event.target.name]: event.target.checked });
  };
  /** Handles sort method change. */
  const handleSortMethodChange = (method: IUser["sort_method"]) => {
    setOptionsForm({ ...optionsForm, sort_method: method });
  };
  const handleThemeChange = (theme: string) => {
    setOptionsForm({ ...optionsForm, theme: theme });
  };
  /** Handles password form change. */
  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };
  /** Handles options form submission. */
  const handleOptionsSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    fetchSearchOptions(
      {
        display_done: optionsForm.display_done,
        strict_search: optionsForm.strict_search,
        sort_method: optionsForm.sort_method,
      },
      (response) => {
        setUserDetails({ ...userDetails, ...optionsForm });
        setMessage("Changed Successfully!");
      },
      (error) => {
        setMessage("Something went wrong... You may want to try again in a bit.");
        console.log(error);
      }
    );
    fetchChangeTheme(optionsForm.theme);
  };
  /** Handles password form submission. */
  const handlePasswordSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      setMessage("Passwords do not match!");
    } else {
      fetchChangePassword(
        {
          username: userDetails.username,
          old_password: passwordForm.old_password,
          password: passwordForm.password,
          password_confirmation: passwordForm.password_confirmation,
        },
        (response) => {
          setMessage("Changed Successfully!");
        },
        (error) => {
          setMessage("Wrong Password!");
          console.log(error);
        }
      );
    }
  };
  return (
    <div>
      {/* Forms render side-by-side unless screen is small. */}
      <div className="center-wrap">
        <Form className="my-3" onSubmit={handleOptionsSubmit}>
          <Form.Group className="my-3">
            <h2>Change Default Options</h2>
            <DropdownButton
              variant="outline-secondary"
              className="my-2"
              title={"Sorting by: " + optionsForm.sort_method}
            >
              {sort_methods.map((sort_type, index) => {
                return (
                  <Dropdown.Item key={index} onClick={() => handleSortMethodChange(sort_type)}>
                    {toTitleCase(sort_type)}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <DropdownButton
              variant="outline-secondary"
              className="my-2"
              title={"Theme: " + optionsForm.theme}
            >
              {themes.map((theme, index) => {
                return (
                  <Dropdown.Item key={index} onClick={() => handleThemeChange(theme)}>
                    {toTitleCase(theme)}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <Form.Check
              type="switch"
              label="Show Finished Tasks"
              name="display_done"
              checked={optionsForm.display_done}
              onChange={handleOptionsChange}
            />
            <Form.Check
              type="switch"
              label="Match All Search Terms"
              name="strict_search"
              checked={optionsForm.strict_search}
              onChange={handleOptionsChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
        <Form className="my-3" onSubmit={handlePasswordSubmit}>
          <h2>Change Account Password</h2>
          <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              name="old_password"
              placeholder="Old Password"
              value={passwordForm.old_password}
              onChange={handlePasswordChange}
              minLength={6}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="New Password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              minLength={6}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="password_confirmation"
              placeholder="Confirm New Password"
              value={passwordForm.password_confirmation}
              onChange={handlePasswordChange}
              minLength={6}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </div>
      <div className="center mt-3">
        {message && (
          <Alert variant="warning" onClose={() => setMessage("")} dismissible>
            {message}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SettingsForm;
