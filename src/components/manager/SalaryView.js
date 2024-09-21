import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../env";

const SalaryViewManager = () => {
  const [user, setUser] = useState(null);
  const [currentJobTitle, setCurrentJobTitle] = useState(null);
  const [falseRedirect, setFalseRedirect] = useState(false);
  const [editRedirect, setEditRedirect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("user")).id;
        axios.defaults.baseURL = API_BASE_URL;

        const response = await axios.get(`api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const userData = response.data;
        setUser(userData);
        if (userData.jobs && userData.jobs.length > 0) {
          setCurrentJobTitle(userData.jobs[0].jobTitle);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  if (falseRedirect) {
    return <Redirect to="/" />;
  }

  if (editRedirect) {
    return (
      <Redirect
        to={{
          pathname: "/salary-details",
          state: { selectedUser: user },
        }}
      />
    );
  }

  if (!user) {
    return null;
  }

  const {
    fullName,
    department,
    role,
    user_financial_info: financialInfo = {},
  } = user;

  const totalAllowance =
    (financialInfo.allowanceHouseRent || 0) +
    (financialInfo.allowanceMedical || 0) +
    (financialInfo.allowanceSpecial || 0) +
    (financialInfo.allowanceFuel || 0) +
    (financialInfo.allowancePhoneBill || 0) +
    (financialInfo.allowanceOther || 0);

  const totalDeduction =
    (financialInfo.deductionTax || 0) +
    (financialInfo.pf || 0) +
    (financialInfo.pt || 0) +
    (financialInfo.tds || 0) +
    (financialInfo.deductionOther || 0);

  return (
    <div>

      <h3>Salary Details</h3>
      <div className="row">
      <div className="card col-sm-5">
      <table>
        <thead>
          <tr>
            <th colSpan="2">Profile Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Full Name:</td>
            <td className="text-primary mb-3">{fullName}</td>
          </tr>
          <tr>
            <td>Employee ID:</td>
            <td>{user.username || "NA"}</td>
          </tr>
          <tr>
            <td>Department:</td>
            <td>
              {department?.departmentName || <Redirect to="/employee-list" />}
            </td>
          </tr>
          <tr>
            <td>Job Title:</td>
            <td>{currentJobTitle}</td>
          </tr>
          <tr>
            <td>Role:</td>
            <td>
              {role === "ROLE_ADMIN"
                ? "Admin"
                : role === "ROLE_MANAGER"
                ? "Manager"
                : "Employee"}
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
      <div className="row">
      <div className="card col-sm-5">
      <h2>Salary Information</h2>
      <table>
        <thead>
          <tr>
            <th colSpan="2">Basic Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* <td>Employment Type:</td> */}
            {/* <td>{financialInfo.employmentType || user.jobs[0].employmentType}</td> */}
          </tr>
          <tr>
            <td>Basic Salary:</td>
            <td>₹ {financialInfo.salaryBasic || 0}</td>
          </tr>
          <tr>
            <td>Gross Salary:</td>
            <td>₹ {financialInfo.salaryGross || 0}</td>
          </tr>
          <tr>
            <td>Total Deductions:</td>
            <td>₹ {totalDeduction}</td>
          </tr>
          <tr>
            <td>Net Salary:</td>
            <td>₹ {financialInfo.salaryNet || 0}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div className="card col-sm-5">
      <h2>Allowances</h2>
      <table>
        <thead>
          <tr>
            <th colSpan="2">Allowance Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>House Rent Allowance:</td>
            <td>₹ {financialInfo.allowanceHouseRent || 0}</td>
          </tr>
          <tr>
            <td>Medical Allowance:</td>
            <td>₹ {financialInfo.allowanceMedical || 0}</td>
          </tr>
          <tr>
            <td>Special Allowance:</td>
            <td>₹ {financialInfo.allowanceSpecial || 0}</td>
          </tr>
          <tr>
            <td>Fuel Allowance:</td>
            <td>₹ {financialInfo.allowanceFuel || 0}</td>
          </tr>
          <tr>
            <td>Phone Bill Allowance:</td>
            <td>₹ {financialInfo.allowancePhoneBill || 0}</td>
          </tr>
          <tr>
            <td>Other Allowance:</td>
            <td>₹ {financialInfo.allowanceOther || 0}</td>
          </tr>
          <tr>
            <td>Total Allowance:</td>
            <td>₹ {totalAllowance}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
      <div className="row">
      <div className="card col-sm-5">
      <h2>Deductions</h2>
      <table>
        <thead>
          <tr>
            <th colSpan="2">Deduction Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tax Deduction:</td>
            <td>₹ {financialInfo.deductionTax || 0}</td>
          </tr>
          <tr>
            <td>PF:</td>
            <td>₹ {financialInfo.pf || 0}</td>
          </tr>
          <tr>
            <td>PT:</td>
            <td>₹ {financialInfo.pt || 0}</td>
          </tr>
          <tr>
            <td>TDS:</td>
            <td>₹ {financialInfo.tds || 0}</td>
          </tr>
          <tr>
            <td>Other Deductions:</td>
            <td>₹ {financialInfo.deductionOther || 0}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
};

export default SalaryViewManager;
