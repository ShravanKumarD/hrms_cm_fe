import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const RelievingLetterEditModal = ({ data, onHide, onSuccess, ...props }) => {
  const [relievingLetter, setRelievingLetter] = useState({
    id: null,
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
    setRelievingLetter({
      id: data.id,
      date: new Date(data.date),
      employee_name: data.employee_name,
      employee_address: data.employee_address,
      employee_id: data.employee_id,
      position: data.position,
      department: data.department,
      date_of_joining: new Date(data.date_of_joining),
      date_of_relieving: new Date(data.date_of_relieving),
      hr_name: data.hr_name,
      company_name: data.company_name,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRelievingLetter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setRelievingLetter((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/relievingLetters/${relievingLetter.id}`,
        relievingLetter,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDone(true);
      if (onSuccess) {
        onSuccess(); // Callback to handle success
      }
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Modal
      {...props}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Relieving Letter
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Relieving letter updated successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="warning" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDate">
            <Form.Label className="mb-2 required">Date</Form.Label>
            <DatePicker
              selected={relievingLetter.date}
              onChange={(date) => handleDateChange(date, "date")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeeName">
            <Form.Label className="mb-2 required">Employee Name</Form.Label>
            <Form.Control
              type="text"
              name="employee_name"
              value={relievingLetter.employee_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeeAddress">
            <Form.Label className="mb-2 required">Employee Address</Form.Label>
            <Form.Control
              type="text"
              name="employee_address"
              value={relievingLetter.employee_address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeeId">
            <Form.Label className="mb-2 required">Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="employee_id"
              value={relievingLetter.employee_id}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPosition">
            <Form.Label className="mb-2 required">Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={relievingLetter.position}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDepartment">
            <Form.Label className="mb-2 required">Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={relievingLetter.department}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfJoining">
            <Form.Label className="mb-2 required">Date of Joining</Form.Label>
            <DatePicker
              selected={relievingLetter.date_of_joining}
              onChange={(date) => handleDateChange(date, "date_of_joining")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfRelieving">
            <Form.Label className="mb-2 required">Date of Relieving</Form.Label>
            <DatePicker
              selected={relievingLetter.date_of_relieving}
              onChange={(date) => handleDateChange(date, "date_of_relieving")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formHRName">
            <Form.Label className="mb-2 required">HR Name</Form.Label>
            <Form.Control
              type="text"
              name="hr_name"
              value={relievingLetter.hr_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCompanyName">
            <Form.Label className="mb-2 required">Company Name</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={relievingLetter.company_name}
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
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RelievingLetterEditModal;