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
import "../startwork.css";
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
  <div className="text-center mb-3">
    {!isWorking && (
      <Button
        variant="success"
        size="sm"
        onClick={onStart}
        disabled={todayAttendance && todayAttendance.clockoutTime}
      >
        <strong>
          {incompleteAttendance ? "Start New Work Day" : "Start Work"}
        </strong>
      </Button>
    )}
    {isWorking && (
      <Button variant="danger" size="sm" onClick={onEnd}>
        End Work
      </Button>
    )}
    {todayAttendance && todayAttendance.clockoutTime && (
      <div className="text-muted mt-2" style={{ fontSize: "0.7rem" }}>
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
    <div
      className="d-flex justify-content-between mx-2"
      style={{ fontSize: "0.7rem" }}
    >
      {clockin && <div>{clockin.format("h:mm A")}</div>}
      {clockout && clockout.isValid() && <div>{clockout.format("h:mm A")}</div>}
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
    <div className="container mt-3">
      <div
        style={{
          height: "20px",
          borderRadius: "10px",
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
      <div className="text-center mt-2" style={{ fontSize: "0.7rem" }}>
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
  <Modal show={show} onHide={onHide} size="sm">
    <Modal.Header closeButton>
      <Modal.Title style={{ fontSize: "1rem" }}>Confirm End Work</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p style={{ fontSize: "0.7rem" }}>
        Are you sure you want to end work now? You've worked a total of{" "}
        <strong>{totalTime}</strong>.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" size="sm" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="primary" size="sm" onClick={onConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

const StartWork = () => {
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

  const { location, fetchUserLocation, locationError } = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [totalTime, setTotalTime] = useState("0 hours");

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

      await axios.post(
        `/api/attendance/clock-in`,
        {
          userId,
          date,
          clockinTime: moment().format("HH:mm:ss"),
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

      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error starting work:", error);
    }
  };

  const handleEndWork = async () => {
    try {
      await fetchUserLocation();
      if (locationError) return;

      const startTime = moment(todayAttendance.clockinTime, "HH:mm:ss");
      const endTime = moment();
      const totalWorkTime = moment.duration(endTime.diff(startTime));
      setTotalTime(
        `${Math.floor(
          totalWorkTime.asHours()
        )} hours ${totalWorkTime.minutes()} minutes`
      );

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

      await fetchAttendanceRecords();
      setShowModal(false);
    } catch (error) {
      console.error("Error confirming end work:", error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center mt-4"
    >
      <Card
        className="shadow-sm"
        style={{
          maxWidth: "400px",
          width: "100%",
          fontSize: "0.95rem",
          borderRadius: "10px", // Added border radius
        }}
      >
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "15px",
            paddingRight: "15px",
            paddingBottom: "15px",
            borderRadius: "10px", // Added border radius
          }}
        >
          {/* <div className="text-center mb-3" style={{ fontSize: "1rem" }}>
            {moment().format("MMMM Do YYYY")}
          </div> */}
          <WorkControls
            isWorking={isWorking}
            onStart={handleStartWork}
            onEnd={handleEndWork}
            todayAttendance={todayAttendance}
            incompleteAttendance={incompleteAttendance}
          />
          <WorkTimes record={todayAttendance} />
          {locationError && (
            <Alert variant="danger" className="mt-2">
              {locationError}
            </Alert>
          )}
          <Timeline todayAttendance={todayAttendance} />
        </div>
      </Card>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmEndWork}
        totalTime={totalTime}
      />
    </Container>
  );
};

export default StartWork;
