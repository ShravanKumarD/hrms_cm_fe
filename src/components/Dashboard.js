import React, { useState, useEffect, useRef, useCallback } from "react";
import TimesheetMini from "./../components-mini/TimesheetMini";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import API_BASE_URL from "../env";
import moment from "moment"
import RecentAnnouncements from "./RecentAnnouncements";

const Dashboard = () => {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [userNames, setUserNames] = useState({});
  const [users, setUsers] = useState([]);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [attendances, setAttendances] = useState([]);
  const [todaysCount, setTodaysCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [empCount, setEmpCount] = useState(0);
  const modal1Ref = useRef(null);
  const button1Ref = useRef(null);
  const modal2Ref = useRef(null);
  const button2Ref = useRef(null);
  const modal3Ref = useRef(null);
  const button3Ref = useRef(null);

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data
          .filter(app => app.status === "Pending")
          .map(app => ({
            ...app,
            startDate: moment(app.startDate).format("Do MMM YYYY"),
            endDate: moment(app.endDate).format("Do MMM YYYY"),
          }));

        setFilteredApplications(formattedApplications.reverse());
        const userIds = [...new Set(formattedApplications.map((app) => app.userId))];
        fetchUserNames(userIds);
        setDisabledButtons(formattedApplications.reduce((acc, app) => {
          acc[app.id] = app.status !== "Pending";
          return acc;
        }, {}));
      })
      .catch((err) => {
        console.error(err.response?.data?.message || "An error occurred");
      });
      fetchUsers()
    fetchData();

  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmpCount(res.data.length);
      res.data.shift(1);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const formattedAttendances = response.data.map((attendance) => {
        const date = moment(attendance.date).format("YYYY-MM-DD");
        const clockinTime = attendance.clockinTime
          ? moment(attendance.clockinTime, [
              "YYYY-MM-DD HH:mm:ss",
              "HH:mm:ss",
            ]).format("hh:mm A")
          : "";
        const clockoutTime = attendance.clockoutTime
          ? moment(attendance.clockoutTime, [
              "YYYY-MM-DD HH:mm:ss",
              "HH:mm:ss",
            ]).format("hh:mm A")
          : "";

        return {
          ...attendance,
          date,
          clockinTime,
          clockoutTime,
        };
      });

      setAttendances(formattedAttendances.reverse());

      const today = moment().startOf("day");
      const todaysAttendance = formattedAttendances.filter((attendance) =>
        moment(attendance.date).isSame(today, "day")
      );
      setTodaysCount(todaysAttendance.length);
      const absentCountToday = formattedAttendances.length-todaysAttendance.length;
      setAbsentCount(absentCountToday);

      const monthlyData = {};
      formattedAttendances.forEach((att) => {
        const monthYear = moment(att.date).format("YYYY-MM");
        const day = moment(att.date).format("DD");

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {};
        }

        if (!monthlyData[monthYear][day]) {
          monthlyData[monthYear][day] = 0;
        }

        monthlyData[monthYear][day]++;
      });

      const monthlyAttendance = Object.entries(monthlyData).map(
        ([monthYear, days]) => ({
          monthYear,
          days: Object.entries(days).map(([day, count]) => ({ day, count })),
        })
      );

      setMonthlyAttendance(monthlyAttendance);

      const employeeNames = [
        ...new Set(formattedAttendances.map((att) => att.user.fullName)),
      ];
      setEmployeeList(employeeNames);
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    }
  }, []);


  const handleStatusChange = useCallback((app, status) => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .put(`/api/applications/${app.id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setFilteredApplications(prev => prev.map(item => item.id === app.id ? { ...item, status } : item));
        setDisabledButtons(prev => ({
          ...prev,
          [app.id]: status !== "Pending"
        }));
      })
      .catch((err) => {
        console.error(err.response?.data?.message || "An error occurred");
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

  const handleShowModal = (modalSetter, buttonRef, modalRef) => {
    modalSetter(true);
    positionModal(buttonRef.current, modalRef.current);
  };

  const handleCloseModal = (modalSetter) => {
    modalSetter(false);
  };

  const positionModal = (buttonElement, modalElement) => {
    if (buttonElement && modalElement) {
      const buttonRect = buttonElement.getBoundingClientRect();
      modalElement.style.position = 'absolute';
      modalElement.style.top = `${buttonRect.top}px`;
      modalElement.style.left = `${buttonRect.left - modalElement.offsetWidth - 10}px`;
    }
  };


  return (
    <>
      <div className="row">
        <div className="col-sm-10">
          <TimesheetMini />
        </div>
        <div className="col-sm-2 pt-4">
          <button ref={button1Ref} className="dashboard-icons" onClick={() => handleShowModal(setShowModal1, button1Ref, modal1Ref)}>Applications</button>
          <p>&nbsp;</p>
          <button ref={button2Ref} className="dashboard-icons" onClick={() => handleShowModal(setShowModal2, button2Ref, modal2Ref)}>Announcements</button>
          <p>&nbsp;</p>
          <button ref={button3Ref} className="dashboard-icons" onClick={() => handleShowModal(setShowModal3, button3Ref, modal3Ref)}>Daily Workforce Summary</button>
        </div>
      </div>
      <Modal
        show={showModal1}
        onHide={() => handleCloseModal(setShowModal1)}
           backdrop="static"
        className="modalApplications"
      >
        <div className="d-flex justify-content-center">
        <Modal.Header closeButton>
          <h3>Employees' Applications</h3>
          </Modal.Header>
        </div>
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
        <div className="d-flex justify-content-center">
          <Button
            variant="info"
            className="d-flex flex-wrap align-items-center justify-content-center mb-3 btn-sm"
            onClick={() => handleCloseModal(setShowModal1)}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* Modal 2 */}
      <Modal
        show={showModal2}
        onHide={() => handleCloseModal(setShowModal2)}
        backdrop="static"
        // centered
      >
           <div className="d-flex justify-content-center" >
            <Modal.Header closeButton>
          <h3>Announcements</h3>
          </Modal.Header>
          </div>
          <div className="d-flex justify-content-center">
        <RecentAnnouncements/>
        </div>
        <div className="d-flex justify-content-center">
          <Button
            variant="info"
            className="d-flex flex-wrap align-items-center justify-content-center mb-3 btn-sm"
            onClick={() => handleCloseModal(setShowModal2)}
          >
            Close
          </Button>
        </div>
      </Modal>






      <Modal
      show={showModal3}
      onHide={() => handleCloseModal(setShowModal3)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Workforce Analytics</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className=" card mb-3">
          <h4><strong>Total Employees: {empCount}</strong></h4>
        </div>
        <div className=" card mb-3">
          <h4><strong>Total Employees' Present Today: {todaysCount}</strong></h4>
        </div>
        <div className=" card mb-3">
          <h4><strong>Total Employees' Absent Today:{absentCount}</strong></h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => handleCloseModal(setShowModal3)}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default Dashboard;
