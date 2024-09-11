import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarIcon from "react-calendar-icon";
import { ThemeProvider } from "styled-components";
import API_BASE_URL from "../env";
import './RecentAnnouncements.css'; // Assuming styles are moved to this CSS file

const RecentAnnouncements = () => {
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios.defaults.baseURL = API_BASE_URL;

    axios.get("/api/departmentAnnouncements/recent", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (isMounted) {
        setRecentAnnouncements(res.data);
      }
    })
    .catch((err) => {
      setError("Failed to fetch announcements.");
      console.error("Error fetching announcements:", err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Define theme for CalendarIcon
  const theme = {
    calendarIcon: {
      textColor: "white",
      primaryColor: "#0da472",
      backgroundColor: "#fafafa",
    },
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      date: date.getDate(),
    };
  };

  return (
    <div className="recent-announcements">
      {error && <div className="error-message">{error}</div>}
      <ul className="announcement-list">
        {recentAnnouncements.map((announcement) => {
          const { day, month, date } = formatDate(announcement.createdAt);

          return (
            <li key={announcement.id} className="announcement-item">
              <div className="date-icon">
                <time dateTime={announcement.createdAt} className="icon">
                  <em>{day}</em>
                  <strong>{month}</strong>
                  <span>{date}</span>
                </time>
              </div>
              <div className="announcement-content">
                <strong>{announcement.announcementTitle}</strong>
                {announcement.department && (
                  <span className="department-name"> ({announcement.department.departmentName})</span>
                )}
                <p>{announcement.announcementDescription}</p>
              </div>
              <hr className="separator" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentAnnouncements;
