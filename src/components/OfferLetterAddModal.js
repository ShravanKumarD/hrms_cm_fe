import React, { useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const OfferLetterAddModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: 1,
    full_name: "",
    recipient_place: "",
    role: "",
    department: "",
    salary: "",
    start_date: "",
    end_date: "",
    location: "Hyderabad",
    work_schedule: "9:30 am to 6:30 pm, Monday to Friday",
    company_name: "CreditMitra",
    sender_name: "Murthy Balaji",
    sender_title: "Co Founder",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/offerLetters`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Error adding offer letter:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Offer Letter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formRecipientPlace">
              <Form.Label>Recipient Place</Form.Label>
              <Form.Control
                type="text"
                name="recipient_place"
                value={formData.recipient_place}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formSalary">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formEndDate">
              <Form.Label>End Date (if applicable)</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formWorkSchedule">
            <Form.Label>Work Schedule</Form.Label>
            <Form.Control
              type="text"
              name="work_schedule"
              value={formData.work_schedule}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} md="4" controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formSenderName">
              <Form.Label>Sender Name</Form.Label>
              <Form.Control
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formSenderTitle">
              <Form.Label>Sender Title</Form.Label>
              <Form.Control
                type="text"
                name="sender_title"
                value={formData.sender_title}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Row>

          <Button variant="primary" type="submit">
            Add Offer Letter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OfferLetterAddModal;
