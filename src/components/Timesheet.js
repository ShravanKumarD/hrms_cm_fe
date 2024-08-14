import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "../AttendanceList.css";
import LightweightStartWork from "./LightweightStartWork";
import API_BASE_URL from "../env";
import { Modal } from "react-bootstrap";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const history = useHistory();
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [clickedDates, setClickedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendances();
  }, [userId]);

  const events = attendances.map((attendance) => ({
    title: attendance.status,
    start: moment(attendance.date).format("YYYY-MM-DD"),
    className: attendance.status === "Present" ? "present" : "absent",
  }));

  const handleDayRender = (dayRenderInfo) => {
    const { date, el } = dayRenderInfo;
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);

    const cellDateString = date.toDateString();

    // Default background color
    el.style.backgroundColor = "";
    // el.style.display = "flex";
    // el.style.flexDirection = "column";
    // el.style.justifyContent = "center";
    // el.style.alignItems = "center";
    el.style.textAlign = "center";
    el.style.verticalAlign = "middle";
    el.style.lineHeight = "normal"; // Reset line-height to normal
    el.style.fontSize = "1.04rem";

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      el.style.backgroundColor = "red";
    }

    if (date > today && date <= end) {
      el.style.backgroundColor = "yellow";
      el.textContent = "Yellow";
    }

    if (
      clickedDates.some(
        (clickedDate) => clickedDate.toDateString() === cellDateString
      )
    ) {
      el.style.backgroundColor = "green";
    }

    if (date.getDay() === 0) {
      // 0 is Sunday
      el.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
    }

    // Check if the date has a status of "Present"
    const attendance = attendances.find(
      (attendance) =>
        new Date(attendance.date).toDateString() === cellDateString
    );

    if (attendance && attendance.status === "Present") {
      el.style.backgroundColor = "yellowgreen";
      el.style.color = "white";
      el.textContent = "Full Day";
    } else if (attendance && attendance.status === "Absent") {
      el.style.backgroundColor = "brightpink";
      el.style.color = "white";
      el.textContent = "Absent";
    } else if (attendance && attendance.status === "Half Day") {
      el.style.backgroundColor = "yellow";
      el.style.color = "white";
      el.textContent = "Half Day";
    } else if (attendance && attendance.status === "Leave") {
      el.style.backgroundColor = "lightblue";
      el.textContent = "Leave";
      el.style.color = "white";
    }
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    console.log("Clicked date:", clickedDate);

    const today = new Date();
    if (
      clickedDate.getDate() === today.getDate() &&
      clickedDate.getMonth() === today.getMonth() &&
      clickedDate.getFullYear() === today.getFullYear()
    ) {
      setShowModal(true);
    } else {
      setClickedDates((prevDates) => {
        const newDates = [...prevDates];
        const dateString = clickedDate.toDateString();

        const dateIndex = newDates.findIndex(
          (date) => date.toDateString() === dateString
        );

        if (dateIndex !== -1) {
          // If date already exists, remove it
          newDates.splice(dateIndex, 1);
        } else {
          // Otherwise, add it
          newDates.push(clickedDate);
        }

        return newDates;
      });
    }
  };

  return (
    <div className="attendance-container">
      <header className="attendance-header">
        <h1>Attendance Calendar</h1>
        <button
          onClick={() => history.push("/application")}
          className="new-application-btn"
        >
          Apply New
        </button>
      </header>
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
          // events={events}
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
    </div>
  );
};

export default AttendanceList;
