import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const SalarySlipEditModal = ({ show, onHide, data }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    userId: "",
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
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedValue = parseFloat(value) || 0; // Convert to number, default to 0 if NaN
  
      // Update the formData with the new value
      const updatedData = { ...prevData, [name]: updatedValue };
  
      // Recalculate totals
      const totalEarnings = [
        updatedData.basic_salary,
        updatedData.hra,
        updatedData.conveyance_allowance,
        updatedData.special_allowance,
        updatedData.medical_allowance,
      ].reduce((acc, curr) => acc + curr, 0);
  
      const totalDeductions = [
        updatedData.tds,
        updatedData.professional_tax,
        updatedData.employee_pf,
        updatedData.other_deductions,
      ].reduce((acc, curr) => acc + curr, 0);
  
      return {
        ...updatedData,
        total_earnings: totalEarnings,
        total_deductions: totalDeductions,
      };
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.baseURL = API_BASE_URL;
    axios
      .put(`/api/salary-slip/${formData.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
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
          {done && <Alert variant="success">Salary Slip updated successfully!</Alert>}
          {showAlert && <Alert variant="warning">{errorMessage}</Alert>}
          {[
            { label: "Name", name: "name" },
            { label: "Address", name: "address" },
            { label: "Designation", name: "designation" },
            { label: "Month", name: "month" }
          ].map(({ label, name }) => (
            <Form.Group key={name} controlId={`form${name}`}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}
          <Form.Group controlId="formDateOfJoining">
            <Form.Label>Date of Joining</Form.Label>
            <DatePicker
              selected={formData.date_of_joining}
              onChange={(date) => setFormData({ ...formData, date_of_joining: date })}
              className="form-control"
              required
            />
          </Form.Group>
          {[
            { label: "Basic Salary", name: "basic_salary" },
            { label: "HRA", name: "hra" },
            { label: "Conveyance Allowance", name: "conveyance_allowance" },
            { label: "Special Allowance", name: "special_allowance" },
            { label: "Medical Allowance", name: "medical_allowance" },
            { label: "TDS", name: "tds" },
            { label: "Professional Tax", name: "professional_tax" },
            { label: "Employee PF", name: "employee_pf" },
            { label: "Other Deductions", name: "other_deductions" },
            { label: "Total Earnings", name: "total_earnings", disabled: true },
            { label: "Total Deductions", name: "total_deductions", disabled: true }
          ].map(({ label, name, disabled }) => (
            <Form.Group key={name} controlId={`form${name}`}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={disabled}
                required={!disabled}
              />
            </Form.Group>
          ))}
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
