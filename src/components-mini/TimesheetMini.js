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
  const history = useHistory();
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [doj, setDoj] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`api/attendance/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAttendances(response.data);
        console.log("Attendances: ", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendances();
  }, [userId]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get(`/api/applications/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setApplications(response.data);
        console.log("Applications: ", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplications();
  }, [userId]);

  const handleDayRender = (info) => {
    const { date, el } = info;
    const cellDateString = date.toDateString();
    const today = new Date();

    //sleep for 10 secs
    setTimeout(() => {
      console.log("10 secs passed");
    }, 1000);

    el.style.fontSize = "0"; // This will hide the default date number

    // Reset styles
    el.style.backgroundColor = "";
    el.style.color = "black";
    el.style.borderRadius = "0"; // No border radius for the full cell
    el.style.overflow = "hidden";
    el.style.padding = "4px";
    el.style.textAlign = "left";
    el.style.verticalAlign = "bottom";
    el.style.lineHeight = "normal";
    el.style.fontSize = "1em"; // Slightly smaller font size
    el.style.paddingBottom = "0.6rem";
    el.style.paddingLeft = "0.6rem";
    el.style.position = "relative"; // Make the container relative for absolute positioning

    // Create date number element
    const dateNumber = document.createElement("div");
    dateNumber.innerText = date.getDate();
    dateNumber.style.fontSize = "0.9em";
    dateNumber.style.width = "24px";
    dateNumber.style.height = "24px";
    dateNumber.style.borderRadius = "50%";
    dateNumber.style.display = "flex";
    dateNumber.style.alignItems = "center";
    dateNumber.style.justifyContent = "center";
    dateNumber.style.margin = "0";
    dateNumber.style.position = "absolute"; // Position absolute for placement
    dateNumber.style.top = "4px"; // Distance from the top
    dateNumber.style.right = "4px"; // Distance from the right
    dateNumber.style.backgroundColor = "transparent"; // Background color, if needed

    // Create content element
    const content = document.createElement("div");
    content.style.fontSize = "0.7em"; // Slightly smaller font size
    content.style.marginTop = "30px"; // Push down the content to avoid overlap with dateNumber

    // Check for application
    const application = applications.find(
      (app) => new Date(app.startDate).toDateString() === cellDateString
    );

    if (application) {
      if (application.status === "Pending") {
        el.style.backgroundColor = "rgba(255, 165, 0, 0.2)";
        content.innerText = `Pending\n${application.type}`;
      } else if (application.status === "Approved") {
        el.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
        content.innerText = `Approved\n${application.type}`;
      }
    }

    // Check for attendance
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
      const duration = moment.duration(clockOutTime.diff(clockInTime));
      const hoursWorked = duration.asHours();

      let status = "Less than Half Day";
      el.style.backgroundColor = "rgba(255, 255, 0, 0.2)";

      if (hoursWorked > 9) {
        status = "Overtime";
        el.style.backgroundColor = "rgba(0, 128, 0, 0.4)";
      } else if (hoursWorked >= 9) {
        status = "Full Day";
        el.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
      } else if (hoursWorked >= 4) {
        status = "Half Day";
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

    // Set date number background color
    dateNumber.style.backgroundColor = el.style.backgroundColor;

    // Append elements
    el.innerHTML = "";
    el.appendChild(dateNumber);
    el.appendChild(content);

    // Handle weekends (only Sunday)
    if (date.getDay() === 0) {
      el.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
      content.innerText = "Week Off";
    }

    // Highlight today's date
    // if (date.toDateString() === today.toDateString()) {
    //   el.style.backgroundColor = "green";
    //   content.style.color = "white"; // Ensure text is visible on red background
    // }

    // Remove any spans generated by FullCalendar
    const spans = el.querySelectorAll("span");
    spans.forEach((span) => {
      span.style.display = "none";
    });
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    console.log("Clicked date:", clickedDate);

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
