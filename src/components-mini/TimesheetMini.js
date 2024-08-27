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

  const handleDayRender = (dayRenderInfo) => {
    const { date, el } = dayRenderInfo;
    // console.log("Day render info:", dayRenderInfo);
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);

    const cellDateString = date.toDateString();

    // Default styling
    el.style.backgroundColor = "";
    el.style.textAlign = "left";
    el.style.verticalAlign = "bottom";
    el.style.lineHeight = "normal";
    el.style.fontSize = "0.7em";
    el.style.paddingBottom = "0.6rem";
    el.style.paddingLeft = "0.6rem";

    if (date.toDateString() === today.toDateString()) {
      el.style.backgroundColor = "red";
    }

    // if (date > today && date <= end) {
    //   el.style.backgroundColor = "yellow";
    //   el.textContent = "Yellow";
    // }

    if (date.getDay() === 0) {
      el.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
    }

    // Check if application exists for the date

    const application = applications.find(
      (application) =>
        new Date(application.startDate).toDateString() === cellDateString
    );

    if (application) {
      console.log("Application found:", application);
      el.style.color = "black";
      // if application approved, dont show this: "Requested <br>" instead show "Approved <br>" with color green
      if (application.status === "Pending") {
        el.style.backgroundColor = "rgba(255, 165, 0, 0.4)";
        el.innerHTML = "Requested <br>" + application.type;
      } else if (application.status === "Approved") {
        el.style.backgroundColor = "rgba(0, 128, 0, 0.4)";
        el.innerHTML = "Approved <br>" + application.type;
      }
    }

    if (clickedDate && date.toDateString() === clickedDate.toDateString()) {
      // increase opacity  el.style.backgroundColor is in format "rgba(255, 165, 0, 0.4)" -> "rgba(255, 165, 0, 1)"
      const color = el.style.backgroundColor.split(", ");
      color[3] = "0.8)";
      el.style.backgroundColor = color.join(", ");
    }

    // Check if attendance record exists for the date

    const attendance = attendances.find(
      (attendance) =>
        new Date(attendance.date).toDateString() === cellDateString
    );

    function getWorkStatusAndColor(hoursWorked) {
      let workStatus = "Less than Half Day";
      let backgroundColor = "rgba(255, 255, 0, 0.4)"; // Yellow for "Less than Half Day"

      if (hoursWorked > 9) {
        workStatus = "Overtime";
        backgroundColor = "rgba(0, 100, 0, 0.6)"; // Darker green for overtime
      } else if (hoursWorked >= 9) {
        workStatus = "Full Day";
        backgroundColor = "rgba(0, 128, 0, 0.4)"; // Green for "Full Day"
      } else if (hoursWorked >= 4) {
        workStatus = "Half Day";
        backgroundColor = "rgba(144, 238, 144, 0.4)"; // Leafy green for "Half Day"
      }

      return { workStatus, backgroundColor };
    }

    if (attendance) {
      // console.log("Attendance found:", attendance);
      // Parse clockinTime and clockoutTime using moment to handle both formats
      const clockinTime = moment(attendance.clockinTime, [
        "YYYY-MM-DD HH:mm:ss",
        "HH:mm:ss",
      ]);
      let clockoutTime;
      if (
        date.toDateString() === today.toDateString() &&
        !attendance.clockoutTime
      ) {
        clockoutTime = moment(); // Set to current time if clockoutTime is null and date is today
      } else {
        clockoutTime = moment(attendance.clockoutTime, [
          "YYYY-MM-DD HH:mm:ss",
          "HH:mm:ss",
        ]);
      }
      const duration = moment.duration(clockoutTime.diff(clockinTime));
      const hoursWorked = duration.asHours();

      const { workStatus, backgroundColor } =
        getWorkStatusAndColor(hoursWorked);

      switch (attendance.status) {
        case "Present":
          el.style.backgroundColor = backgroundColor;
          el.style.color = "black";
          el.innerHTML =
            workStatus +
            "<br>" +
            clockinTime.format("h:mm a") +
            " - " +
            clockoutTime.format("h:mm a");
          break;
        case "Absent":
          el.style.backgroundColor = "rgba(255, 99, 71, 0.4)";
          el.style.color = "black";
          el.textContent = "Absent";
          break;
        // case "Half Day":
        //   el.style.backgroundColor = "rgba(255, 255, 0, 0.4)";
        //   el.style.color = "black";
        //   el.textContent = "Half Day";
        //   break;
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
      {/* <header className="attendance-header">
        <h1>Attendance Calendar</h1>
        <TimesheetTooltip />
        <button
          onClick={() => history.push("/application")}
          className="new-application-btn"
        >
          Apply New
        </button>
      </header> */}
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
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
