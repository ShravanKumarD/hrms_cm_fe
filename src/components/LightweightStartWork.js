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
            setLocationError(""); // Clear any previous errors
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
        // Wait for a short period before retrying
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
  };
};

const WorkControls = ({
  isWorking,
  onStart,
  onEnd,
  todayAttendance,
  incompleteAttendance,
}) => (
  <div className="text-center mb-4">
    {!isWorking && (
      <Button
        variant="success"
        size="lg"
        onClick={onStart}
        disabled={todayAttendance && todayAttendance.clockoutTime}
      >
        <strong>
          {incompleteAttendance ? "Start New Work Day" : "Start Work"}
        </strong>
      </Button>
    )}
    {isWorking && (
      <Button variant="danger" size="lg" onClick={onEnd}>
        End Work
      </Button>
    )}
    {todayAttendance && todayAttendance.clockoutTime && (
      <div className="text-muted mt-2">
        You've already ended work for today.
      </div>
    )}
  </div>
);

const WorkTimes = ({ record }) => {
  if (!record) return null;
  const { clockinTime, clockoutTime, status } = record;
  const clockin = moment(clockinTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);
  const clockout = moment(clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);

  return (
    <div className="d-flex justify-content-between mx-3">
      {clockin && <div>{clockin.format("h:mm A")}</div>}
      {clockout && <div>{clockout.format("h:mm A")}</div>}
    </div>
  );
};

const Timeline = ({ todayAttendance }) => {
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

  if (!todayAttendance || !todayAttendance.clockinTime) return null;

  const getColor = (progress) => {
    if (progress > 100) {
      const red = Math.round(255 * (1 - progress / 200));
      const green = Math.round(255 * (progress / 200));
      return `rgb(${red}, ${green}, 0)`;
    }
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
        <div>
          {progress === 0
            ? todayAttendance.clockoutTime
              ? "0%"
              : "Work just started (0%)"
            : progress < 100
            ? `${parseFloat(progress.toFixed(2))}% completed`
            : progress === 100
            ? "Work completed (100%)"
            : `${parseFloat(progress.toFixed(2))}% supercharged!`}
        </div>
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
  const [currentTime, setCurrentTime] = useState(new Date());
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
    isWorking,
    incompleteAttendance,
    fetchAttendanceRecords,
    closeIncompleteAttendance,
  } = useAttendance();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUserLocation();
    fetchAttendanceRecords().catch((err) =>
      setError("Failed to fetch attendance records")
    );
  }, []);

  const handleStart = async () => {
    if (incompleteAttendance) {
      try {
        await closeIncompleteAttendance();
        setError("Previous day's work session has been closed automatically.");
      } catch (error) {
        setError("Failed to close previous work session. Please try again.");
        return;
      }
    }

    if (todayAttendance && todayAttendance.clockoutTime) {
      setError("You've already ended work for today. You cannot start again.");
      return;
    }

    try {
      const start = new Date();
      const timeString = moment(start).format("HH:mm:ss");

      axios.defaults.baseURL = API_BASE_URL;
      await axios.post(
        "/api/attendance/clock-in",
        {
          userId,
          date,
          status,
          clockinTime: timeString,
          latitudeClockin: location.latitude ? location.latitude : null,
          longitudeClockin: location.longitude ? location.longitude : null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error marking start time:", error);
      setError("Failed to start work. Please try again.");
    }
  };

  const handleEnd = () => {
    setModal({ show: true, action: "end" });
  };

  const handleConfirmEnd = async () => {
    try {
      const end = new Date();
      const endTimeString = moment(end).format("HH:mm:ss");

      axios.defaults.baseURL = API_BASE_URL;
      await axios.put(
        `api/attendance/clock-out`,
        {
          userId,
          date,
          clockoutTime: endTimeString,
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

  return (
    <Container
      className="my-5"
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <Card className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Let's get to Work</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {incompleteAttendance && (
          <Alert variant="warning">
            You have an incomplete work session from yesterday. It will be
            automatically closed when you start today's work.
          </Alert>
        )}
        <WorkControls
          isWorking={isWorking}
          onStart={handleStart}
          onEnd={handleEnd}
          todayAttendance={todayAttendance}
          incompleteAttendance={incompleteAttendance}
        />
        <WorkTimes record={todayAttendance} />
        <Timeline todayAttendance={todayAttendance} />
      </Card>
      <ConfirmationModal
        show={modal.show}
        onHide={handleCloseModal}
        onConfirm={handleConfirmEnd}
        totalTime={todayAttendance?.totalHours || 0}
      />
    </Container>
  );
};

export default LightweightStartWork;
