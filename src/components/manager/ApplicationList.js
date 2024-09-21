import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Alert, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_BASE_URL from "../../env";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});
  const [applicationsCount,setApplicationsCount]=useState(0);

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
        setFilteredApplications(formattedApplications);
        setApplicationsCount(res.data.length);
        
        // Extract user IDs and fetch names
        const userIds = [...new Set(formattedApplications.map((app) => app.userId))];
        fetchUserNames(userIds);

        // Set initial disabled state for buttons
        setDisabledButtons(formattedApplications.reduce((acc, app) => {
          acc[app.id] = app.status !== "Pending";
          return acc;
        }, {}));
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
        setApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));
        setFilteredApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));

        // Update disabled buttons state
        setDisabledButtons(prev => ({
          ...prev,
          [app.id]: status !== "Pending" // Disable button if status is not "Pending"
        }));

        setCompleted(true);
        setTimeout(() => setCompleted(false), 3000); 
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, []);

  const fetchUserNames = async (userIds) => {
    try {
      const userNameRequests = userIds.map((userId) =>
        axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      );
      const responses = await Promise.all(userNameRequests);
      const nameMap = responses.reduce((acc, res) => {
        acc[res.data.id] = res.data.fullName;
        return acc;
      }, {});

      setUserNames(nameMap);
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

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
      <p><strong>Total Applications: {applicationsCount}</strong></p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Applied On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((app) => (
            <tr key={app.id}>
              <td>{userNames[app.userId] || "Loading..."}</td>
              <td>{app.type}</td>
              <td>{app.startDate}</td>
              <td>{app.endDate}</td>
             
              <td>{app.reason}</td>
              <td>{moment(app.appliedOn).format("Do MMM YYYY")}</td>

              {/* <td>{app.status}</td> */}
              <td>  <span className={`badge ${app.status === 'Approved' ? 'bg-success' :
                 app.status === 'Rejected' ? 'bg-warning' : 'bg-light'}`}>
                                            {app.status}
                                        </span></td>
              <td>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => handleStatusChange(app, 'Approved')}
                  disabled={disabledButtons[app.id]}
                >
                  <i className="fa fa-check"></i>
                </button>{" "}
                <button
                  className="btn btn-grey btn-sm"
                  onClick={() => handleStatusChange(app, 'Rejected')}
                  disabled={disabledButtons[app.id]}
                >
                  <i className="fa fa-times"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApplicationList;
