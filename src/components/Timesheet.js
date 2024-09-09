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

  // Error handling for missing user or token in localStorage
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
        console.error(error);
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
        console.error(error);
        setError(error.message || "An error occurred while fetching application data.");
      }
    };

    fetchApplications();
  }, [userId, token]);

  const handleDayRender = (dayRenderInfo) => {
    const { date, el } = dayRenderInfo;
    const today = new Date();
    const cellDateString = date.toDateString();

    el.style.backgroundColor = "";
    el.style.textAlign = "left";
    el.style.verticalAlign = "bottom";
    el.style.lineHeight = "normal";
    el.style.fontSize = "0.9em";
    el.style.paddingBottom = "0.8rem";
    el.style.paddingLeft = "0.8rem";

    if (date.toDateString() === today.toDateString()) {
      el.style.backgroundColor = "red";
    }

    if (date.getDay() === 0) {
      el.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
    }

    const application = applications.find(
      (application) =>
        new Date(application.startDate).toDateString() === cellDateString
    );

    if (application) {
      if (application.status === "Pending") {
        el.style.backgroundColor = "rgba(255, 165, 0, 0.4)";
        el.innerHTML = `Requested <br>${application.type}`;
      } else if (application.status === "Approved") {
        el.style.backgroundColor = "rgba(0, 128, 0, 0.4)";
        el.innerHTML = `Approved <br>${application.type}`;
      }
    }

    if (clickedDate && date.toDateString() === clickedDate.toDateString()) {
      const color = el.style.backgroundColor.split(", ");
      color[3] = "0.8)";
      el.style.backgroundColor = color.join(", ");
    }

    const attendance = attendances.find(
      (attendance) =>
        new Date(attendance.date).toDateString() === cellDateString
    );

    if (attendance) {
      const clockinTime = moment(attendance.clockinTime, [
        "YYYY-MM-DD HH:mm:ss",
        "HH:mm:ss",
      ]);
      const clockoutTime = attendance.clockoutTime
        ? moment(attendance.clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"])
        : moment();
      const duration = moment.duration(clockoutTime.diff(clockinTime));
      const hoursWorked = duration.asHours();

      const { workStatus, backgroundColor } =
        getWorkStatusAndColor(hoursWorked);

      switch (attendance.status) {
        case "Present":
          el.style.backgroundColor = backgroundColor;
          el.style.color = "black";
          el.innerHTML = `${workStatus}<br>${clockinTime.format(
            "h:mm a"
          )} - ${clockoutTime.format("h:mm a")}`;
          break;
        case "Absent":
          el.style.backgroundColor = "rgba(255, 99, 71, 0.4)";
          el.style.color = "black";
          el.textContent = "Absent";
          break;
        case "Leave":
          el.style.backgroundColor = "rgba(173, 216, 230, 0.4)";
          el.style.color = "black";
          el.textContent = "Leave";
          break;
        default:
          break;
      }
    }
  };

  function getWorkStatusAndColor(hoursWorked) {
    let workStatus = "Less than Half Day";
    let backgroundColor = "rgba(255, 255, 0, 0.4)";

    if (hoursWorked > 9) {
      workStatus = "Overtime";
      backgroundColor = "rgba(0, 100, 0, 0.6)";
    } else if (hoursWorked >= 9) {
      workStatus = "Full Day";
      backgroundColor = "rgba(0, 128, 0, 0.4)";
    } else if (hoursWorked >= 4) {
      workStatus = "Partial Day";
      backgroundColor = "rgba(144, 238, 144, 0.4)";
    }

    return { workStatus, backgroundColor };
  }

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
          dayRender={handleDayRender}
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
