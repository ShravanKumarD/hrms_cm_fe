import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "../Timesheet.css";
import LightweightStartWork from "../components-mini/LightweightStartWork";
import ApplicationModal from "./ApplicationModal";
import API_BASE_URL from "../env";
import { Modal } from "react-bootstrap";

const Timesheet = () => {
  const [applications, setApplications] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    setError("User authentication failed. Please log in again.");
  }

  const userId = user?.id;

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User not authenticated.");
        }

        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`api/attendance/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error("No attendance data found.");
        }

        setAttendances(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching attendance data.");
      }
    };

    fetchAttendances();
  }, [userId, token]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User not authenticated.");
        }

        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`/api/applications/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error("No application data found.");
        }

        setApplications(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching application data.");
      }
    };

    fetchApplications();
  }, [userId, token]);

  const handleDayRender = (dayRenderInfo) => {
    const { date, el } = dayRenderInfo;
    const cellDateString = date.toDateString();

    el.style.cssText = `
      background-color: '';
      font-size: 0.9em;
      padding-bottom: 0.8rem;
      padding-left: 0.8rem;
      text-align: left;
      vertical-align: bottom;
      line-height: normal;
    `;

    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      el.style.backgroundColor = "red";
    }

    const application = applications.find(
      (application) =>
        new Date(application.startDate).toDateString() === cellDateString
    );

    if (application) {
      const color =
        application.status === "Pending" ? "rgba(255, 165, 0, 0.4)" : "rgba(0, 128, 0, 0.4)";
      el.style.backgroundColor = color;
      el.innerHTML = `${application.status} <br> ${application.type}`;
    }

    const attendance = attendances.find(
      (attendance) =>
        new Date(attendance.date).toDateString() === cellDateString
    );

    if (attendance) {
      const clockinTime = moment(attendance.clockinTime);
      const clockoutTime = attendance.clockoutTime
        ? moment(attendance.clockoutTime)
        : moment();
      const hoursWorked = moment.duration(clockoutTime.diff(clockinTime)).asHours();
      const { workStatus, backgroundColor } = getWorkStatusAndColor(hoursWorked);

      el.style.backgroundColor = backgroundColor;
      el.innerHTML = `${workStatus} <br> ${clockinTime.format("h:mm a")} - ${clockoutTime.format(
        "h:mm a"
      )}`;

      if (attendance.status === "Absent") {
        el.style.backgroundColor = "rgba(255, 99, 71, 0.4)";
        el.textContent = "Absent";
      } else if (attendance.status === "Leave") {
        el.style.backgroundColor = "rgba(173, 216, 230, 0.4)";
        el.textContent = "Leave";
      }
    }
  };

  const getWorkStatusAndColor = (hoursWorked) => {
    if (hoursWorked > 9) {
      return { workStatus: "Overtime", backgroundColor: "rgba(0, 100, 0, 0.6)" };
    } else if (hoursWorked >= 9) {
      return { workStatus: "Full Day", backgroundColor: "rgba(0, 128, 0, 0.4)" };
    } else if (hoursWorked >= 4) {
      return { workStatus: "Partial Day", backgroundColor: "rgba(144, 238, 144, 0.4)" };
    } else {
      return { workStatus: "Less than Half Day", backgroundColor: "rgba(255, 255, 0, 0.4)" };
    }
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    const today = new Date();

    if (clickedDate.toDateString() === today.toDateString()) {
      setShowModal(true);
    } else {
      setClickedDate(clickedDate);
      setShowApplicationModal(true);
    }
  };

  return (
    <div className="attendance-container">
      {error && <div className="error-message">{error}</div>}
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          header={{
            left: "prev,next",
            center: "title",
          }}
          dayCellDidMount={handleDayRender}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Start Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LightweightStartWork />
        </Modal.Body>
      </Modal>
      <ApplicationModal
        show={showApplicationModal}
        onHide={() => setShowApplicationModal(false)}
        date={clickedDate}
      />
    </div>
  );
};

export default Timesheet;
