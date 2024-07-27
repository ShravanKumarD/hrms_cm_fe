import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarIcon from "react-calendar-icon";
import { ThemeProvider } from "styled-components";

const RecentAnnouncements = () => {
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const deptId = user ? user.departmentId : null;

    if (deptId) {
      axios.defaults.baseURL = "http://localhost:80";
      axios({
        method: "get",
        url: "/api/departmentAnnouncements/recent/department/" + deptId,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => {
        if (isMounted) {
          setRecentAnnouncements(res.data);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const theme = {
    calendarIcon: {
      textColor: "white", // text color of the header and footer
      primaryColor: "#0da472", // background of the header and footer
      backgroundColor: "#fafafa",
    },
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="card">
      <div className="mt-1" style={{ textAlign: "center" }}></div>
      <ul>
        {recentAnnouncements.map((announcement) => (
          <li
            style={{ listStyle: "none" }}
            key={announcement.id}
            className="mb-2 mt-1"
          >
            <div className="float-left mr-2">
              <time dateTime="2014-09-20" className="icon p-0">
                <em>{days[new Date(announcement.createdAt).getDay()]}</em>
                <strong>
                  {monthNames[new Date(announcement.createdAt).getMonth()]}
                </strong>
                <span>{new Date(announcement.createdAt).getDate()}</span>
              </time>
            </div>
            <span>
              <strong>{announcement.announcementTitle}</strong>
            </span>
            <br className="p-1" />
            <small>{announcement.announcementDescription}</small>
            <hr className=" pt-2 pb-1 mb-0" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentAnnouncements;
