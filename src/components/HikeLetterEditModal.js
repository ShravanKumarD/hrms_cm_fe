import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const HikeLetterEditModal = ({ data, onHide, onSuccess, ...props }) => {
  const [hikeLetter, setHikeLetter] = useState({
    id: null,
    date: null,
    name: "",
    place: "",
    effective_date: null,
    new_salary: "",
    previous_salary: "",
    hr_name: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setHikeLetter({
      id: data.id,
      date: new Date(data.date),
      name: data.name,
      place: data.place,
      effective_date: new Date(data.effective_date),
      new_salary: data.new_salary,
      previous_salary: data.previous_salary,
      hr_name: data.hr_name,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHikeLetter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/hikeLetters/${hikeLetter.id}`,
        hikeLetter,
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
          Edit Hike Letter
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Hike letter updated successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="warning" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label className="mb-2 required">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={hikeLetter.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPlace">
            <Form.Label className="mb-2 required">Place</Form.Label>
            <Form.Control
              type="text"
              name="place"
              value={hikeLetter.place}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label className="mb-2 required">Date</Form.Label>
            <DatePicker
              selected={hikeLetter.date}
              onChange={(date) => setHikeLetter((prev) => ({ ...prev, date }))}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEffectiveDate">
            <Form.Label className="mb-2 required">Effective Date</Form.Label>
            <DatePicker
              selected={hikeLetter.effective_date}
              onChange={(date) =>
                setHikeLetter((prev) => ({ ...prev, effective_date: date }))
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formNewSalary">
            <Form.Label className="mb-2 required">New Salary</Form.Label>
            <Form.Control
              type="text"
              name="new_salary"
              value={hikeLetter.new_salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPreviousSalary">
            <Form.Label className="mb-2 required">Previous Salary</Form.Label>
            <Form.Control
              type="text"
              name="previous_salary"
              value={hikeLetter.previous_salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHRName">
            <Form.Label className="mb-2 required">HR Name</Form.Label>
            <Form.Control
              type="text"
              name="hr_name"
              value={hikeLetter.hr_name}
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

export default HikeLetterEditModal;
