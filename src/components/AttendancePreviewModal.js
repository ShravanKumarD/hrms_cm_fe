import React, { useEffect, useRef } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import moment from "moment";

const AttendancePreviewModal = ({ show, onHide, data }) => {
  const mapInRef = useRef(null);
  const mapOutRef = useRef(null);

  const calculateWorkDuration = () => {
    if (!data.clockinTime || !data.clockoutTime) return 0;
    const clockIn = moment(data.clockinTime, "h:mm A");
    const clockOut = moment(data.clockoutTime, "h:mm A");
    return clockOut.diff(clockIn, "hours", true);
  };

  const workDuration = calculateWorkDuration();
  const timelineColor = workDuration >= 9 ? "#4CAF50" : "#FFA500";

  useEffect(() => {
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) {
          resolve(window.L);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadLeafletCss = () => {
      return new Promise((resolve) => {
        if (
          document.querySelector(
            'link[href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"]'
          )
        ) {
          resolve();
          return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
        link.onload = resolve;
        document.head.appendChild(link);
      });
    };

    const initMaps = (L) => {
      if (data.latitudeClockin && data.longitudeClockin) {
        mapInRef.current = L.map("mapClockIn").setView(
          [data.latitudeClockin, data.longitudeClockin],
          18
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          mapInRef.current
        );
        L.marker([data.latitudeClockin, data.longitudeClockin]).addTo(
          mapInRef.current
        );
      }

      if (data.latitudeClockout && data.longitudeClockout) {
        mapOutRef.current = L.map("mapClockOut").setView(
          [data.latitudeClockout, data.longitudeClockout],
          18
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          mapOutRef.current
        );
        L.marker([data.latitudeClockout, data.longitudeClockout]).addTo(
          mapOutRef.current
        );
      }
    };

    if (show && data) {
      Promise.all([loadLeafletCss(), loadLeaflet()])
        .then(([_, L]) => initMaps(L))
        .catch((err) => console.error("Error loading Leaflet:", err));
    }

    // Cleanup function
    return () => {
      if (mapInRef.current) {
        mapInRef.current.remove();
      }
      if (mapOutRef.current) {
        mapOutRef.current.remove();
      }
      const script = document.querySelector(
        'script[src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [show, data]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Attendance Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <>
            <Row>
              <Col md={6}>
                <h5>Employee Details</h5>
                <p>
                  <strong>Name:</strong> {data.user.fullName}
                </p>
                <p>
                  <strong>User ID:</strong> {data.userId}
                </p>
                <p>
                  <strong>Date:</strong> {data.date}
                </p>
                <p>
                  <strong>Status:</strong> {data.status}
                </p>
              </Col>
              <Col md={6}>
                <h5>Time Information</h5>
                <p>
                  <strong>Clock In:</strong> {data.clockinTime}
                </p>
                <p>
                  <strong>Clock Out:</strong> {data.clockoutTime}
                </p>
                <p>
                  <strong>Work Duration:</strong> {workDuration.toFixed(2)}{" "}
                  hours
                </p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <h5>Timeline (9-hour workday)</h5>
                <div
                  style={{
                    position: "relative",
                    height: "50px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "25px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      height: "100%",
                      width: `${(workDuration / 9) * 100}%`,
                      maxWidth: "100%",
                      backgroundColor: timelineColor,
                      borderRadius: "25px",
                    }}
                  ></div>
                  <span
                    style={{
                      position: "absolute",
                      left: "5px",
                      top: "15px",
                      zIndex: 1,
                      color: workDuration > 1 ? "white" : "black",
                    }}
                  >
                    {data.clockinTime}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "15px",
                      zIndex: 1,
                      color: workDuration > 8 ? "white" : "black",
                    }}
                  >
                    {data.clockoutTime}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <h5>Clock In Location</h5>
                <div id="mapClockIn" style={{ height: "200px" }}></div>
              </Col>
              <Col md={6}>
                <h5>Clock Out Location</h5>
                <div id="mapClockOut" style={{ height: "200px" }}></div>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendancePreviewModal;
