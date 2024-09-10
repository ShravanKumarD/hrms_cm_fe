import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const OfferLetterAddModal = (props) => {
  // Define state variables
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
  const [workSchedule, setWorkSchedule] = useState("9:30 am to 6:30 pm, Monday to Friday");
  const [companyName, setCompanyName] = useState("CreditMitra");
  const [senderName, setSenderName] = useState("Murthy Balaji");
  const [senderTitle, setSenderTitle] = useState("Co Founder");

  // Compensation Details state
  const [compensationDetails, setCompensationDetails] = useState({
    basic: "",
    houseRentAllowance: "",
    medicalAllowance: "",
    conveyanceAllowance: "",
    specialAllowance: "",
    performanceBonus: "",
    grossSalary: "",
    employeePF: "",
    professionalTax: "",
    tds: "",
    totalDeductions: "",
    netSalary: "",
    providentFund: "",
    total: "",
  });

  useEffect(() => {
    fetchUsers();
    if (selectedUser) {
      fetchUserFinanceDetails(selectedUser);
    }
  }, [selectedUser]);

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
      const { user_personal_info, department, user_finiacial_info } = res.data;
      setFullName(res.data.fullName);
      setRole(res.data.jobs[0].jobTitle);
      setRecipientPlace(user_personal_info.city);
      setDepartment(department.departmentName);
      setSalary(user_finiacial_info.salaryGross);
      setLocation(user_personal_info.city);
      
      // Set compensation details
      setCompensationDetails({
        basic: user_finiacial_info.basic || '',
        houseRentAllowance: user_finiacial_info.houseRentAllowance || '',
        medicalAllowance: user_finiacial_info.medicalAllowance || '',
        conveyanceAllowance: user_finiacial_info.conveyanceAllowance || '',
        specialAllowance: user_finiacial_info.specialAllowance || '',
        performanceBonus: user_finiacial_info.performanceBonus || '',
        grossSalary: user_finiacial_info.grossSalary || '',
        employeePF: user_finiacial_info.employeePF || '',
        professionalTax: user_finiacial_info.professionalTax || '',
        tds: user_finiacial_info.tds || '',
        totalDeductions: user_finiacial_info.totalDeductions || '',
        netSalary: user_finiacial_info.netSalary || '',
        providentFund: user_finiacial_info.providentFund || '',
        total: user_finiacial_info.total || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const pushUsers = () => {
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.fullName}
      </option>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post offer letter data to the server
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
          // compensation: compensationDetails, // Include compensation details in the request body
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      // Store compensation details in localStorage
      localStorage.setItem("compensationDetails", JSON.stringify(compensationDetails));
      
      // Notify success and close modal
      props.onSuccess();
      props.onHide();
    } catch (error) {
      console.error("Error adding offer letter:", error);
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
              <Form.Label className="mb-2">Select Employee</Form.Label>
              <Form.Control
                as="select"
                className="form-control"
                value={selectedUser || ""}
                onChange={onUserChange}
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
                placeholder="Enter Full name"
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formRecipientPlace">
              <Form.Label>Recipient Place</Form.Label>
              <Form.Control
                type="text"
                value={recipientPlace}
                onChange={(e) => setRecipientPlace(e.target.value)}
                placeholder="Enter place"
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
                placeholder="Enter role"
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department name"
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
                placeholder="$"
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

          {/* Compensation Details */}
          {selectedUser && (
            <div className="compensation-details">
              <h5>Compensation Details</h5>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="formBasic">
                  <Form.Label>Basic</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.basic}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        basic: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formHouseRentAllowance">
                  <Form.Label>House Rent Allowance</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.houseRentAllowance}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        houseRentAllowance: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formMedicalAllowance">
                  <Form.Label>Medical Allowance</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.medicalAllowance}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        medicalAllowance: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="formConveyanceAllowance">
                  <Form.Label>Conveyance Allowance</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.conveyanceAllowance}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        conveyanceAllowance: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formSpecialAllowance">
                  <Form.Label>Special Allowance</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.specialAllowance}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        specialAllowance: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formPerformanceBonus">
                  <Form.Label>Performance Bonus</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.performanceBonus}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        performanceBonus: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="formGrossSalary">
                  <Form.Label>Gross Salary</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.grossSalary}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        grossSalary: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formEmployeePF">
                  <Form.Label>Employee PF</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.employeePF}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        employeePF: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formProfessionalTax">
                  <Form.Label>Professional Tax</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.professionalTax}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        professionalTax: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="formTDS">
                  <Form.Label>TDS</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.tds}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        tds: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formTotalDeductions">
                  <Form.Label>Total Deductions</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.totalDeductions}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        totalDeductions: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formNetSalary">
                  <Form.Label>Net Salary</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.netSalary}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        netSalary: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="formProvidentFund">
                  <Form.Label>Provident Fund (Employer's Contribution)</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.providentFund}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        providentFund: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formTotal">
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.total}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        total: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formCTC">
                  <Form.Label>Cost to Company (CTC)</Form.Label>
                  <Form.Control
                    type="number"
                    value={compensationDetails.total}
                    onChange={(e) =>
                      setCompensationDetails({
                        ...compensationDetails,
                        total: e.target.value,
                      })
                    }
                    placeholder="$"
                  />
                </Form.Group>
              </Form.Row>
            </div>
          )}

          <Button variant="primary" type="submit">
            Add Offer Letter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OfferLetterAddModal;
