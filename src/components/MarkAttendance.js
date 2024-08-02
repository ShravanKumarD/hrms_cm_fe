// src/components/MarkAttendance.js
import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const MarkAttendance = () => {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [clockinTime, setClockInTime] = useState("");
  const [clockoutTime, setClockOutTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://13.232.177.171/api/attendance/mark',
        {
          userId,
          date,
          status,
          clockinTime: status === 'Present' ? clockinTime : null,
          clockoutTime: status === 'Present' ? clockoutTime : null,
          latitude: status === 'Present' ? latitude : null,
          longitude: status === 'Present' ? longitude : null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      console.log(response.data);
      alert('Attendance marked successfully');
    } catch (error) {
      console.error(error);
      alert('Error marking attendance');
    }
  };

  return (
    <Container className="pt-4">
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <br/>
        <Card.Title className="text-center mb-4"><strong>Mark Attendance</strong></Card.Title>
          <Card.Body>
           
     
            <Form onSubmit={handleSubmit}>
              
              <Form.Group controlId="formUserId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                  <option value="Leave">Leave</option>
                </Form.Control>
              </Form.Group>

              {status === "Present" && (
                <>
                  <Form.Group controlId="formClockInTime">
                    <Form.Label>Clock In Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={clockinTime}
                      onChange={(e) => setClockInTime(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formClockOutTime">
                    <Form.Label>Clock Out Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={clockoutTime}
                      onChange={(e) => setClockOutTime(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formLatitude">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formLongitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </Form.Group>
                </>
              )}
<br/>
              <Button variant="primary" type="submit">
                Mark Attendance
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );
};

export default MarkAttendance;
