import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const Application = () => {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

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

  const onSubmit = async (e) => {
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
      reason,
      userId,
    };

    axios.defaults.baseURL = "http://localhost:80";
    try {
      await axios.post("/api/applications", application, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCompleted(true);
    } catch (err) {
      setHasError(true);
      setErrMsg(err.response.data.message);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container-fluid pt-4">
      {hasError ? (
        <Alert variant="danger" className="m-3" block>
          {errMsg}
        </Alert>
      ) : completed ? (
        <Redirect to="/application-list" />
      ) : null}
      <Card className="mb-3 main-card">
        <Card.Header>
          <b>Make Application</b>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="formDepartmentName">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                style={{ width: "50%" }}
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
                <option value="Short Leave">Short Leave</option>{" "}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={startDate}
                className="form-control ml-1"
                onChange={(date) => setStartDate(date)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <DatePicker
                selected={endDate}
                className="form-control ml-1"
                onChange={(date) => setEndDate(date)}
                required
              />
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default Application;
