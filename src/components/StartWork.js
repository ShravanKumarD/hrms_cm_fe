import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Container,
  Card,
  Alert,
  Button,
  Modal,
  Table,
  ProgressBar,
} from "react-bootstrap";
import "./startwork.css";
import API_BASE_URL from "../env";
import { quotes } from "../constants/quotes";

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

// Subcomponents
const CurrentTimeDisplay = ({ currentTime }) => (
  <div className="text-center mb-4">
    <h3 className="display-4" style={{ fontSize: "1.5rem" }}>
      Current Time:
      <strong>
        {currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })}
      </strong>
    </h3>
  </div>
);

const QuoteScroller = ({ quote }) => (
  <div className="quote-scroller">
    <blockquote className="quote-content">
      <p>
        {quote.quote} — <span>{quote.author}</span>
      </p>
    </blockquote>
  </div>
);

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

const WorkTimes = ({ record }) => {
  if (!record) return null;
  const { clockinTime, clockoutTime, status } = record;
  // it can be in YYYY-MM-DD HH:mm:ss format or HH:mm:ss format
  const clockin = moment(clockinTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);
  const clockout = moment(clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);
  console.log(clockin);

  return (
    <div className="d-flex justify-content-between mx-3">
      {clockin && <div>{clockin.format("h:mm A")}</div>}
      {clockout && <div>{clockout.format("h:mm A")}</div>}
    </div>
  );
};

const AttendanceTable = ({ records, date }) => {
  return (
    <div className="mt-4">
      <h4>Recent Attendance Records</h4>
      <Table bordered hover responsive>
        {/* <thead>
          <tr> */}
        {/* <th>ID</th> */}
        {/* <th>Date</th> */}
        {/* <th>Day</th>
            <th>Clock In Time</th>
            <th>Clock Out Time</th>
            <th>Status</th>
          </tr>
        </thead> */}
        <tbody>
          {records.length > 0 ? (
            records
              .slice() // Create a shallow copy of the array
              .reverse() // Reverse the order of the records
              .map((record) => (
                <tr key={record.id}>
                  {/* <td>{record.id}</td> */}
                  {/* <td>{moment(record.date).format("Do MMM YYYY")}</td> */}
                  {/* need date dd also */}
                  <td>{moment(record.date).format("D MMM  -  dddd")}</td>
                  <td>
                    {record.status === "Absent"
                      ? ""
                      : moment(record.clockinTime, [
                          "YYYY-MM-DD HH:mm:ss",
                          "HH:mm:ss",
                        ]).format("h:mm a")}
                  </td>
                  <td>
                    {record.status === "Absent"
                      ? ""
                      : record.clockoutTime
                      ? moment(record.clockoutTime, [
                          "YYYY-MM-DD HH:mm:ss",
                          "HH:mm:ss",
                        ]).format("h:mm a")
                      : "Not yet clocked out"}
                  </td>
                  <td>{record.status}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5">No records found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

const TodayAttendance = ({ record }) => {
  if (!record) return null;
  const { clockinTime, clockoutTime, status } = record;
  // it can be in YYYY-MM-DD HH:mm:ss format or HH:mm:ss format
  const clockin = moment(clockinTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);
  const clockout = moment(clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]);

  return (
    <div className="mt-4">
      <h4>Today's Attendance Record</h4>
      <Table bordered hover responsive>
        {/* <thead>
          <tr> */}
        {/* <th>ID</th> */}
        {/* i need day instead of Date */}
        {/* <th>Date</th> */}
        {/* <th>Day</th>
            <th>Clock In Time</th>
            <th>Clock Out Time</th>
            <th>Status</th>
          </tr>
        </thead> */}
        <tbody>
          <tr key={record.id}>
            {/* <td>{record.id}</td> */}
            {/* <td>{moment(record.date).format("Do MMM YYYY")}</td> */}
            <td>{moment(record.date).format("D MMM  -  dddd")}</td>
            <td>{status === "Absent" ? "" : clockin.format("h:mm A")}</td>
            <td>
              {status === "Absent"
                ? ""
                : record.clockoutTime
                ? clockout.format("h:mm A")
                : "Not yet clocked out"}
            </td>
            <td>{record.status}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const Timeline = ({ todayAttendance }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(todayAttendance);
    if (todayAttendance && todayAttendance.clockinTime) {
      // start time: 05:00:19
      // end time = now
      // total hours = end - start
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
        console.log(hoursWorked + " hours worked");

        setProgress((hoursWorked / 9) * 100); // Assuming 9 hours workday
      };

      updateProgress();

      console.log("Progress:" + progress);

      const interval = setInterval(updateProgress, 1000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [todayAttendance]);

  if (!todayAttendance || !todayAttendance.clockinTime) return null;

  // Function to calculate color based on progress
  const getColor = (progress) => {
    if (progress > 100) {
      // need to color green to black on 200%;
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
const StartWork = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workState, setWorkState] = useState({
    startTime: null,
    endTime: null,
    isStarted: false,
    totalTime: 0,
  });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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
      const timeString = moment(start).format("HH:mm:ss"); // Get the current time
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
    setModal({ show: true, action: "end" });
  };

  const handleConfirmEnd = async () => {
    try {
      const end = new Date();
      const dateString = moment(end).format("YYYY-MM-DD HH:mm:ss");
      const endTimeString = moment(end).format("HH:mm:ss");
      setWorkState({ ...workState, endTime: endTimeString, isStarted: false });
      localStorage.removeItem("startTime");
      localStorage.removeItem("isStarted");

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

  const canStartWork = !todayAttendance || !todayAttendance.clockoutTime;
  const canEndWork =
    workState.isStarted && (!todayAttendance || !todayAttendance.clockoutTime);

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center mb-4">Let's get to Work</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {/* <CurrentTimeDisplay currentTime={currentTime} /> */}
        <QuoteScroller quote={quotes[currentQuoteIndex]} />
        <WorkControls
          isStarted={workState.isStarted}
          onStart={handleStart}
          onEnd={handleEnd}
          canStartWork={canStartWork}
          canEndWork={canEndWork}
        />
        <WorkTimes record={todayAttendance} />
        <Timeline todayAttendance={todayAttendance} />
        <TodayAttendance record={todayAttendance} />
        <AttendanceTable records={attendanceRecords} date={date} />
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

export default StartWork;
