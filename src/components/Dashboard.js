import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from "moment";
import TimesheetMini from "./../components-mini/TimesheetMini";
import RecentAnnouncements from "./RecentAnnouncements";
import API_BASE_URL from "../env";

const Dashboard = () => {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [userNames, setUserNames] = useState({});
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [todaysCount, setTodaysCount] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [empCount, setEmpCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.baseURL = API_BASE_URL;
    fetchApplications(token);
    fetchUsers(token);
    fetchAttendance(token);
  }, [location]);

  const fetchApplications = async (token) => {
    try {
      const res = await axios.get("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedApplications = res.data
        .filter(app => app.status === "Pending")
        .map(app => ({
          ...app,
          startDate: moment(app.startDate).format("Do MMM YYYY"),
          endDate: moment(app.endDate).format("Do MMM YYYY"),
        }));

      setFilteredApplications(formattedApplications.reverse());
      fetchUserNames([...new Set(formattedApplications.map(app => app.userId))]);
      setDisabledButtons(formattedApplications.reduce((acc, app) => {
        acc[app.id] = app.status !== "Pending";
        return acc;
      }, {}));
    } catch (err) {
      console.error(err.response?.data?.message || "Error occurred");
    }
  };

  const fetchUsers = async (token) => {
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async (token) => {
    try {
      const res = await axios.get("/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedAttendances = res.data.map(att => ({
        ...att,
        date: moment(att.date).format("YYYY-MM-DD"),
      }));
      const todaysCount = formattedAttendances.filter(att => moment(att.date).isSame(moment(), 'day')).length;
      setTodaysCount(todaysCount);
      const employeeNames = [...new Set(formattedAttendances.map(att => att.user.fullName))];
      setEmployeeList(employeeNames);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const fetchUserNames = async (userIds) => {
    try {
      const responses = await Promise.all(userIds.map(userId =>
        axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      ));
      setUserNames(responses.reduce((acc, res) => {
        acc[res.data.id] = res.data.fullName;
        return acc;
      }, {}));
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  const handleStatusChange = (app, status) => {
    axios.put(`/api/applications/${app.id}`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setFilteredApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));
        setDisabledButtons(prev => ({ ...prev, [app.id]: status !== "Pending" }));
      })
      .catch(err => console.error(err.response?.data?.message || "Error occurred"));
  };

  const absentCountToday = empCount - todaysCount;

  const handleCloseModal = (modalSetter) => {
    modalSetter(false);
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-10">
          <TimesheetMini />
        </div>
        <div className="col-sm-2 pt-4">
          <button className="dashboard-icons" onClick={() => setShowModal1(true)}>Applications</button>
          <p>&nbsp;</p>
          <button className="dashboard-icons" onClick={() => setShowModal2(true)}>Announcements</button>
          <p>&nbsp;</p>
          <button className="dashboard-icons" onClick={() => setShowModal3(true)}>Daily Workforce Summary</button>
        </div>
      </div>

  
      {/* Modal for Applications */}
      <Modal show={showModal1} onHide={() => handleCloseModal(setShowModal1)} backdrop="static" className="modalApplications">
        <Modal.Header closeButton>
          <h3>Employees' Applications</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <table>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{userNames[app.userId] || "Loading..."}</td>
                    <td className="modaltd">{app.type}</td>
                    <td className="modaltd">{app.startDate}</td>
                    <td className="modaltd">{app.endDate}</td>
                    <td className="modaltd">{app.reason}</td>
                    <td>
                      <span className={`badge ${app.status === 'Approved' ? 'bg-success' :
                        app.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        className="btn btn-light btn-sm"
                        onClick={() => handleStatusChange(app, 'Approved')}
                        disabled={disabledButtons[app.id]}
                      >
                        Approve
                      </Button>{" "}
                      <Button
                        variant="danger"
                        className="btn btn-light btn-sm"
                        onClick={() => handleStatusChange(app, 'Rejected')}
                        disabled={disabledButtons[app.id]}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => handleCloseModal(setShowModal1)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Announcements */}
      <Modal show={showModal2} onHide={() => handleCloseModal(setShowModal2)} backdrop="static">
        <Modal.Header closeButton>
          <h3>Announcements</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <RecentAnnouncements />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => handleCloseModal(setShowModal2)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Workforce Analytics */}
      <Modal show={showModal3} onHide={() => handleCloseModal(setShowModal3)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Workforce Analytics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card mb-3">
            <h4><strong>Total Employees: {empCount}</strong></h4>
          </div>
          <div className="card mb-3">
            <h4><strong>Total Employees' Present Today: {todaysCount}</strong></h4>
          </div>
          <div className="card mb-3">
            <h4><strong>Total Employees' Absent Today: {absentCountToday}</strong></h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal(setShowModal3)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
