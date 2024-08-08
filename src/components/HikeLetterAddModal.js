import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const HikeLetterAdd = (props) => {
  const [date, setDate] = useState(null);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [previousSalary, setPreviousSalary] = useState("");
  const [hrName, setHrName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
      console.log(res.data, "users");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    console.log(`Handling change for ${name}: ${value}`);
    switch (name) {
      case "name":
        setName(value);
        break;
      case "place":
        setPlace(value);
        break;
      case "new_salary":
        setNewSalary(value);
        break;
      case "previous_salary":
        setPreviousSalary(value);
        break;
      case "hr_name":
        setHrName(value);
        break;
      default:
        break;
    }
  };

  const onUserChange = (event) => {
    console.log(`User selected: ${event.target.value}`);
    setSelectedUser(event.target.value);
  };

  const pushUsers = () => {
    console.log("Mapping users to options...");
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.fullName}
      </option>
    ));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, preparing hike letter...");

    const hikeLetter = {
      userId: selectedUser,
      date,
      name,
      place,
      effective_date: effectiveDate,
      new_salary: newSalary,
      previous_salary: previousSalary,
      hr_name: hrName,
    };

    try {
      axios.defaults.baseURL = API_BASE_URL;
      await axios.post("/api/hikeLetters", hikeLetter, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDone(true);
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Hike Letter
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label className="mb-2 required">Select Employee</Form.Label>
            <Form.Control
              as="select"
              className="form-control"
              value={selectedUser || ""}
              onChange={onUserChange}
              required
            >
              <option value="">Choose one...</option>
              {pushUsers()}
            </Form.Control>
          </Form.Group>
          {done && <Redirect to="/hike-letter-list" />}
          {showAlert && (
            <Alert variant="warning" className="m-1">
              {errorMsg}
            </Alert>
          )}
          <Form.Group controlId="formDate">
            <Form.Label className="mb-2 required">Date</Form.Label>
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Date"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label className="mb-2 required">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPlace">
            <Form.Label className="mb-2 required">Place</Form.Label>
            <Form.Control
              type="text"
              name="place"
              value={place}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEffectiveDate">
            <Form.Label className="mb-2 required">Effective Date</Form.Label>
            <DatePicker
              selected={effectiveDate}
              onChange={setEffectiveDate}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Effective Date"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formNewSalary">
            <Form.Label className="mb-2 required">New Salary</Form.Label>
            <Form.Control
              type="text"
              name="new_salary"
              value={newSalary}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPreviousSalary">
            <Form.Label className="mb-2 required">Previous Salary</Form.Label>
            <Form.Control
              type="text"
              name="previous_salary"
              value={previousSalary}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group controlId="formHrName">
            <Form.Label className="mb-2 required">HR Name</Form.Label>
            <Form.Control
              type="text"
              name="hr_name"
              value={hrName}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HikeLetterAdd;
