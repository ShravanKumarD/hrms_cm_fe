import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Container,
  Card,
  Alert,
  Button,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import styled from "styled-components";
import API_BASE_URL from "../env";

// Styled components
const WorkContainer = styled.div`
  width: 100%;
  height: 200px;
  // background: linear-gradient(
  //   to bottom right,
  //   ${(props) => props.theme.topColor}40,
  //   ${(props) => props.theme.bottomColor}20
  // );
  background-color:#8adcd2;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #8adcd2;
    z-index: 0;
  }
`;

const Header = styled.h3`
  margin: -5px;
  padding-bottom: 10px;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  z-index: 1;
  position: relative;
`;

// Helper functions
const getLighterColor = (color) => {
  const rgb = color.match(/\w\w/g).map((c) => parseInt(c, 16));
  const lightenFactor = 0.5; // Factor to lighten the color

  const lightenColor = rgb.map((c) =>
    Math.round(c + (255 - c) * lightenFactor)
  );

  return `rgb(${lightenColor[0]}, ${lightenColor[1]}, ${lightenColor[2]})`;
};

const getColor = (progress, color) => {
  const rgb = color.match(/\w\w/g).map((c) => parseInt(c, 16));
  const factor = 1 - Math.min(progress / 100, 1); // As progress increases, factor decreases

  const darkenColor = rgb.map((c) => Math.round(c * factor));

  return `rgb(${darkenColor[0]}, ${darkenColor[1]}, ${darkenColor[2]})`;
};

// Styled Components
const WorkTime = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background-color:#a7a4a4;
  // border-radius: 5px;
  overflow: hidden;
`;

const StyledProgressBar = styled.div`
  height: 100%;
  background-color: #a7a4a4;
`;

const ProgressText = styled.div`
  color: ${(props) => props.theme.textColor};
  margin-top: 10px;
`;

const WorkButton = styled(Button)`
  align-self: center;
  margin-top: 10px;
`;

// Timeline subcomponent
const Timeline = ({ todayAttendance, theme }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (todayAttendance && todayAttendance.clockinTime) {
      const updateProgress = () => {
        const now = moment();
        const clockin = moment(todayAttendance.clockinTime, "HH:mm:ss");
        let hoursWorked = todayAttendance.totalHours || 0;
        if (todayAttendance.clockoutTime) {
          const clockout = moment(todayAttendance.clockoutTime, "HH:mm:ss");
          hoursWorked = clockout.diff(clockin, "hours", true);
        } else {
          hoursWorked = now.diff(clockin, "hours", true);
        }
        setProgress((hoursWorked / 9) * 100); // Assuming 9 hours workday
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [todayAttendance]);

  const getProgressText = () => {
    if (progress === 0) {
      return todayAttendance && todayAttendance.clockoutTime
        ? "0%"
        : "Work just started (0%)";
    } else if (progress < 100) {
      return `${parseFloat(progress.toFixed(0))}% completed`;
    } else if (progress === 100) {
      return "Work completed (100%)";
    } else {
      return `${parseFloat(progress.toFixed(0))}% supercharged!`;
    }
  };

  return (
    <>
      <ProgressBarWrapper theme={theme}>
        <StyledProgressBar
          now={progress}
          style={{
            width: `${progress}%`,
            backgroundColor: getColor(progress, theme.progressColor),
            transition:
              "width 0.5s ease-in-out, background-color 0.5s ease-in-out",
          }}
        />
      </ProgressBarWrapper>
      <ProgressText theme={theme}>{getProgressText()}</ProgressText>
    </>
  );
};

// Custom Hooks
const useLocation = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [locationError, setLocationError] = useState("");

  const fetchUserLocation = async () => {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocationError("");
            resolve();
          },
          (error) => reject(error)
        );
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationError("Failed to fetch location. Please try again.");
    }
  };

  return { location, fetchUserLocation, locationError };
};

const useAttendance = () => {
  const [userId] = useState(JSON.parse(localStorage.getItem("user")).id || "");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [status] = useState("Present");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [incompleteAttendance, setIncompleteAttendance] = useState(null);

  const fetchAttendanceRecords = async (retries = 3) => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const response = await axios.get(
        `/api/attendance/recent/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAttendanceRecords(response.data || []);
      updateTodayAttendance(response.data);
      checkIncompleteAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} retries left)`);
        await new Promise((res) => setTimeout(res, 1000));
        await fetchAttendanceRecords(retries - 1);
      } else {
        console.log(
          "Failed to fetch attendance records after multiple attempts."
        );
      }
    }
  };

  const updateTodayAttendance = (records) => {
    const todayDate = moment().format("YYYY-MM-DD");
    const todayRecord = records.find(
      (record) => moment(record.date).format("YYYY-MM-DD") === todayDate
    );
    setTodayAttendance(todayRecord || null);
    setIsWorking(todayRecord && !todayRecord.clockoutTime);
  };

  const checkIncompleteAttendance = (records) => {
    const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const incompleteRecord = records.find(
      (record) =>
        moment(record.date).format("YYYY-MM-DD") === yesterdayDate &&
        !record.clockoutTime
    );
    setIncompleteAttendance(incompleteRecord || null);
  };

  const closeIncompleteAttendance = async () => {
    if (incompleteAttendance) {
      try {
        const endTimeString = "23:59:59";
        await axios.put(
          `api/attendance/clock-out`,
          {
            userId,
            date: incompleteAttendance.date,
            clockoutTime: endTimeString,
            latitudeClockout: null,
            longitudeClockout: null,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIncompleteAttendance(null);
        await fetchAttendanceRecords();
      } catch (error) {
        console.error("Error closing incomplete attendance:", error);
        throw error;
      }
    }
  };

  return {
    userId,
    date,
    status,
    attendanceRecords,
    todayAttendance,
    isWorking,
    incompleteAttendance,
    fetchAttendanceRecords,
    closeIncompleteAttendance,
    setIsWorking,
  };
};

// Main component
const LightweightStartWork = ({ theme }) => {
  const {
    userId,
    date,
    status,
    todayAttendance,
    isWorking,
    incompleteAttendance,
    fetchAttendanceRecords,
    closeIncompleteAttendance,
    setIsWorking,
  } = useAttendance();

  const { location, fetchUserLocation, locationError } = useLocation();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  useEffect(() => {
    if (incompleteAttendance) {
      closeIncompleteAttendance();
    }
  }, [incompleteAttendance]);

  const handleStartWork = async () => {
    try {
      await fetchUserLocation();
      if (locationError) return;

      const currentTime = moment();

      await axios.post(
        `/api/attendance/clock-in`,
        {
          userId,
          date,
          clockinTime: currentTime.format("HH:mm:ss"),
          latitudeClockin: location.latitude,
          longitudeClockin: location.longitude,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsWorking(true);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error starting work:", error);
    }
  };

  const handleEndWork = async () => {
    try {
      await fetchUserLocation();
      if (locationError) return;

      setShowModal(true);
    } catch (error) {
      console.error("Error ending work:", error);
    }
  };

  const confirmEndWork = async () => {
    try {
      await axios.put(
        `/api/attendance/clock-out`,
        {
          userId,
          date,
          clockoutTime: moment().format("HH:mm:ss"),
          latitudeClockout: location.latitude,
          longitudeClockout: location.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsWorking(false);
      setShowModal(false);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error confirming end work:", error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="shadow-sm"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}
      >
        <WorkContainer theme={theme}>
          <Header theme={theme}>Let's Get to Work</Header>
          <WorkTime theme={theme}>
            {isWorking ? moment().format("h:mm A") : "Not working"}
          </WorkTime>
          <Timeline todayAttendance={todayAttendance} theme={theme} />
          <WorkButton
            variant={isWorking ? "danger" : "success"}
            onClick={isWorking ? handleEndWork : handleStartWork}
          >
            {isWorking ? "End Work" : "Start Work"}
          </WorkButton>
        </WorkContainer>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm End Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to end work?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEndWork}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {locationError && (
        <Alert variant="danger" className="mt-2">
          {locationError}
        </Alert>
      )}
    </Container>
  );
};

// Provide a default theme if needed
LightweightStartWork.defaultProps = {
  theme: {
    topColor: "#a7a4a4", // Lime Green for top
    bottomColor: "#98FB98", // Pale Green for bottom
    textColor: "#000000", // Black text color
    progressColor: "#ffffff", // Lime Green for the progress bar
  },
};

export default LightweightStartWork;
