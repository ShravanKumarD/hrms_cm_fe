import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import LightweightStartWork from "./LightweightStartWork";
import { Modal } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "./../env";
import './../components/TimeSheet.css';

import ApplicationModal from "../components/ApplicationModal";

export default function Calendar() {
  const [applications, setApplications] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [optionalHolidays, setOptionalHolidays] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [users, setUsers] = useState([]);
  const [empCount, setEmpCount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const token = localStorage.getItem("token");

        // Fetch holidays
        const holidayResponse = await axios.get('/api/holiday', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allHolidays = holidayResponse.data;
        setHolidays(allHolidays);
        setOptionalHolidays(allHolidays.filter(x => x.description === "Optional"));

        // Fetch users
        const userResponse = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Set birthday events
        const birthdayEvents = userResponse.data.map(user => {
          const birthDate = moment(user.user_personal_info?.dateOfBirth, 'YYYY-MM-DD');
          if (birthDate.isValid()) {
            return {
              title: `${user.fullName.split(' ')[0]}'s Birthday`,
              date: birthDate.format('YYYY-MM-DD'),          
              backgroundColor: "rgba(255, 223, 186, 0.5)",
              borderColor: "rgba(255, 223, 186, 0.8)"
            };
          }
          return null;
        }).filter(event => event !== null);
        setBirthdays(birthdayEvents);
        

        setEmpCount(userResponse.data.length);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDayCellDidMount = (info) => {
    const { date, el } = info;
    const cellDateString = date.toDateString();

    const application = applications.find(
      (app) => new Date(app.startDate).toDateString() === cellDateString
    );

    const attendance = attendances.find(
      (att) => new Date(att.date).toDateString() === cellDateString
    );

    el.classList.add('calendar-cell');

    if (application || attendance) {
      if (application) {
        el.classList.add(application.status === "Pending" ? 'application-pending' : 'application-approved');
        el.querySelector('.calendar-content').innerText = `${application.status}\n${application.type}`;
      }

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
          el.classList.add('attendance-overtime');
        } else if (hoursWorked >= 9) {
          status = "Full Day";
          el.classList.add('attendance-full-day');
        } else if (hoursWorked < 4) {
          status = "Partial Day";
          el.classList.add('attendance-partial-day');
        }

        el.querySelector('.calendar-content').innerText = `${status}\n${clockInTime.format(
          "HH:mm"
        )} - ${clockOutTime.format("HH:mm")}`;

        if (attendance.status === "Absent") {
          el.classList.add('attendance-absent');
          el.querySelector('.calendar-content').innerText = "Absent";
        } else if (attendance.status === "Leave") {
          el.classList.add('attendance-leave');
          el.querySelector('.calendar-content').innerText = "Leave";
        }
      }
    } else {
      el.classList.add('no-event');
    }

    const dateNumber = document.createElement("div");
    dateNumber.className = 'calendar-date';
    dateNumber.innerText = date.getDate();

    const content = document.createElement("div");
    content.className = 'calendar-content';

    el.innerHTML = "";
    el.appendChild(dateNumber);
    el.appendChild(content);
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

  const events = [...holidays, ...optionalHolidays, ...birthdays].map(event => ({
    title: event.title || event.name,
    date: event.date,
    backgroundColor: event.backgroundColor || (event.description === "Optional" ? "#8adcd2" : "#a7a4a4"),
    borderColor: event.borderColor || (event.description === "Optional" ? "#8adcd2" : "#a7a4a4")
  }));
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "title",
          right: "prev,next",
        }}
        dayHeaderContent={(arg) => arg.date.toLocaleDateString('en-US', { weekday: 'short' })}
        dayCellDidMount={handleDayCellDidMount}
        dateClick={handleDateClick}
        titleFormat={{ month: "long" }}
        height="auto"
        events={events}
        className="calendar-container"
      />
      <Modal show={showModal} 
      centered
      onHide={() => setShowModal(false)} closeButton>
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
    </>
  );
}
