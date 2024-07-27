import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import AddEventPopup from "./AddEventPopup";
import moment from "moment";
import ReactToolTip from "react-tooltip";
import ShowEventPopup from "./ShowEventPopup";

const Calendar = () => {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    axios.defaults.baseURL = "http://localhost:80";
    axios({
      method: "get",
      url: `api/personalEvents/user/${userData.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      let newEvents = res.data.map((x) => ({
        title: x.eventTitle,
        description: x.eventDescription,
        start: moment(x.eventStartDate).format("YYYY-MM-DD HH:mm:ss"),
        end: moment(x.eventEndDate).format("YYYY-MM-DD HH:mm:ss"),
        id: x.id,
        color: "#007bff",
        textColor: "white",
      }));

      setEvents(newEvents);
    });
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      start: info.event.start,
      end: info.event.end,
    });
    setShowModel(true);
  };

  const handleEventPositioned = (info) => {
    info.el.setAttribute(
      "title",
      info.event.extendedProps.description
        ? info.event.extendedProps.description
        : "No description"
    );
    ReactToolTip.rebuild();
  };

  const closeAddModel = () => setShowAddModel(false);
  const closeShowModel = () => setShowModel(false);

  return (
    <>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        eventClick={handleEventClick}
        dateClick={() => setShowAddModel(true)}
        events={events}
        eventPositioned={handleEventPositioned}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        customButtons={{
          button: {
            text: "Add Event",
            click: () => {
              setShowAddModel(true);
            },
          },
        }}
        header={{
          left: "prev,next today button",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
      />
      <AddEventPopup show={showAddModel} onHide={closeAddModel} />
      {showModel && (
        <ShowEventPopup
          show={true}
          onHide={closeShowModel}
          data={selectedEvent}
        />
      )}
    </>
  );
};

export default Calendar;
