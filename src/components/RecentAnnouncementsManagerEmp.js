import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../env";

const RecentAnnouncements = () => {
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const deptId = user ? user.departmentId : null;

    if (deptId) {
      axios.defaults.baseURL = API_BASE_URL;
      axios
        .get(`/api/departmentAnnouncements/recent/department/${deptId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (isMounted) {
            const sortedAnnouncements = res.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRecentAnnouncements(sortedAnnouncements);
          }
        })
        .catch((error) => {
          console.error("Error fetching recent announcements:", error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const days = [
    "Sunday", // fixed index to start with Sunday
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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

  if (recentAnnouncements.length === 0) {
    return null; // No announcements, hide the section
  }

  return (
    <div className="card" style={{ backgroundColor: "#8adcd2" }}>
      <h3 style={{ textAlign: "center" }}>Recent Announcements</h3>
      <ul>
        {recentAnnouncements.map((announcement) => (
          <li
            key={announcement.id}
            style={{ listStyle: "none" }}
            className="mb-2 mt-1"
          >
            <div className="float-left mr-2">
              <time dateTime={announcement.createdAt} className="icon p-0">
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
            <br />
            <small>{announcement.announcementDescription}</small>
            <hr className="pt-2 pb-1 mb-0" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentAnnouncements;
