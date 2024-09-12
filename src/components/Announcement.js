import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom"; // For react-router-dom v5
import axios from "axios";
import API_BASE_URL from "../env";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure to import DatePicker styles

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  axios.defaults.baseURL = API_BASE_URL;
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`/api/departments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchAnnouncements = async () => {
      console.log(API_BASE_URL, "API_BASE_URL");
      try {
        const res = await axios.get(`/api/departmentAnnouncements`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(res, "resss");
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchDepartments();
    fetchAnnouncements();
  }, []);

  const handleDelete = (id) => async (event) => {
    event.preventDefault();
    try {
      await axios.delete(`/api/departmentAnnouncements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnnouncements(
        announcements.filter((announcement) => announcement.id !== id)
      );
    } catch (error) {
      setHasError(true);
      setErrorMsg("Failed to delete the announcement.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userId = JSON.parse(localStorage.getItem("user")).id;
  
    // Prepare data common to all announcements
    const announcementData = {
      announcementTitle: title,
      announcementDescription: description,
      createdAt: createdAt ? createdAt.toISOString() : null,
      createdByUserId: userId,
    };
  
    try {
      if (selectedDepartment === "all") {
        // If "All Departments" is selected, create an announcement for each department
        await Promise.all(
          departments.map(async (dept) => {
            const data = { ...announcementData, departmentId: dept.id };
            return axios.post(`/api/departmentAnnouncements`, data, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
          })
        );
      } else {
        // For a specific department, send the announcement only to that department
        const data = { ...announcementData, departmentId: selectedDepartment };
        await axios.post(`/api/departmentAnnouncements`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
  
      setCompleted(true);
    } catch (error) {
      setHasError(true);
      setErrorMsg("Failed to create the announcement.");
    }
  };
  
  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.departmentName : 'Unknown Department';
  };
  
  const renderDepartments = () =>
    departments.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.departmentName}
      </option>
    ));

  if (completed) {
    return <Redirect to="/announcement" />; // For react-router-dom v5
  }

  return (
    <>
      <h3>Announcements</h3>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    placeholder="Enter Title"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Label>Set For Date</Form.Label>
                  <DatePicker
                    selected={createdAt}
                    onChange={(date) => setCreatedAt(date)}
                    placeholderText="Select Date"
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </Form.Group>
              </div>
              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">Choose one...</option>
                    <option value="all">All Departments</option>
                    {renderDepartments()}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Add Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="text-center mb-4">
              <Button type="submit" variant="primary" className="btn-sm">
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <div className="table-responsive">
        <Card.Body>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Event Scheduled On</th>
                <th>Created By</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement, index) => (
                <tr
                  key={announcement.id}
                  className={index % 2 ? "table-secondary" : ""}
                >
                  <td>{announcement.id}</td>
                  <td>{announcement.announcementTitle}</td>
                  <td>{announcement.announcementDescription}</td>
                  <td>{announcement.createdAt.split(" ")[0]}</td>
                  <td>{announcement.user.fullName}</td>
                  <td>{getDepartmentName(announcement.departmentId)}</td>
                  <td>
                    <button
                      onClick={handleDelete(announcement.id)}
                      className="btn btn-light btn- sm  "
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </div>
      {hasError && (
        <Alert variant="danger" className="mt-4">
          {errorMsg}
        </Alert>
      )}
    </>
  );
};

export default Announcement;
