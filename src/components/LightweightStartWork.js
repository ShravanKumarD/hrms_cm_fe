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
import "./startwork.css";
import API_BASE_URL from "../env";

// Custom Hooks
const useLocation = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => console.error("Error fetching location:", error)
    );
  };

  return { location, fetchUserLocation };
};

const useAttendance = () => {
  const [userId] = useState(JSON.parse(localStorage.getItem("user")).id || "");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [status] = useState("Present");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);

  const fetchAttendanceRecords = async () => {
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
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      throw error;
    }
  };

  const updateTodayAttendance = (records) => {
    const todayDate = moment().format("YYYY-MM-DD");
    const todayRecord = records.find(
      (record) => moment(record.date).format("YYYY-MM-DD") === todayDate
    );
    setTodayAttendance(todayRecord || null);
  };

  return {
    userId,
    date,
    status,
    attendanceRecords,
    todayAttendance,
    fetchAttendanceRecords,
  };
};

const WorkControls = ({
  isStarted,
  onStart,
  onEnd,
  canStartWork,
  canEndWork,
}) => (
  <div className="text-center mb-4">
    {!isStarted && canStartWork && (
      <Button variant="success" size="lg" onClick={onStart}>
        <strong>Start Work</strong>
      </Button>
    )}
    {isStarted && canEndWork && (
      <Button variant="danger" size="lg" onClick={onEnd}>
        End Work
      </Button>
    )}
  </div>
);

const WorkTimes = ({ startTime, endTime }) => (
  <>
    {startTime && (
      <div className="text-center mb-4">
        <h4>Work started at: {startTime.toLocaleTimeString()}</h4>
      </div>
    )}
    {endTime && (
      <div className="text-center mb-4">
        <h4>Work ended at: {endTime.toLocaleTimeString()}</h4>
      </div>
    )}
  </>
);

const Timeline = ({ todayAttendance }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(todayAttendance);
    if (
      todayAttendance &&
      todayAttendance.clockinTime &&
      todayAttendance.clockoutTime
    ) {
      const updateProgress = () => {
        const hoursWorked = todayAttendance.totalHours || 0;
        console.log(hoursWorked + " hours worked");

        setProgress((hoursWorked / 9) * 100); // Assuming 9 hours workday
      };

      updateProgress();

      console.log("Progress:" + progress);

      const interval = setInterval(updateProgress, 60000); // Update every minute

      return () => clearInterval(interval);
    } else if (
      todayAttendance &&
      todayAttendance.clockinTime &&
      !todayAttendance.clockoutTime
    ) {
      const updateProgress = () => {
        console.log(todayAttendance.clockinTime, "clockinMoment"); // 11:46:38
        const timeString = todayAttendance.clockinTime;
        // now in moment - clockinTime (11:46:38) = hoursWorked
        console.log(moment(), "rn");
        const hoursWorked = moment().diff(
          moment(timeString, "HH:mm:ss"),
          "hours",
          true
        );

        console.log(hoursWorked + " hours worked");

        setProgress((hoursWorked / 9) * 100); // Assuming 9 hours workday
      };

      updateProgress();

      console.log("Progress:" + progress);

      const interval = setInterval(updateProgress, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [todayAttendance, progress]);

  if (!todayAttendance || !todayAttendance.clockinTime) return null;

  // Function to calculate color based on progress
  const getColor = (progress) => {
    const red = Math.round(255 * (1 - progress / 100));
    const green = Math.round(255 * (progress / 100));
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          height: "28px",
          borderRadius: "13px",
          backgroundColor: "#e9ecef",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: getColor(progress),
            transition:
              "width 0.5s ease-in-out, background-color 0.5s ease-in-out",
          }}
        />
      </div>
      <div className="text-center mt-3">
        <h5>
          {progress === 0
            ? todayAttendance.clockoutTime
              ? "0%"
              : "Work just started (0%)"
            : progress === 100
            ? "Full Day"
            : `${Math.floor(progress)}% of workday completed`}
        </h5>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ show, onHide, onConfirm, totalTime }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm End Work</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to end work? Your total work time today is{" "}
      <strong>{totalTime} hours</strong>.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

// Main Component
const LightweightStartWork = () => {
  const [workState, setWorkState] = useState({
    startTime: null,
    endTime: null,
    isStarted: false,
    totalTime: 0,
  });
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ show: false, action: "" });

  const { location, fetchUserLocation } = useLocation();
  const {
    userId,
    date,
    status,
    attendanceRecords,
    todayAttendance,
    fetchAttendanceRecords,
  } = useAttendance();

  useEffect(() => {
    fetchUserLocation();
    loadSavedWorkState();
    fetchAttendanceRecords().catch((err) =>
      setError("Failed to fetch attendance records")
    );
  }, []);

  const loadSavedWorkState = () => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedIsStarted = localStorage.getItem("isStarted") === "true";
    if (savedStartTime) {
      setWorkState({
        ...workState,
        startTime: new Date(savedStartTime),
        isStarted: savedIsStarted,
      });
    }
  };

  const handleStart = async () => {
    try {
      const start = new Date();
      const dateString = moment(start).format("YYYY-MM-DD HH:mm:ss");
      const timeString = moment(start).format("HH:mm:ss");
      setWorkState({ ...workState, startTime: start, isStarted: true });
      localStorage.setItem("startTime", start.toISOString());
      localStorage.setItem("isStarted", "true");

      axios.defaults.baseURL = API_BASE_URL;
      const response = await axios.post(
        "/api/attendance/clock-in",
        {
          userId,
          date,
          status,
          clockinTime: timeString,
          latitudeClockin: location.latitude,
          longitudeClockin: location.longitude,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.setItem("attendanceId", response.data.attendanceId);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error marking start time:", error);
      setError("Failed to start work. Please try again.");
    }
  };

  const handleEnd = () => {
    const end = new Date();
    const duration = (end - workState.startTime) / 1000 / 60 / 60; // Duration in hours
    setWorkState({
      ...workState,
      endTime: end,
      totalTime: duration.toFixed(2),
    });
    setModal({ show: true, action: "end" });
  };

  const handleConfirmEnd = async () => {
    try {
      const end = new Date();
      const dateString = moment(end).format("YYYY-MM-DD HH:mm:ss");
      const timeString = moment(end).format("HH:mm:ss");
      setWorkState({ ...workState, endTime: end, isStarted: false });
      localStorage.removeItem("startTime");
      localStorage.removeItem("isStarted");

      axios.defaults.baseURL = API_BASE_URL;
      await axios.put(
        `api/attendance/clock-out`,
        {
          userId,
          date,
          clockoutTime: timeString,
          latitudeClockout: location.latitude,
          longitudeClockout: location.longitude,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error marking end time:", error);
      setError("Failed to end work. Please try again.");
    }
    handleCloseModal();
  };

  const handleCloseModal = () => setModal({ ...modal, show: false });

  const canStartWork = !todayAttendance || !todayAttendance.clockoutTime;
  const canEndWork =
    workState.isStarted && (!todayAttendance || !todayAttendance.clockoutTime);

  return (
    <Container
      className="my-5"
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <Card className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Start Work</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <WorkControls
          isStarted={workState.isStarted}
          onStart={handleStart}
          onEnd={handleEnd}
          canStartWork={canStartWork}
          canEndWork={canEndWork}
        />
        <WorkTimes
          startTime={workState.startTime}
          endTime={workState.endTime}
        />
        <Timeline todayAttendance={todayAttendance} />
      </Card>
      <ConfirmationModal
        show={modal.show}
        onHide={handleCloseModal}
        onConfirm={handleConfirmEnd}
        totalTime={workState.totalTime}
      />
    </Container>
  );
};

export default LightweightStartWork;
