import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const AttendanceEditModal = ({ data, onHide, onSuccess, ...props }) => {
  const [attendance, setAttendance] = useState({
    id: null,
    status: "",
    clockinTime: "",
    clockoutTime: "",
    latitudeClockin: "",
    longitudeClockin: "",
    latitudeClockout: "",
    longitudeClockout: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setAttendance({
      id: data.id,
      status: data.status,
      clockinTime: data.clockinTime,
      clockoutTime: data.clockoutTime,
      latitudeClockin: data.latitudeClockin,
      longitudeClockin: data.longitudeClockin,
      latitudeClockout: data.latitudeClockout,
      longitudeClockout: data.longitudeClockout,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/attendance/${attendance.id}`,
        attendance,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDone(true);
      if (onSuccess) {
        onSuccess(); // Callback to handle success
      }
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Modal
      {...props}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Attendance
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Attendance updated successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="warning" className="m-1">
            {errorMsg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formStatus">
            <Form.Label className="mb-2 required">Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={attendance.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </Form.Control>
          </Form.Group>

          {attendance.status === "Present" && (
            <>
              <Form.Group controlId="formClockinTime">
                <Form.Label className="mb-2 required">Clock-in Time</Form.Label>
                <Form.Control
                  type="time"
                  name="clockinTime"
                  value={attendance.clockinTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formClockoutTime">
                <Form.Label className="mb-2 required">
                  Clock-out Time
                </Form.Label>
                <Form.Control
                  type="time"
                  name="clockoutTime"
                  value={attendance.clockoutTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLatitudeClockin">
                <Form.Label className="mb-2 required">
                  Clock-in Latitude
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="latitudeClockin"
                  value={attendance.latitudeClockin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLongitudeClockin">
                <Form.Label className="mb-2 required">
                  Clock-in Longitude
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="longitudeClockin"
                  value={attendance.longitudeClockin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLatitudeClockout">
                <Form.Label className="mb-2 required">
                  Clock-out Latitude
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="latitudeClockout"
                  value={attendance.latitudeClockout}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLongitudeClockout">
                <Form.Label className="mb-2 required">
                  Clock-out Longitude
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="longitudeClockout"
                  value={attendance.longitudeClockout}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}

          <Button variant="success" type="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceEditModal;
