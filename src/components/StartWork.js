import React, { useState, useEffect } from "react";
import axios from "axios";

const StartWork = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem("user")).id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Present");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    };

    fetchUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStart = async () => {
    const start = new Date();
    console.log(start)
    const timeZoneOffset = start.getTimezoneOffset();
    setStartTime(start);
    setIsStarted(true);
    try {
      const response = await axios.post(
        "http://localhost:80/api/attendance/clock-in",
        {
          userId:userId,
          date,
          status,
          clockinTime: timeZoneOffset,
          latitudeClockin:latitude,
          longitudeClockin:longitude,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response,"dwgydgweu");
      localStorage.setItem("attendanceId", response.data.attendanceId); // Assuming the response contains the attendanceId
    } catch (error) {
      console.error("There was an error marking the start time!", error);
    }
  };

  const handleEnd = async () => {
    const end = new Date();
    setEndTime(end);
    setIsStarted(false);

let x = localStorage.getItem("userId")
console.log(userId,"aatid")
    try {
      const response = await axios.put(
        `http://localhost:80/api/attendance/clock-out`,
        {
          userId,
          date,
          clockoutTime: end.toISOString(),
          latitudeClockout:latitude,
          longitudeClockout:longitude
        },
        {
          headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
        }
      );
      console.log(response,"res");
    } catch (error) {
      console.error("There was an error marking the end time!", error);
    }
  };

  return (
    // <div>
    //   <h2>Start Work</h2>
    //   <div>
    //     <h3>Current Time: {currentTime.toLocaleTimeString()}</h3>
    //   </div>
    //   <div>
    //     {!isStarted ? (
    //       <button onClick={handleStart}>Start Work</button>
    //     ) : (
    //       <button onClick={handleEnd}>End Work</button>
    //     )}
    //   </div>
    //   {startTime && (
    //     <div>
    //       <h4>Work started at: {startTime.toLocaleTimeString()}</h4>
    //     </div>
    //   )}
    //   {endTime && (
    //     <div>
    //       <h4>Work ended at: {endTime.toLocaleTimeString()}</h4>
    //     </div>
    //   )}
    //   <Timeline isStarted={isStarted} startTime={startTime} />
    // </div>
    <div className="container my-5">
    <div className="card p-4 shadow-lg">
      <h2 className="text-center mb-4">Start Work</h2>
      <div className="text-center mb-4">
        <h3 className="display-4 animate__animated animate__pulse animate__infinite">
          Current Time: {currentTime.toLocaleTimeString()}
        </h3>
      </div>
      <div className="text-center mb-4">
        {!isStarted ? (
          <button className="btn btn-success btn-lg animate__animated animate__fadeIn" onClick={handleStart}>
            Start Work
          </button>
        ) : (
          <button className="btn btn-danger btn-lg animate__animated animate__fadeIn" onClick={handleEnd}>
            End Work
          </button>
        )}
      </div>
      {startTime && (
        <div className="text-center mb-4">
          <h4 className="animate__animated animate__fadeInUp">Work started at: {startTime.toLocaleTimeString()}</h4>
        </div>
      )}
      {endTime && (
        <div className="text-center mb-4">
          <h4 className="animate__animated animate__fadeInUp">Work ended at: {endTime.toLocaleTimeString()}</h4>
        </div>
      )}
    </div>
    <Timeline isStarted={isStarted} startTime={startTime} />
  </div>
  );
};

const Timeline = ({ isStarted, startTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    if (isStarted && startTime) {
      const interval = setInterval(() => {
        if (isMounted) {
          const now = new Date();
          const elapsed = now - new Date(startTime);
          const percent = (elapsed / (1000 * 60 * 60 * 8)) * 100; // 8 hours work day
          setProgress(Math.min(percent, 100));
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }
  }, [isStarted, startTime]);

  return (
    // <div style={{ marginTop: "20px" }}>
    //   <div
    //     style={{
    //       width: "80%",
    //       height: "30px",
    //       backgroundColor: "#ddd",
    //     }}
    //   >
    //     <div
    //       style={{
    //         width: `${progress}%`,
    //         height: "100%",
    //         backgroundColor: progress === 100 ? "green" : "orange",
    //       }}
    //     ></div>
    //   </div>
    //   <div style={{ textAlign: "center", marginTop: "10px" }}>
    //     {progress === 100 ? "Full Day" : `${Math.floor(progress)}% Completed`}
    //   </div>
    // </div>
    <div className="container mt-4">
    <div className="progress" style={{ height: "25px", width: "80%", margin: "0 auto",borderRadius:"10px" }}>
      <div
        className={`progress-bar progress-bar-striped ${progress === 100 ? 'bg-success' : 'bg-warning'}`}
        role="progressbar"
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <div className="text-center mt-3">
      <h5 className={`animate__animated ${progress === 100 ? 'animate__bounceIn' : 'animate__fadeIn'}`}>
        {progress === 100 ? "Full Day" : `${Math.floor(progress)}% Completed`}
      </h5>
    </div>
  </div>
  );
};

export default StartWork;
