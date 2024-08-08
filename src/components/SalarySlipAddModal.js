import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const SalarySlipAddModal = ({ show, onHide, onAddSuccess, ...props }) => {
  const [salarySlip, setSalarySlip] = useState({
    name: "",
    userId: "",
    address: "",
    designation: "",
    month: "",
    date_of_joining: new Date(),
    basic_salary: "",
    hra: "",
    conveyance_allowance: "",
    special_allowance: "",
    medical_allowance: "",
    total_earnings: "",
    tds: "",
    professional_tax: "",
    employee_pf: "",
    other_deductions: "",
    total_deductions: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalarySlip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setSalarySlip((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/salary-slip`, salarySlip, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDone(true);
      if (onAddSuccess) {
        onAddSuccess(); // Callback to handle success
      }
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Salary Slip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Salary slip added successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="danger" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label className="mb-2 required">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={salarySlip.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUserId">
            <Form.Label className="mb-2 required">User ID</Form.Label>
            <Form.Control
              type="text"
              name="userId"
              value={salarySlip.userId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label className="mb-2 required">Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={salarySlip.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDesignation">
            <Form.Label className="mb-2 required">Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={salarySlip.designation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMonth">
            <Form.Label className="mb-2 required">Month</Form.Label>
            <Form.Control
              type="text"
              name="month"
              value={salarySlip.month}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfJoining">
            <Form.Label className="mb-2 required">Date of Joining</Form.Label>
            <DatePicker
              selected={salarySlip.date_of_joining}
              onChange={(date) => handleDateChange(date, "date_of_joining")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicSalary">
            <Form.Label className="mb-2 required">Basic Salary</Form.Label>
            <Form.Control
              type="text"
              name="basic_salary"
              value={salarySlip.basic_salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHra">
            <Form.Label className="mb-2 required">HRA</Form.Label>
            <Form.Control
              type="text"
              name="hra"
              value={salarySlip.hra}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConveyanceAllowance">
            <Form.Label className="mb-2 required">
              Conveyance Allowance
            </Form.Label>
            <Form.Control
              type="text"
              name="conveyance_allowance"
              value={salarySlip.conveyance_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSpecialAllowance">
            <Form.Label className="mb-2 required">Special Allowance</Form.Label>
            <Form.Control
              type="text"
              name="special_allowance"
              value={salarySlip.special_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMedicalAllowance">
            <Form.Label className="mb-2 required">Medical Allowance</Form.Label>
            <Form.Control
              type="text"
              name="medical_allowance"
              value={salarySlip.medical_allowance}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalEarnings">
            <Form.Label className="mb-2 required">Total Earnings</Form.Label>
            <Form.Control
              type="text"
              name="total_earnings"
              value={salarySlip.total_earnings}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTds">
            <Form.Label className="mb-2 required">TDS</Form.Label>
            <Form.Control
              type="text"
              name="tds"
              value={salarySlip.tds}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProfessionalTax">
            <Form.Label className="mb-2 required">Professional Tax</Form.Label>
            <Form.Control
              type="text"
              name="professional_tax"
              value={salarySlip.professional_tax}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeePf">
            <Form.Label className="mb-2 required">Employee PF</Form.Label>
            <Form.Control
              type="text"
              name="employee_pf"
              value={salarySlip.employee_pf}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOtherDeductions">
            <Form.Label className="mb-2 required">Other Deductions</Form.Label>
            <Form.Control
              type="text"
              name="other_deductions"
              value={salarySlip.other_deductions}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalDeductions">
            <Form.Label className="mb-2 required">Total Deductions</Form.Label>
            <Form.Control
              type="text"
              name="total_deductions"
              value={salarySlip.total_deductions}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-2">
            Add Salary Slip
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalarySlipAddModal;
