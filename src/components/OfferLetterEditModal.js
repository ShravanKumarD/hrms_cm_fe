import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const OfferLetterEditModal = ({ data, onHide, onSuccess, ...props }) => {
  const [offerLetter, setOfferLetter] = useState({
    userId: null,
    full_name: "",
    recipient_place: "",
    role: "",
    department: "",
    salary: "",
    start_date: null,
    end_date: null,
    location: "",
    work_schedule: "",
    company_name: "",
    sender_name: "",
    sender_title: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (data) {
      setOfferLetter({
        id: data.id,
        userId: data.userId,
        full_name: data.full_name,
        recipient_place: data.recipient_place,
        role: data.role,
        department: data.department,
        salary: data.salary,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : null,
        location: data.location,
        work_schedule: data.work_schedule,
        company_name: data.company_name,
        sender_name: data.sender_name,
        sender_title: data.sender_title,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferLetter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/offerLetters/${offerLetter.id}`,
        offerLetter,
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
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Offer Letter
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Offer letter updated successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="warning" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFullName">
            <Form.Label className="mb-2 required">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={offerLetter.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRecipientPlace">
            <Form.Label className="mb-2 required">Recipient Place</Form.Label>
            <Form.Control
              type="text"
              name="recipient_place"
              value={offerLetter.recipient_place}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label className="mb-2 required">Role</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={offerLetter.role}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDepartment">
            <Form.Label className="mb-2 required">Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={offerLetter.department}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSalary">
            <Form.Label className="mb-2 required">Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={offerLetter.salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formStartDate">
            <Form.Label className="mb-2 required">Start Date</Form.Label>
            <DatePicker
              selected={offerLetter.start_date}
              onChange={(date) =>
                setOfferLetter((prev) => ({ ...prev, start_date: date }))
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label className="mb-2">End Date</Form.Label>
            <DatePicker
              selected={offerLetter.end_date}
              onChange={(date) =>
                setOfferLetter((prev) => ({ ...prev, end_date: date }))
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label className="mb-2 required">Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={offerLetter.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formWorkSchedule">
            <Form.Label className="mb-2 required">Work Schedule</Form.Label>
            <Form.Control
              type="text"
              name="work_schedule"
              value={offerLetter.work_schedule}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCompanyName">
            <Form.Label className="mb-2 required">Company Name</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={offerLetter.company_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSenderName">
            <Form.Label className="mb-2 required">Sender Name</Form.Label>
            <Form.Control
              type="text"
              name="sender_name"
              value={offerLetter.sender_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSenderTitle">
            <Form.Label className="mb-2 required">Sender Title</Form.Label>
            <Form.Control
              type="text"
              name="sender_title"
              value={offerLetter.sender_title}
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

export default OfferLetterEditModal;
