import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Alert, Form, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_BASE_URL from "../env";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("Do MMM YYYY"),
          endDate: moment(app.endDate).format("Do MMM YYYY"),
        }));
        setApplications(formattedApplications.reverse());
        setFilteredApplications(formattedApplications.reverse()); // Initially show all applications
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, []);

  useEffect(() => {
    applyFilters(statusFilter, startDate, endDate);
  }, [statusFilter, startDate, endDate]);

  const handleStatusChange = useCallback((app, status) => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .put(`/api/applications/${app.id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        // Update the state without re-fetching data
        setApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));
        setFilteredApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));
        setCompleted(true);
        setTimeout(() => setCompleted(false), 2000); // Reset success message after 2 seconds
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, []);

  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
  };

  const handleDateChange = (date, field) => {
    if (field === "startDate") {
      setStartDate(date);
    } else if (field === "endDate") {
      setEndDate(date);
    }
  };

  const applyFilters = (status, start, end) => {
    let filtered = applications;

    if (status) {
      filtered = filtered.filter(app => app.status === status);
    }

    if (start && end) {
      const startDate = moment(start).startOf('day');
      const endDate = moment(end).endOf('day');
      filtered = filtered.filter(app => {
        const appStartDate = moment(app.startDate, "Do MMM YYYY");
        return appStartDate.isBetween(startDate, endDate, null, '[]');
      });
    }

    setFilteredApplications(filtered);
  };

  return (
    <div className="container my-4">
      {hasError && <Alert variant="danger">{errorMsg}</Alert>}
      {completed && <Alert variant="success">Status updated successfully!</Alert>}

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Group controlId="statusFilter">
            <Form.Label>Filter by Status</Form.Label>
            <Form.Control as="select" value={statusFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="dateRange">
            <Form.Label>Filter by Date Range</Form.Label>
            <div className="d-flex">
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className="form-control me-2"
                dateFormat="MMMM d, yyyy"
                placeholderText="Start Date"
              />
              <p>&nbsp;</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                className="form-control"
                dateFormat="MMMM d, yyyy"
                placeholderText="End Date"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Emp Id</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((app) => (
            <tr key={app.id}>
              <td>{app.userId}</td>
              <td>{app.type}</td>
              <td>{app.startDate}</td>
              <td>{app.endDate}</td>
              <td>{app.reason}</td>
              <td>{app.status}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => handleStatusChange(app, 'Approved')}
                >
                  Approve
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleStatusChange(app, 'Rejected')}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApplicationList;
