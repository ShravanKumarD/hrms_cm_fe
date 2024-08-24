import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../env"; // Update the path to your API_BASE_URL

/**
 * Utility function to get the work status for today's attendance.
 *
 * @param {Array} attendances - The array of attendance records.
 * @returns {Array} - An array of objects with user information and their work status.
 */
const getTodaysWorkStatus = (attendances) => {
  const today = moment().startOf("day");

  return attendances
    .filter((attendance) =>
      moment(attendance.date, "Do MMM YYYY").isSame(today, "day")
    )
    .map((attendance) => {
      const hasClockin = Boolean(attendance.clockinTime);
      const hasClockout = Boolean(attendance.clockoutTime);

      let status;
      if (!hasClockin) {
        status = "Start";
      } else if (hasClockin && !hasClockout) {
        status = "Working";
      } else if (hasClockin && hasClockout) {
        status = "Done";
      } else {
        status = "Unknown"; // Fallback in case of unexpected data
      }

      return {
        ...attendance,
        status,
      };
    });
};

const TodaysWorkStatus = () => {
  const [attendances, setAttendances] = useState([]);
  const [todaysWorkStatus, setTodaysWorkStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data from API and determine today's work status
  const fetchDataAndDetermineStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Format attendance data
      const formattedAttendances = response.data.map((attendance) => {
        const date = moment(attendance.date).format("Do MMM YYYY");
        return {
          ...attendance,
          date,
        };
      });

      setAttendances(formattedAttendances);

      // Determine work status for today's attendance
      const status = getTodaysWorkStatus(formattedAttendances);
      setTodaysWorkStatus(status);
    } catch (error) {
      setError("Failed to fetch attendance records");
      console.error("Failed to fetch attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data and determine status when component mounts
  useEffect(() => {
    fetchDataAndDetermineStatus();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Today's Work Status</h1>
      {todaysWorkStatus.length === 0 ? (
        <p>No attendance records for today.</p>
      ) : (
        <ul>
          {todaysWorkStatus.map((attendance) => (
            <li key={attendance.id}>
              {attendance.user.fullName} - {attendance.date} - Status:{" "}
              {attendance.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaysWorkStatus;
