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
  const [selectedUser, setSelectedUser] = useState(selectedUserId || "");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateOfJoining, setDateOfJoining] = useState(new Date());
  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);
  const [conveyanceAllowance, setConveyanceAllowance] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [medicalAllowance, setMedicalAllowance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lop, setLop] = useState(0); // New state for LOP
  const [tds, setTds] = useState('');
  const [professionalTax, setProfessionalTax] = useState(0);
  const [employeePf, setEmployeePf] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [daysWorked, setDaysWorked] = useState(0); // New state for days worked
  const [totalDaysInMonth,setTotalDaysInMonth]=useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  useEffect(() => {
    fetchUsers();
    if (selectedUserId) fetchUserFinanceDetails(selectedUserId);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setTotalDaysInMonth(daysInMonth);
}, [selectedUserId,month, year]);

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

  const fetchUserFinanceDetails = async (userId) => {
    try {
      const res = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setName(res.data.fullName);
      setAddress(res.data.user_personal_info.address);
      setDesignation(res.data.jobs[0].jobTitle);
      setBasicSalary(res.data.user_financial_info.salaryBasic);
      setHra(res.data.user_financial_info.allowanceHouseRent);
      setConveyanceAllowance(res.data.user_financial_info.allowanceFuel);
      setSpecialAllowance(res.data.user_financial_info.allowanceSpecial);
      setMedicalAllowance(res.data.user_financial_info.allowanceMedical);
      setTotalEarnings(res.data.user_financial_info.salaryGross);
      setTds(res.data.user_financial_info.tds);
      setProfessionalTax(res.data.user_financial_info.pt);
      setEmployeePf(res.data.user_financial_info.pf);
    } catch (err) {
      console.error(err);
    }
  };

  const onUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
    fetchUserFinanceDetails(userId);
  };

  const pushUsers = () => users.map(user => (
    <option key={user.id} value={user.id}>
      {user.fullName}
    </option>
  ));

 

  const years = Array.from({ length: 10 }, (v, i) => new Date().getFullYear() - i);
  const calculateTotalEarnings = () => {
 console.log(totalDaysInMonth,"totalDaysInMonth")
    // const totalDaysInMonth = 30;
    const dailySalary = basicSalary / totalDaysInMonth;
    let lopdays = Number(totalDaysInMonth) - Number(daysWorked)
    const calculatedLop = dailySalary * lopdays;
    setLop(calculatedLop);
    console.log(dailySalary,"dailySalary")
    console.log(lopdays,"lopdays")
    console.log(calculatedLop,"calculatedLop")
    const total = Number(basicSalary) + Number(hra) + Number(conveyanceAllowance) + Number(specialAllowance) + Number(medicalAllowance);
    setTotalEarnings(total);
    console.log(total,"totLEARNINGS")
};

const calculateTotalDeductions = () => {
    const total = Number(tds) + Number(professionalTax) + Number(employeePf) + Number(otherDeductions);
    setTotalDeductions(total);
};

  useEffect(() => {
    calculateTotalEarnings();
  }, [daysWorked, basicSalary, hra, conveyanceAllowance, specialAllowance, medicalAllowance]);

  useEffect(() => {
    calculateTotalDeductions();
  }, [lop, tds, professionalTax, employeePf, otherDeductions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedMonthYear = `${month + 1}, ${year}`;
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
        lop: Number(lop),
        tds: Number(tds),
        professional_tax: Number(professionalTax),
        employee_pf: Number(employeePf),
        other_deductions: Number(otherDeductions),
        total_deductions: Number(totalDeductions),
        daysWorked:Number(daysWorked)
      };
      console.log(salarySlip, "before submission");
      let res = await axios.post(`${API_BASE_URL}/api/salary-slip`, salarySlip, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res, 'after submission');
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
        <Form onSubmit={handleSubmit}>
        <Form.Group>
      <Form.Label className="mb-2 required">Set the month to generate the salary slip</Form.Label>
      <Form.Control
        as="select"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {months.map((monthName, index) => (
          <option key={index} value={index}>
            {monthName}
          </option>
        ))}
      </Form.Control>

      {/* <Form.Label className="mb-2 required">Year</Form.Label> */}
      {/* <Form.Control
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        min="1900"
        max="2100"
      /> */}
      <p>Total Days in Month: {totalDaysInMonth}</p>
    </Form.Group>
          <Form.Group controlId="formYear">
            <Form.Label className="mb-2 required">Year</Form.Label>
            <Form.Control
              as="select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-2 required">Select Employee</Form.Label>
            <Form.Control
              as="select"
              value={selectedUser}
              onChange={onUserChange}
              required
            >
              <option value="">Choose one...</option>
              {pushUsers()}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formName">
            <Form.Label className="mb-2 required">Employee Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Employee name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label className="mb-2 required">Employee Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Employee address"
              required
            />
          </Form.Group>

          <Form.Group controlId="formDesignation">
            <Form.Label className="mb-2 required">Designation</Form.Label>
            <Form.Control
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Employee designation"
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfJoining">
            <Form.Label className="mb-2 required">Date of Joining</Form.Label>
            <DatePicker
              selected={dateOfJoining}
              onChange={(date) => setDateOfJoining(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date of joining"
              className="form-control"
              required
            />
          </Form.Group>

          <Form.Group controlId="formDaysWorked">
            <Form.Label className="mb-2 required">Days Worked</Form.Label>
            <Form.Control
              type="text"
              value={daysWorked}
              onChange={(e) => setDaysWorked(Number(e.target.value))}
              placeholder="Number of days worked +totalDaysInMonth+"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicSalary">
            <Form.Label className="mb-2 required">Basic Salary</Form.Label>
            <Form.Control
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              placeholder="Basic salary"
              required
            />
          </Form.Group>

          <Form.Group controlId="formHra">
            <Form.Label className="mb-2 required">HRA</Form.Label>
            <Form.Control
              type="number"
              value={hra}
              onChange={(e) => setHra(Number(e.target.value))}
              placeholder="House Rent Allowance"
              required
            />
          </Form.Group>

          <Form.Group controlId="formConveyanceAllowance">
            <Form.Label className="mb-2 required">Conveyance Allowance</Form.Label>
            <Form.Control
              type="number"
              value={conveyanceAllowance}
              onChange={(e) => setConveyanceAllowance(Number(e.target.value))}
              placeholder="Conveyance Allowance"
              required
            />
          </Form.Group>

          <Form.Group controlId="formSpecialAllowance">
            <Form.Label className="mb-2 required">Special Allowance</Form.Label>
            <Form.Control
              type="number"
              value={specialAllowance}
              onChange={(e) => setSpecialAllowance(Number(e.target.value))}
              placeholder="Special Allowance"
              required
            />
          </Form.Group>

          <Form.Group controlId="formMedicalAllowance">
            <Form.Label className="mb-2 required">Medical Allowance</Form.Label>
            <Form.Control
              type="number"
              value={medicalAllowance}
              onChange={(e) => setMedicalAllowance(Number(e.target.value))}
              placeholder="Medical Allowance"
              required
            />
          </Form.Group>

          <Form.Group controlId="formLop">
            <Form.Label className="mb-2 required">Loss of Pay (LOP)</Form.Label>
            <Form.Control
              type="number"
              value={lop}
              placeholder="Calculated LOP"
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formTds">
            <Form.Label className="mb-2 required">TDS</Form.Label>
            <Form.Control
              type="number"
              value={tds}
              onChange={(e) => setTds(Number(e.target.value))}
              placeholder="TDS"
              required
            />
          </Form.Group>

          <Form.Group controlId="formProfessionalTax">
            <Form.Label className="mb-2 required">Professional Tax</Form.Label>
            <Form.Control
              type="number"
              value={professionalTax}
              onChange={(e) => setProfessionalTax(Number(e.target.value))}
              placeholder="Professional Tax"
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmployeePf">
            <Form.Label className="mb-2 required">Employee PF</Form.Label>
            <Form.Control
              type="number"
              value={employeePf}
              onChange={(e) => setEmployeePf(Number(e.target.value))}
              placeholder="Employee Provident Fund"
              required
            />
          </Form.Group>

          <Form.Group controlId="formOtherDeductions">
            <Form.Label className="mb-2 required">Other Deductions</Form.Label>
            <Form.Control
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(Number(e.target.value))}
              placeholder="Other Deductions"
              required
            />
          </Form.Group>

          <Form.Group controlId="formTotalEarnings">
            <Form.Label className="mb-2 required">Total Earnings</Form.Label>
            <Form.Control
              type="number"
              value={totalEarnings}
              placeholder="Calculated Total Earnings"
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formTotalDeductions">
            <Form.Label className="mb-2 required">Total Deductions</Form.Label>
            <Form.Control
              type="number"
              value={totalDeductions}
              placeholder="Calculated Total Deductions"
              readOnly
            />
          </Form.Group>

          {showAlert && <Alert variant="danger">{errorMsg}</Alert>}

          {done && (
            <Alert variant="success">
              Salary Slip added successfully!
            </Alert>
          )}

          <Button variant="primary" type="submit">
            Add Salary Slip
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SalarySlipAdd;
