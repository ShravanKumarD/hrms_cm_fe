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

const Timesheet = () => {
  const [applications, setApplications] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const history = useHistory();

  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || null;
    } catch (error) {
      console.error("Failed to fetch user data from localStorage", error);
      return null;
    }
  })();

  useEffect(() => {
    if (!userId) {
      history.push("/login");
    } else {
      const fetchAttendances = async () => {
        try {
          axios.defaults.baseURL = API_BASE_URL;
          const response = await axios.get(`api/attendance/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Fetched Attendances: ", response.data); // Debugging line
          setAttendances(response.data || []);
        } catch (error) {
          console.error("Error fetching attendances: ", error);
        }
      };

      const fetchApplications = async () => {
        try {
          axios.defaults.baseURL = API_BASE_URL;
          const response = await axios.get(`/api/applications/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Fetched Applications: ", response.data); // Debugging line
          setApplications(response.data || []);
        } catch (error) {
          console.error("Error fetching applications: ", error);
        }
      };

      const fetchHolidays = async () => {
        const fetchedHolidays = [
          { date: "2024-09-07", label: "Ganesh Chaturthi", details: "Birth of Lord Ganesha." },
          { date: "2024-10-02", label: "Mahatma Gandhi Jayanti", details: "Birthday of Mahatma Gandhi." },
        ];
        console.log("Fetched Holidays: ", fetchedHolidays); // Debugging line
        setHolidays(fetchedHolidays);
      };

      fetchAttendances();
      fetchApplications();
      fetchHolidays();
    }
  }, [userId, history]);

  const renderEventContent = (dayInfo) => {
    const cellDateString = moment(dayInfo.date).format("YYYY-MM-DD");
    const holiday = holidays.find((h) => h.date === cellDateString);
    const application = applications.find((app) =>
      moment(app.startDate).isSame(cellDateString, "day")
    );
    const attendance = attendances.find((att) =>
      moment(att.date).isSame(cellDateString, "day")
    );

    // Return custom content based on conditions
    return (
      <div style={{ fontSize: "0.7em" }}>
        {holiday && (
          <div style={{ backgroundColor: "rgba(173, 216, 230, 0.2)" }}>
            {holiday.label}
          </div>
        )}
        {application && (
          <div style={{ backgroundColor: application.status === "Pending" ? "rgba(255, 165, 0, 0.2)" : "rgba(0, 255, 0, 0.2)" }}>
            {application.status}: {application.type}
          </div>
        )}
        {attendance && (
          <div style={{ backgroundColor: attendance.hoursWorked >= 9 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)" }}>
            {attendance.hoursWorked >= 9 ? "Full Day" : "Partial Day"}
          </div>
        )}
      </div>
    );
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
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "title", right: "prev,next" }}
          dateClick={handleDateClick}
          dayCellContent={renderEventContent}  // Render custom content for each day
        />
      </div>

      {popupContent && (
        <div className="popup-content">
          <strong>{popupContent.label}</strong>
          <p>{popupContent.details}</p>
        </div>
      )}

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
