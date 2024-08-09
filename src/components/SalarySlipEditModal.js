import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const SalarySlipEditModal = ({ show, onHide, data }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    userId: null,
    address: "",
    designation: "",
    month: "",
    date_of_joining: null,
    basic_salary: 0,
    hra: 0,
    conveyance_allowance: 0,
    special_allowance: 0,
    medical_allowance: 0,
    total_earnings: 0,
    tds: 0,
    professional_tax: 0,
    employee_pf: 0,
    other_deductions: 0,
    total_deductions: 0,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        name: data.name,
        userId: data.userId,
        address: data.address,
        designation: data.designation,
        month: data.month,
        date_of_joining: new Date(data.date_of_joining),
        basic_salary: data.basic_salary,
        hra: data.hra,
        conveyance_allowance: data.conveyance_allowance,
        special_allowance: data.special_allowance,
        medical_allowance: data.medical_allowance,
        total_earnings: data.total_earnings,
        tds: data.tds,
        professional_tax: data.professional_tax,
        employee_pf: data.employee_pf,
        other_deductions: data.other_deductions,
        total_deductions: data.total_deductions,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "put",
      url: `/api/salary-slips/${formData.id}`,
      data: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        setDone(true);
      })
      .catch((err) => {
        setShowAlert(true);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Salary Slip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {done && (
            <Alert variant="success">Salary Slip updated successfully!</Alert>
          )}
          {showAlert && <Alert variant="warning">{errorMessage}</Alert>}
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUserId">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDesignation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMonth">
            <Form.Label>Month</Form.Label>
            <Form.Control
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfJoining">
            <Form.Label>Date of Joining</Form.Label>
            <DatePicker
              selected={formData.date_of_joining}
              onChange={(date) =>
                setFormData({ ...formData, date_of_joining: date })
              }
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicSalary">
            <Form.Label>Basic Salary</Form.Label>
            <Form.Control
              type="number"
              name="basic_salary"
              value={formData.basic_salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHRA">
            <Form.Label>HRA</Form.Label>
            <Form.Control
              type="number"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConveyanceAllowance">
            <Form.Label>Conveyance Allowance</Form.Label>
            <Form.Control
              type="number"
              name="conveyance_allowance"
              value={formData.conveyance_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSpecialAllowance">
            <Form.Label>Special Allowance</Form.Label>
            <Form.Control
              type="number"
              name="special_allowance"
              value={formData.special_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMedicalAllowance">
            <Form.Label>Medical Allowance</Form.Label>
            <Form.Control
              type="number"
              name="medical_allowance"
              value={formData.medical_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalEarnings">
            <Form.Label>Total Earnings</Form.Label>
            <Form.Control
              type="number"
              name="total_earnings"
              value={formData.total_earnings}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTDS">
            <Form.Label>TDS</Form.Label>
            <Form.Control
              type="number"
              name="tds"
              value={formData.tds}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProfessionalTax">
            <Form.Label>Professional Tax</Form.Label>
            <Form.Control
              type="number"
              name="professional_tax"
              value={formData.professional_tax}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeePF">
            <Form.Label>Employee PF</Form.Label>
            <Form.Control
              type="number"
              name="employee_pf"
              value={formData.employee_pf}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOtherDeductions">
            <Form.Label>Other Deductions</Form.Label>
            <Form.Control
              type="number"
              name="other_deductions"
              value={formData.other_deductions}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalDeductions">
            <Form.Label>Total Deductions</Form.Label>
            <Form.Control
              type="number"
              name="total_deductions"
              value={formData.total_deductions}
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
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalarySlipEditModal;
