import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import API_BASE_URL from "../env"; // Update the path to your API_BASE_URL

const Badge = styled.span`
  color: white;

  &.badge-danger {
    background-color: red;
  }
  &.badge-light-green {
    background-color: yellowgreen;
  }
  &.badge-green {
    background-color: green;
  }
  &.badge-grey {
    background-color: grey;
  }

  display: ${(props) => (props.isPushed ? "none" : "block")};
`;

const TodaysWorkStatus = ({ userId, isPushed }) => {
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState(null);

  // Fetch today's attendance data for the specified user and determine work status
  useEffect(() => {
    const fetchDataAndDetermineStatus = async () => {
      try {
        const response = await axios.get(
          `api/attendance/today/user/${userId}`,
          {
            baseURL: API_BASE_URL,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const attendanceData = response.data;
        const hasClockin = Boolean(attendanceData.clockinTime);
        const hasClockout = Boolean(attendanceData.clockoutTime);

        if (!hasClockin) {
          setStatus("Start");
        } else if (hasClockin && !hasClockout) {
          setStatus("Working");
        } else if (hasClockin && hasClockout) {
          setStatus("Done");
        } else {
          setStatus("Unknown"); // Fallback in case of unexpected data
        }
      } catch (error) {
        setError("Failed to fetch today's attendance record");
        console.error("Failed to fetch today's attendance record:", error);
        setStatus(null);
      }
    };

    fetchDataAndDetermineStatus();
  }, [userId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Start":
        return "badge-danger";
      case "Working":
        return "badge-light-green";
      case "Done":
        return "badge-green";
      default:
        return "badge-grey";
    }
  };

  if (error) {
    return <>{console.log(error)}</>;
  }

  return (
    <Badge className={`right badge ${getStatusClass(status)}`} isPushed={isPushed}>
      {status}
    </Badge>
  );
};

export default TodaysWorkStatus;
