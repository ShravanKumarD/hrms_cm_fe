// src/components/MarkAttendance.js
import React, { useState } from "react";
import axios from "axios";

const MarkAttendance = () => {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [clockinTime, setClockInTime] = useState("");
  const [clockoutTime, setClockOutTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:80/api/attendance/mark",
        {
          userId,
          date,
          status,
          clockinTime: status === "Present" ? clockinTime : null,
          clockoutTime: status === "Present" ? clockoutTime : null,
          latitude: status === "Present" ? latitude : null,
          longitude: status === "Present" ? longitude : null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      alert("Attendance marked successfully");
    } catch (error) {
      console.error(error);
      alert("Error marking attendance");
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Absent">Absent</option>
            <option value="Present">Present</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
        {status === "Present" && (
          <>
            <div>
              <label>Clock In Time:</label>
              <input
                type="time"
                value={clockinTime}
                onChange={(e) => setClockInTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Clock Out Time:</label>
              <input
                type="time"
                value={clockoutTime}
                onChange={(e) => setClockOutTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Latitude:</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Longitude:</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit">Mark Attendance</button>
      </form>
    </div>
  );
};

export default MarkAttendance;
