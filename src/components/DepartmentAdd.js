import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../env";

const DepartmentAdd = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleChange = (event) => {
    setDepartmentName(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setHasError(false);
    setErrMsg("");
    setCompleted(false);

    const department = {
      departmentName: departmentName,
    };

    axios.defaults.baseURL = API_BASE_URL;
    axios
      .post("/api/departments", department, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setCompleted(true);
      })
      .catch((err) => {
        setHasError(true);
        setErrMsg(err.response?.data?.message || "Error adding department");
        window.scrollTo(0, 0);
      });
  };

  if (completed) {
    return <Redirect to="/departments" />;
  }

  return (
    <div className="mb-3 secondary-card">
      <Card.Header>
        <b>Add Department</b>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formDepartmentName">
            <Form.Label className="text-muted mb-2">Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Department Name"
              name="departmentName"
              style={{ width: "50%" }}
              value={departmentName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="dashboard-icons">
            Add
          </Button>
        </Form>
      </Card.Body>
      {hasError && (
        <Alert variant="danger" className="m-3">
          {errMsg}
        </Alert>
      )}
    </div>
  );
};

export default DepartmentAdd;
