import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import API_BASE_URL from "../env";

const SalarySlipAdd = ({
  selectedUserId,
  show,
  onHide,
  onAddSuccess,
  ...props
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateOfJoining, setDateOfJoining] = useState(new Date());
  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);
  const [conveyanceAllowance, setConveyanceAllowance] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [medicalAllowance, setMedicalAllowance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [tds, setTds] = useState('');
  const [professionalTax, setProfessionalTax] = useState(0);
  const [employeePf, setEmployeePf] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);
  const[userFinancialInfo,setUserFinancialInfo]=useState({})

  useEffect(() => {
    fetchUsers();
    fetchUserFinanceDetails();
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
  const fetchUserFinanceDetails = async (userId) => {
    console.log('helolo wporld',userId)
    try {
      console.log(selectedUser,selectedUserId,"selectedUserselectedUserselectedUserselectedUser")
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("api/users/" + userId, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res.data, "fetchUserFinanceDetails");
      setUserFinancialInfo(res.data)
      setTds(res.data.tds)
      console.log(tds,'userFinancialInfouserFinancialInfouserFinancialInfouserFinancialInfo')
    } catch (err) {
      console.error(err);
    }
  };
  const onUserChange = (event) => {
    console.log(`User selected: ${event.target.value}`);
    setSelectedUser(event.target.value);
    fetchUserFinanceDetails(event.target.value)
  };

  const pushUsers = () => {
    console.log("Mapping users to options...");
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.fullName}
      </option>
    ));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedMonthYear = `${month}, ${year}`;
      const salarySlip = {
        name,
        userId: selectedUser,
        address,
        designation,
        month: formattedMonthYear,
        date_of_joining: dateOfJoining,
        basic_salary: Number(basicSalary),
        hra: Number(hra),
        conveyance_allowance: Number(conveyanceAllowance),
        special_allowance: Number(specialAllowance),
        medical_allowance: Number(medicalAllowance),
        total_earnings: Number(totalEarnings),
        tds: Number(tds),
        professional_tax: Number(professionalTax),
        employee_pf: Number(employeePf),
        other_deductions: Number(otherDeductions),
        total_deductions: Number(totalDeductions),
      };

      await axios.post(`${API_BASE_URL}/api/salary-slip`, salarySlip, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setDone(true);
      if (onAddSuccess) {
        onAddSuccess(); // Callback to handle success
        window.scrollTo(0, 0);
      }
    } catch (err) {
      setShowAlert(true);
      setErrorMsg(err.response?.data?.message || "An error occurred.");
      window.scrollTo(0, 0);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Salary Slip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done && (
          <Alert variant="success" className="m-1">
            Salary slip added successfully!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="danger" className="m-1">
            {"Please select a Employee to create salary slip"}
          </Alert>
        )}
        <Form.Group>
          <Form.Label className="mb-2 required">Select Employee</Form.Label>
          <Form.Control
            as="select"
            className="form-control"
            value={selectedUser}
            onChange={onUserChange}
            required
          >
            <option value="">Choose one...</option>
            {pushUsers()}
          </Form.Control>
        </Form.Group>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label className="mb-2 required">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label className="mb-2 required">Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDesignation">
            <Form.Label className="mb-2 required">Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMonth">
            <Form.Label className="mb-2 required">Month</Form.Label>
            <Form.Control
              as="select"
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formYear">
            <Form.Label className="mb-2 required">Year</Form.Label>
            <Form.Control
              as="select"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDateOfJoining">
            <Form.Label className="mb-2 required">Date of Joining</Form.Label>
            <DatePicker
              selected={dateOfJoining}
              onChange={(date) => setDateOfJoining(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicSalary">
            <Form.Label className="mb-2 required">Basic Salary</Form.Label>
            <Form.Control
              type="number"
              name="basic_salary"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formHra">
            <Form.Label className="mb-2 required">HRA</Form.Label>
            <Form.Control
              type="number"
              name="hra"
              value={hra}
              onChange={(e) => setHra(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConveyanceAllowance">
            <Form.Label className="mb-2 required">
              Conveyance Allowance
            </Form.Label>
            <Form.Control
              type="number"
              name="conveyance_allowance"
              value={conveyanceAllowance}
              onChange={(e) => setConveyanceAllowance(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSpecialAllowance">
            <Form.Label className="mb-2 required">Special Allowance</Form.Label>
            <Form.Control
              type="number"
              name="special_allowance"
              value={specialAllowance}
              onChange={(e) => setSpecialAllowance(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMedicalAllowance">
            <Form.Label className="mb-2 required">Medical Allowance</Form.Label>
            <Form.Control
              type="number"
              name="medical_allowance"
              value={medicalAllowance}
              onChange={(e) => setMedicalAllowance(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalEarnings">
            <Form.Label className="mb-2 required">Total Earnings</Form.Label>
            <Form.Control
              type="number"
              name="total_earnings"
              value={totalEarnings}
              onChange={(e) => setTotalEarnings(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTds">
            <Form.Label className="mb-2 required">TDS</Form.Label>
            <Form.Control
              type="number"
              name="tds"
              value={tds}
              onChange={(e) => setTds(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProfessionalTax">
            <Form.Label className="mb-2 required">Professional Tax</Form.Label>
            <Form.Control
              type="number"
              name="professional_tax"
              value={professionalTax}
              onChange={(e) => setProfessionalTax(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmployeePf">
            <Form.Label className="mb-2 required">Employee PF</Form.Label>
            <Form.Control
              type="number"
              name="employee_pf"
              value={employeePf}
              onChange={(e) => setEmployeePf(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOtherDeductions">
            <Form.Label className="mb-2 required">Other Deductions</Form.Label>
            <Form.Control
              type="number"
              name="other_deductions"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTotalDeductions">
            <Form.Label className="mb-2 required">Total Deductions</Form.Label>
            <Form.Control
              type="number"
              name="total_deductions"
              value={totalDeductions}
              onChange={(e) => setTotalDeductions(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-2">
            Add Salary Slip
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalarySlipAdd;
