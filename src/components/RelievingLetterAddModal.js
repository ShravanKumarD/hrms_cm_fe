import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const RelievingLetterAdd = (props) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    date: null,
    employee_name: "",
    employee_address: "",
    employee_id: "",
    position: "",
    department: "",
    date_of_joining: null,
    date_of_relieving: null,
    hr_name: "",
    company_name: "",
  });
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
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: date
    }));
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
    console.log("Form submitted, preparing relieving letter...");

    try {
      axios.defaults.baseURL = API_BASE_URL;
      await axios.post("/api/relievingLetters", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDone(true);
      props.onAddSuccess(); // Call this to refresh the list in the parent component
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Relieving Letter
        </Modal.Title>
      </Modal.Header>
      {showAlert && (
        <Alert variant="warning" className="m-1">
          {errorMsg}
        </Alert>
      )}
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label className="mb-2 required">Select Employee</Form.Label>
            <Form.Control
              as="select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Choose one...</option>
              {pushUsers()}
            </Form.Control>
          </Form.Group>
          {done && <Redirect to="/relieving-letter-list" />}
          <Form.Group>
            <Form.Label className="mb-2 required">Date</Form.Label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => handleDateChange(date, "date")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Date"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Employee Name</Form.Label>
            <Form.Control
              type="text"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Employee Address</Form.Label>
            <Form.Control
              type="text"
              name="employee_address"
              value={formData.employee_address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Date of Joining</Form.Label>
            <DatePicker
              selected={formData.date_of_joining}
              onChange={(date) => handleDateChange(date, "date_of_joining")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Date of Joining"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Date of Relieving</Form.Label>
            <DatePicker
              selected={formData.date_of_relieving}
              onChange={(date) => handleDateChange(date, "date_of_relieving")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Date of Relieving"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">HR Name</Form.Label>
            <Form.Control
              type="text"
              name="hr_name"
              value={formData.hr_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Company Name</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
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

export default RelievingLetterAdd;