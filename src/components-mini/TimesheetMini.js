import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "../Timesheet.css";
import LightweightStartWork from "./LightweightStartWork";
import ApplicationModal from "../components/ApplicationModal";
import API_BASE_URL from "../env";
import { Modal } from "react-bootstrap";
import TimesheetTooltip from "./TimesheetInfoTooltip";

const Timesheet = () => {
  const [applications, setApplications] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [doj, setDoj] = useState(null);
  const history = useHistory();

  // Safely access user ID from local storage
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || null;
    } catch (error) {
      console.error("Failed to fetch user data from localStorage", error);
      return null;
    }
  })();

  // Redirect to login if userId is not found
  useEffect(() => {
    if (!userId) {
      console.error("User ID not found. Redirecting to login.");
      history.push("/login");
    }
  }, [userId, history]);

  // Fetch attendances
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`api/attendance/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data) {
          setAttendances(response.data);
        } else {
          console.warn("No attendances data received.");
        }
      } catch (error) {
        console.error("Error fetching attendances: ", error);
      }
    };

    if (userId) fetchAttendances();
  }, [userId]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`/api/applications/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data) {
          setApplications(response.data);
        } else {
          console.warn("No applications data received.");
        }
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    if (userId) fetchApplications();
  }, [userId]);

  // Handle the rendering of each day cell
  const handleDayRender = (info) => {
    const { date, el } = info;
    const cellDateString = date.toDateString();

    // Reset styles
    el.style.cssText = `
      background-color: '';
      font-size: 1em;
      position: relative;
      padding: 4px;
    `;

    // Create elements for date and content
    const dateNumber = document.createElement("div");
    const content = document.createElement("div");

    dateNumber.innerText = date.getDate();
    dateNumber.style.cssText = `
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: transparent;
    `;

    content.style.fontSize = "0.7em";

    // Check for applications on this date
    const application = applications.find(
      (app) => new Date(app.startDate).toDateString() === cellDateString
    );

    if (application) {
      el.style.backgroundColor =
        application.status === "Pending"
          ? "rgba(255, 165, 0, 0.2)"
          : "rgba(0, 255, 0, 0.2)";
      content.innerText = `${application.status}\n${application.type}`;
    }

    // Check for attendance on this date
    const attendance = attendances.find(
      (att) => new Date(att.date).toDateString() === cellDateString
    );

    if (attendance) {
      const clockInTime = moment(attendance.clockinTime, [
        "YYYY-MM-DD HH:mm:ss",
        "HH:mm:ss",
      ]);
      const clockOutTime = attendance.clockoutTime
        ? moment(attendance.clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"])
        : moment();
      const hoursWorked = moment
        .duration(clockOutTime.diff(clockInTime))
        .asHours();

      let status = "Partial Day";
      if (hoursWorked > 9) {
        status = "Overtime";
        el.style.backgroundColor = "rgba(0, 128, 0, 0.4)";
      } else if (hoursWorked >= 9) {
        status = "Full Day";
        el.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
      } else if (hoursWorked < 4) {
        status = "Partial Day";
        el.style.backgroundColor = "rgba(144, 238, 144, 0.2)";
      }

      content.innerText = `${status}\n${clockInTime.format(
        "HH:mm"
      )} - ${clockOutTime.format("HH:mm")}`;

      if (attendance.status === "Absent") {
        el.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        content.innerText = "Absent";
      } else if (attendance.status === "Leave") {
        el.style.backgroundColor = "rgba(173, 216, 230, 0.2)";
        content.innerText = "Leave";
      }
    }

    // Apply the background color to the date number
    dateNumber.style.backgroundColor = el.style.backgroundColor;

    // Append the elements to the cell
    el.innerHTML = "";
    el.appendChild(dateNumber);
    el.appendChild(content);

    // Mark weekends (only Sunday)
    if (date.getDay() === 0) {
      el.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
      content.innerText = "Week Off";
    }
  };

  // Handle clicks on dates in the calendar
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
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          header={{
            left: "title",
            right: "prev,next",
          }}
          dayRender={handleDayRender}
          dayCellDidMount={handleDayRender}
          dateClick={handleDateClick}
          titleFormat={{ month: "long" }}
          height="auto"
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} closeButton>
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
