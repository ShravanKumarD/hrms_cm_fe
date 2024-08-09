import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const OfferLetterAddModal = (props) => {
  // Define separate state variables for each form field
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [recipientPlace, setRecipientPlace] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [workSchedule, setWorkSchedule] = useState(
    "9:30 am to 6:30 pm, Monday to Friday"
  );
  const [companyName, setCompanyName] = useState("CreditMitra");
  const [senderName, setSenderName] = useState("Murthy Balaji");
  const [senderTitle, setSenderTitle] = useState("Co Founder");

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
      console.log(res.data, "users");
    } catch (err) {
      console.error(err);
    }
  };

  const onUserChange = (event) => {
    console.log(`User selected: ${event.target.value}`);
    setSelectedUser(event.target.value);
  };

  const pushUsers = () => {
    console.log("Mapping users to options...");
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.fullName}
      </option>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/offerLetters`,
        {
          userId: selectedUser,
          full_name: fullName,
          recipient_place: recipientPlace,
          role,
          department,
          salary,
          start_date: startDate,
          end_date: endDate,
          location,
          work_schedule: workSchedule,
          company_name: companyName,
          sender_name: senderName,
          sender_title: senderTitle,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      props.onSuccess();
      props.onHide();
    } catch (error) {
      console.error("Error adding offer letter:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Offer Letter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Row>
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
            <Form.Group as={Col} md="6" controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formRecipientPlace">
              <Form.Label>Recipient Place</Form.Label>
              <Form.Control
                type="text"
                value={recipientPlace}
                onChange={(e) => setRecipientPlace(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formSalary">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="formEndDate">
              <Form.Label>End Date (if applicable)</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formWorkSchedule">
            <Form.Label>Work Schedule</Form.Label>
            <Form.Control
              type="text"
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} md="4" controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formSenderName">
              <Form.Label>Sender Name</Form.Label>
              <Form.Control
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formSenderTitle">
              <Form.Label>Sender Title</Form.Label>
              <Form.Control
                type="text"
                value={senderTitle}
                onChange={(e) => setSenderTitle(e.target.value)}
              />
            </Form.Group>
          </Form.Row>

          <Button variant="primary" type="submit">
            Add Offer Letter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OfferLetterAddModal;
