import { checkLoginStatus } from "./Functions/CheckLogin";
import { TaskAdder } from "./Functions/TaskFunctions";
import ISearch from "./interfaces/InterfaceSearch";
import ITask from "./interfaces/InterfaceTask";
import IUser from "./interfaces/InterfaceUser";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NavigationBar from "./NavigationBar";
import Row from "react-bootstrap/Row";
import Search from "./Search";
import Tasks from "./Tasks";
import { useNavigate } from "react-router-dom";

const initSearchProps: ISearch = {
  searchString: "",
  displayDone: true,
  strictSearch: false,
};

const Dashboard = ({
  userDetails,
  setUserDetails,
}: {
  userDetails: IUser;
  setUserDetails: React.Dispatch<React.SetStateAction<IUser>>;
}) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [searchProps, setSearchProps] = useState<ISearch>(initSearchProps);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortMethod, setSortMethod] = useState<"default" | "deadline" | "alphabetical">("default");
  const navigate = useNavigate();
  const welcomeMessages = [
    // prefix + username + postfix
    ["Hello ", "!"],
    ["Yo ", "!"],
    ["Hi ya ", "!"],
    ["Hey there, ", "!"],
    ["", ", welcome!"],
    ["Your tasks, ", "."],
    ["<username>", "</username>"],
    ["You're back, ", "!"],
  ];

  useEffect(() => {
    if (userDetails.username) {
      // randomise welcome message when username is detected
      const index = Math.floor(Math.random() * welcomeMessages.length);
      setWelcomeMessage(
        welcomeMessages[index][0] + userDetails.username + welcomeMessages[index][1]
      );
    }
  }, [userDetails]);

  const loadTasks = () => {
    // fetch tasks from database
    axios
      .get("https://jinwei-task-manager.herokuapp.com/tasks", { withCredentials: true })
      .then((response) => {
        if (response.status !== 200) {
          console.log("error");
        } else {
          setTasks(response.data.tasks);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!userDetails.loginStatus) {
      // if loginStatus is true, can assume is directed from login/signup
      checkLoginStatus(userDetails, setUserDetails, navigate);
    }
    // will throw error "Can't perform a React state update on an unmounted component."
    // but that's because we get re-directed out of /dashboard before loadTasks() can be completed
    loadTasks();
  }, []);

  return (
    <div>
      <NavigationBar {...{ userDetails, setUserDetails }} />
      <TaskAdder {...{ showAddModal, setShowAddModal, tasks, setTasks }} />
      <div className="m-5">
        <Row>
          <Col className="col-2"></Col>
          <Col>
            <h1>{welcomeMessage}</h1>
            <Search {...{ searchProps, setSearchProps }} />
          </Col>
          <Col>
            <DropdownButton className="float-end m-1" title={"Sorting by: " + sortMethod}>
              <Dropdown.Item onClick={() => setSortMethod("default")}>Default</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortMethod("deadline")}>Deadline</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortMethod("alphabetical")}>
                Alphabetical
              </Dropdown.Item>
            </DropdownButton>
            <Button className="float-end m-1" onClick={() => setShowAddModal(true)}>
              Add Task
            </Button>
          </Col>
          <Col className="col-2"></Col>
        </Row>
        <Tasks {...{ tasks, setTasks, searchProps, sortMethod }} />
      </div>
    </div>
  );
};

export default Dashboard;
