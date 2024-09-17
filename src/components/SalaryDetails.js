import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SalaryDetails = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [financialId, setFinancialId] = useState(null);
  const [users, setUsers] = useState([]);
  const [employmentType, setEmploymentType] = useState("");
  const [salaryBasic, setSalaryBasic] = useState(0);
  const [allowanceHouseRent, setAllowanceHouseRent] = useState(0);
  const [allowanceMedical, setAllowanceMedical] = useState(0);
  const [allowanceSpecial, setAllowanceSpecial] = useState(0);
  const [allowanceFuel, setAllowanceFuel] = useState(0);
  const [allowanceOther, setAllowanceOther] = useState(0);
  const [deductionTax, setDeductionTax] = useState(0);
  const [deductionOther, setDeductionOther] = useState(0);
  const [pf, setPf] = useState(0);
  const [pt, setPt] = useState(0);
  const [tds, setTds] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const location = useLocation();
  const user = location.state?.selectedUser;

  // Fetch departments and initialize user details if selected
  useEffect(() => {
    axios.get('/api/departments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setDepartments(res.data);
      if (user) {
        setSelectedDepartment(user.departmentId);
        setSelectedUser(user.id);
        fetchFinancialData(user.id);
      }
    })
    .catch(err => {
      console.error("Error fetching departments:", err);
    });
  }, [user]);

  // Fetch users based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const fetchUsers = selectedDepartment === "all"
        ? fetchAllUsers
        : () => fetchDepartmentUsers(selectedDepartment);
      fetchUsers();
    }
  }, [selectedDepartment]);

  // Fetch all users
  const fetchAllUsers = () => {
    axios.get('/api/departments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const allUsers = res.data.flatMap(dept => dept.users || []);
      setUsers(allUsers);
    })
    .catch(err => {
      console.error("Error fetching all users:", err);
    });
  };

  // Fetch users from a specific department
  const fetchDepartmentUsers = (departmentId) => {
    axios.get(`/api/departments/${departmentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setUsers(res.data.users || []);
    })
    .catch(err => {
      console.error("Error fetching users:", err);
    });
  };

  // Fetch financial information for a specific user
  const fetchFinancialData = (userId) => {
    axios.get(`/api/financialInformations/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const financialData = res.data[0] || {};
      if (financialData) {
        setFinancialId(financialData.id || null);
        setEmploymentType(financialData.employmentType || "");
        setSalaryBasic(financialData.salaryBasic || 0);
        setAllowanceHouseRent(financialData.allowanceHouseRent || 0);
        setAllowanceMedical(financialData.allowanceMedical || 0);
        setAllowanceSpecial(financialData.allowanceSpecial || 0);
        setAllowanceFuel(financialData.allowanceFuel || 0);
        setAllowanceOther(financialData.allowanceOther || 0);
        setDeductionTax(financialData.deductionTax || 0);
        setDeductionOther(financialData.deductionOther || 0);
        setPf(financialData.pf || 0);
        setPt(financialData.pt || 0);
        setTds(financialData.tds || 0);
      }
    })
    .catch(err => {
      console.error("Error fetching financial data:", err);
    });
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
    if (userId) {
      fetchFinancialData(userId);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericValue = name === "employmentType" ? value : parseFloat(value) || 0;

    switch (name) {
      case 'employmentType':
        setEmploymentType(value);
        break;
      case 'salaryBasic':
        setSalaryBasic(numericValue);
        break;
      case 'allowanceHouseRent':
        setAllowanceHouseRent(numericValue);
        break;
      case 'allowanceMedical':
        setAllowanceMedical(numericValue);
        break;
      case 'allowanceSpecial':
        setAllowanceSpecial(numericValue);
        break;
      case 'allowanceFuel':
        setAllowanceFuel(numericValue);
        break;
      case 'allowanceOther':
        setAllowanceOther(numericValue);
        break;
      case 'deductionTax':
        setDeductionTax(numericValue);
        break;
      case 'deductionOther':
        setDeductionOther(numericValue);
        break;
      case 'pf':
        setPf(numericValue);
        break;
      case 'pt':
        setPt(numericValue);
        break;
      case 'tds':
        setTds(numericValue);
        break;
      default:
        break;
    }
  };

  const calculateSalaryDetails = () => {
    const allowanceTotal = allowanceHouseRent + allowanceMedical + allowanceSpecial + allowanceFuel + allowanceOther;
    const deductionTotal = deductionTax + deductionOther + pf + pt + tds;
    const salaryGross = salaryBasic + allowanceTotal;
    const salaryNet = salaryGross - deductionTotal;

    return { salaryGross, deductionTotal, salaryNet };
  };

  const onSubmit = (event) => {
    event.preventDefault();
  
    const { salaryGross, salaryNet } = calculateSalaryDetails();
  
    const data = {
      employmentType,
      salaryBasic,
      salaryGross,
      salaryNet,
      allowanceHouseRent,
      allowanceMedical,
      allowanceSpecial,
      allowanceFuel,
      allowanceOther,
      deductionTax,
      deductionOther,
      pf,
      pt,
      tds
    };
     axios.put(`/api/financialInformations/${financialId}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      .then(() => {
        setCompleted(true);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        let errorMessage = "An error occurred";
        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.data.message.includes("Cannot update UserFinancialInformation")) {
            errorMessage = "No changes detected. Please update the required fields and try again.";
          } else {
            errorMessage = err.response.data.message;
          }
        }
        setHasError(true);
        setErrMsg(errorMessage);
        window.scrollTo(0, 0);
      });
  };
  
  
  const { salaryGross, deductionTotal, salaryNet } = calculateSalaryDetails();

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        {hasError && (
          <Alert variant="danger" className="m-3">
            {errMsg}
          </Alert>
        )}
        {completed && (
          <Alert variant="success" className="m-3">
            Financial Information has been updated.
          </Alert>
        )}

        <div className="col-sm-12">
          <Card className="main-card">
            <Card.Header>Manage Salary Details</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Select Department:</Form.Label>
                  <Form.Control as="select" value={selectedDepartment} onChange={handleDepartmentChange}>
                    <option value="">Choose one...</option>
                    <option value="all">All departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Select User:</Form.Label>
                  <Form.Control as="select" value={selectedUser} onChange={handleUserChange}>
                    <option value="">Choose one...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.fullName}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>

      {selectedUser && (
        <Form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-sm-12">
              <Card className="main-card">
                <Card.Header>Salary Details</Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label className="required">Employment Type</Form.Label>
                    <Form.Control as="select" value={employmentType} onChange={handleChange} name="employmentType">
                      <option value="">Choose one...</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      {/* <option value="Internship">Internship</option> */}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="required">Basic Salary</Form.Label>
                    <Form.Control type="text" value={salaryBasic} onChange={handleChange} name="salaryBasic" />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Card className="main-card">
                <Card.Header>Allowances</Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>House Rent Allowance</Form.Label>
                    <Form.Control type="text" value={allowanceHouseRent} onChange={handleChange} name="allowanceHouseRent" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Medical Allowance</Form.Label>
                    <Form.Control type="text" value={allowanceMedical} onChange={handleChange} name="allowanceMedical" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Special Allowance</Form.Label>
                    <Form.Control type="text" value={allowanceSpecial} onChange={handleChange} name="allowanceSpecial" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Conveyance Allowance</Form.Label>
                    <Form.Control type="text" value={allowanceFuel} onChange={handleChange} name="allowanceFuel" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Other Allowance</Form.Label>
                    <Form.Control type="text" value={allowanceOther} onChange={handleChange} name="allowanceOther" />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
            <div className="col-sm-6">
              <Card className="main-card">
                <Card.Header>Deductions</Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Tax Deduction</Form.Label>
                    <Form.Control type="text" value={deductionTax} onChange={handleChange} name="deductionTax" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Provident Fund</Form.Label>
                    <Form.Control type="text" value={pf} onChange={handleChange} name="pf" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Professional Tax</Form.Label>
                    <Form.Control type="text" value={pt} onChange={handleChange} name="pt" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Tax Deducted at Source (TDS)</Form.Label>
                    <Form.Control type="text" value={tds} onChange={handleChange} name="tds" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Other Deduction</Form.Label>
                    <Form.Control type="text" value={deductionOther} onChange={handleChange} name="deductionOther" />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <Card className="main-card">
                <Card.Header>Salary Summary</Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Gross Salary</Form.Label>
                    <Form.Control type="text" readOnly value={salaryGross} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Total Deductions</Form.Label>
                    <Form.Control type="text" readOnly value={deductionTotal} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Net Salary</Form.Label>
                    <Form.Control type="text" readOnly value={salaryNet} />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              <button className="dashboard-icons" type="submit">Submit</button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default SalaryDetails;
