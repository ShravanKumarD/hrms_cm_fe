import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import "./startwork.css";
import API_BASE_URL from "../env";

const quotes = [
  {
    author: "Albert Einstein",
    quote:
      "It's not that I'm so smart, it's just that I stay with problems longer.",
  },
  {
    author: "Bill Gates",
    quote: "Your most unhappy customers are your greatest source of learning.",
  },
  {
    author: "Thomas Edison",
    quote:
      "Genius is one percent inspiration and ninety-nine percent perspiration.",
  },
  {
    author: "Isaac Newton",
    quote:
      "If I have seen further, it is by standing on the shoulders of Giants.",
  },
  {
    author: "Elon Musk",
    quote:
      "When something is important enough, you do it even if the odds are not in your favor.",
  },
  {
    author: "Jeff Bezos",
    quote: "We are stubborn on vision. We are flexible on details.",
  },
  {
    author: "Walt Disney",
    quote: "The way to get started is to quit talking and begin doing.",
  },
];

const StartWork = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user")).id || ""
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Present");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [flag, setFlag] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedIsStarted = localStorage.getItem("isStarted") === "true";
    const savedEndTime = localStorage.getItem("endTime");

    if (savedStartTime) {
      setStartTime(new Date(savedStartTime));
      setIsStarted(savedIsStarted);
    }

    if (savedEndTime) {
      const endTime = new Date(savedEndTime);
      const currentTime = new Date();
      const hoursDiff = Math.abs(currentTime - endTime) / 36e5;

      if (hoursDiff < 6) {
        setIsDisabled(true);
        // alert('wait until 6 hours to start work or contact manger')
      } else {
        setIsDisabled(false);
      }
    }
  }, []);

  const handleStart = async () => {
    const start = new Date();
    const dateString = moment(start).format("YYYY-MM-DD HH:mm:ss");
    setStartTime(start);
    setIsStarted(true);
    localStorage.setItem("startTime", start.toISOString());
    localStorage.setItem("isStarted", "true");

    try {
      axios.defaults.baseURL = API_BASE_URL;
      const response = await axios.post(
        "/api/attendance/clock-in",
        {
          userId,
          date,
          status,
          clockinTime: dateString,
          latitudeClockin: latitude,
          longitudeClockin: longitude,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.setItem("attendanceId", response.data.attendanceId);
    } catch (error) {
      console.error("There was an error marking the start time!", error);
    }
  };

  const handleEnd = () => {
    const end = new Date();
    const duration = (end - startTime) / 1000 / 60 / 60; // Duration in hours
    setTotalTime(duration.toFixed(2));
    setEndTime(end);
    setIsStarted(false);
    setModalAction("end");
    setShowModal(true);
  };

  const handleConfirmEnd = async () => {
    const end = new Date();
    const dateString = moment(end).format("YYYY-MM-DD HH:mm:ss");
    setEndTime(end);
    setIsStarted(false);
    localStorage.removeItem("startTime");
    localStorage.removeItem("isStarted");
    localStorage.setItem("endTime", end.toISOString());

    try {
      axios.defaults.baseURL = API_BASE_URL;
      await axios.put(
        `api/attendance/clock-out`,
        {
          userId,
          date,
          clockoutTime: dateString,
          latitudeClockout: latitude,
          longitudeClockout: longitude,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFlag(true);
    } catch (error) {
      console.error("There was an error marking the end time!", error);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container my-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Start Work</h2>
        <div className="text-center mb-4">
          <h3 className="display-4">
            Current Time:<strong>{currentTime.toLocaleTimeString()}</strong>
          </h3>
        </div>
        <div className="quote-scroller">
          <blockquote className="quote-content">
            <p>
              {quotes[currentIndex].quote} —{" "}
              <span>{quotes[currentIndex].author}</span>
            </p>
          </blockquote>
        </div>
        <br />
        <div className="text-center mb-4">
          {!isStarted ? (
            <button
              className="btn btn-success btn-lg"
              onClick={handleStart}
              disabled={isDisabled}
            >
              <strong>Start Work</strong>
            </button>
          ) : flag ? (
            <div></div>
          ) : (
            <button className="btn btn-danger btn-lg" onClick={handleEnd}>
              End Work
            </button>
          )}
        </div>

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
        <Timeline isStarted={isStarted} startTime={startTime} />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm End Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to end work? Your total work time today is{" "}
          <strong>{totalTime} hours</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmEnd}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const Timeline = ({ isStarted, startTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isStarted && startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = now - new Date(startTime);
        const percent = (elapsed / (1000 * 60 * 60 * 8)) * 100; // 8 hours workday
        setProgress(Math.min(percent, 100));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStarted, startTime]);

  return (
    <div className="container mt-4">
      <div
        className="progress"
        style={{
          height: "25px",
          width: "80%",
          margin: "0 auto",
          borderRadius: "10px",
        }}
      >
        <div
          className={`progress-bar progress-bar-striped ${
            progress === 100 ? "bg-success" : "bg-warning"
          }`}
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div className="text-center mt-3">
        <h5>
          {progress === 100 ? "Full Day" : `${Math.floor(progress)}% Completed`}
        </h5>
      </div>
    </div>
  );
};

export default StartWork;
