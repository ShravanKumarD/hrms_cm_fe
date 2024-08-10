import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const AttendanceAdd = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("");
  const [clockinTime, setClockinTime] = useState("09:30");
  const [clockoutTime, setClockoutTime] = useState("18:30");
  const [latitudeClockin, setLatitudeClockin] = useState("17.4536");
  const [longitudeClockin, setLongitudeClockin] = useState("78.3702");
  const [latitudeClockout, setLatitudeClockout] = useState("17.4536");
  const [longitudeClockout, setLongitudeClockout] = useState("78.3702");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case "status":
        setStatus(value);
        break;
      case "clockinTime":
        setClockinTime(value);
        break;
      case "clockoutTime":
        setClockoutTime(value);
        break;
      case "latitudeClockin":
        setLatitudeClockin(value);
        break;
      case "longitudeClockin":
        setLongitudeClockin(value);
        break;
      case "latitudeClockout":
        setLatitudeClockout(value);
        break;
      case "longitudeClockout":
        setLongitudeClockout(value);
        break;
      default:
        break;
    }
  };

  const pushUsers = () => {
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.fullName}
      </option>
    ));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const attendance = {
      userId: selectedUser,
      date,
      status,
      clockinTime: status === "Present" ? clockinTime : null,
      latitudeClockin: status === "Present" ? latitudeClockin : null,
      longitudeClockin: status === "Present" ? longitudeClockin : null,
      clockoutTime: status === "Present" ? clockoutTime : null,
      latitudeClockout: status === "Present" ? latitudeClockout : null,
      longitudeClockout: status === "Present" ? longitudeClockout : null,
    };

    try {
      axios.defaults.baseURL = API_BASE_URL;
      await axios.post("/api/attendance/mark", attendance, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDone(true);
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Attendance
        </Modal.Title>
      </Modal.Header>
      {showAlert && (
        <Alert variant="warning" className="m-1">
          {errorMsg}
        </Alert>
      )}
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label className="mb-2 required">Select Employee</Form.Label>
            <Form.Control
              as="select"
              className="form-control"
              value={selectedUser || ""}
              onChange={onUserChange}
              required
            >
              <option value="">Choose one...</option>
              {pushUsers()}
            </Form.Control>
          </Form.Group>
          {done && <Redirect to="/attendance-list" />}
          <Form.Group controlId="formDate">
            <Form.Label className="mb-2 required">Date</Form.Label>
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select Date"
              autoComplete="off"
              // need month and year also
              showMonthDropdown
              showYearDropdown
              required
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label className="mb-2 required">Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status...</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </Form.Control>
          </Form.Group>

          {status === "Present" && (
            <>
              <Form.Group controlId="formClockinTime">
                <Form.Label className="mb-2 required">Clock-in Time</Form.Label>
                <Form.Control
                  type="time"
                  name="clockinTime"
                  value={clockinTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLatitudeClockin">
                <Form.Label className="mb-2 required">
                  Clock-in Latitude
                </Form.Label>
                <Form.Control
                  type="text"
                  name="latitudeClockin"
                  value={latitudeClockin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLongitudeClockin">
                <Form.Label className="mb-2 required">
                  Clock-in Longitude
                </Form.Label>
                <Form.Control
                  type="text"
                  name="longitudeClockin"
                  value={longitudeClockin}
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
                  value={clockoutTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLatitudeClockout">
                <Form.Label className="mb-2 required">
                  Clock-out Latitude
                </Form.Label>
                <Form.Control
                  type="text"
                  name="latitudeClockout"
                  value={latitudeClockout}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLongitudeClockout">
                <Form.Label className="mb-2 required">
                  Clock-out Longitude
                </Form.Label>
                <Form.Control
                  type="text"
                  name="longitudeClockout"
                  value={longitudeClockout}
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
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceAdd;
