import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import ApplicationInfoTooltip from "../components-mini/ApplicationInfoTooltip";
import API_BASE_URL from "../env";

const ApplicationModal = ({ show, onHide, date }) => {
  const history = useHistory();
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (date) {
      setStartDate(date);
      setEndDate(date);
    }
  }, [date]);

  const handleChange = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case "type":
        setType(value);
        break;
      case "reason":
        setReason(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasError(false);
    setErrMsg("");
    setCompleted(false);

    let userId = JSON.parse(localStorage.getItem("user")).id;

    let application = {
      type,
      startDate,
      endDate,
      status: "Pending",
      appliedOn:new Date(),
      reason,
      userId,
    };

    axios.defaults.baseURL = API_BASE_URL;
    try {
      await axios.post("/api/applications", application, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCompleted(true);
      onHide(); // Close the modal on successful submission
      history.push("/application-list"); // Redirect to application list
    } catch (err) {
      setHasError(true);
      setErrMsg(err.response?.data?.message || "An error occurred");
      window.scrollTo(0, 0);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ alignItems: "center" }} closeButton>
        <Modal.Title>Make Application</Modal.Title>
        <span style={{ marginLeft: "10px" }}>
          <ApplicationInfoTooltip placement="right" />
        </span>
      </Modal.Header>
      <Modal.Body>
        {hasError && (
          <Alert variant="danger" className="m-3">
            {errMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDepartmentName">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              style={{ width: "100%" }}
              value={type}
              onChange={handleChange}
              required
            >
              <option value="">Choose one</option>
              <option value="Leave">Leave</option>
              <option value="Regularisation">Regularisation</option>
              <option value="Work From Home">Work From Home</option>
              <option value="On Duty">On Duty</option>
              <option value="Comp Off">Comp Off</option>
              <option value="Expense">Expense</option>
              <option value="Restricted Holiday">Restricted Holiday</option>
              {/* <option value="Short Leave">Short Leave</option> */}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>

            <div>
              <DatePicker
                selected={startDate}
                className="form-control"
                showMonthDropdown
                showYearDropdown
                onChange={(date) => setStartDate(date)}
                required
                placeholderText="Select start date"
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <div>
              <DatePicker
                selected={endDate}
                className="form-control"
                showMonthDropdown
                showYearDropdown
                onChange={(date) => setEndDate(date)}
                required
                placeholderText="Select end date"
              />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Reason <span className="text-muted">(Comments)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="reason"
              value={reason}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplicationModal;
