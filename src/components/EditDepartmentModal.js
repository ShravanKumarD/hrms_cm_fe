import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const AddEventModel = (props) => {
  const [departmentName, setDepartmentName] = useState("");
  const [id, setId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  // Simulate componentDidMount using useEffect
  useEffect(() => {
    setDepartmentName(props.data.departmentName);
    setId(props.data.id);
  }, [props.data]);

  const handleChange = (event) => {
    const { value } = event.target;
    setDepartmentName(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = { departmentName };

    axios.defaults.baseURL = API_BASE_URL;
    axios
      .put(`/api/departments/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setDone(true);
      })
      .catch((err) => {
        setShowAlert(true);
        setErrorMsg(err.response?.data?.message || "Error updating department");
      });
  };

  if (done) {
    return <Redirect to="/departments" />;
  }

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Department
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant="warning" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formDepartmentName">
            <Form.Label className="mb-2">Department Name</Form.Label>
            <Form.Control
              type="text"
              className="col-8"
              name="departmentName"
              value={departmentName}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <button  type="submit" className="dashboard-icons">
            Submit
          </button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="dashboard-icons" onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventModel;
