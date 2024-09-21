import React, { useState, useEffect } from "react";
import { Card, Button, Form, Dropdown } from "react-bootstrap";
import { Redirect } from "react-router-dom"; // For react-router-dom v5
import axios from "axios";
import API_BASE_URL from "../../env";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const SalaryList = () => {
  const [financialInformations, setFinancialInformations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRedirect, setEditRedirect] = useState(false);
  const [viewRedirect, setViewRedirect] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "/api/financialInformations",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        setFinancialInformations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDownload = (type) => {
    axios({
      method: "get",
      url: `/api/financialInformations/`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const financialData = response.data;
        const modifiedData = financialData.map(info => ({
          'Full Name': info.user.fullName,
          ...info,
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(modifiedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = type === 'monthly' ? 'monthly_report.xlsx' : 'employee_report.xlsx';
        FileSaver.saveAs(blob, fileName);
      })
      .catch((err) => {
        console.error("Download error:", err);
      });
  };

  // const onEdit = (financialInfo) => (event) => {
  //   event.preventDefault();
  //   console.log("Setting selected user for edit:", financialInfo.user); // Debug log
  //   setSelectedUser(financialInfo.user);
  //   setEditRedirect(true);
  // };

  const onView = (user) => (event) => {
    event.preventDefault();
    console.log("Setting selected user for view:", user); // Debug log
    setSelectedUser(user);
    setViewRedirect(true);
  };

  if (editRedirect) {
    if (selectedUser) {
      return <Redirect to={{ pathname: "/salary-details", state: { selectedUser } }} />;
    } else {
      console.error("Redirect failed: selectedUser is undefined");
    }
  }

  if (viewRedirect) {
    if (selectedUser) {
      return <Redirect to={{ pathname: "/salary-view", state: { selectedUser } }} />;
    } else {
      console.error("Redirect failed: selectedUser is undefined");
    }
  }

  return (
    <div className="container-fluid pt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>List of Employees and Their Salaries</h2>
        <Dropdown>
          <Dropdown.Toggle className="dashboard-icons btn-sm" id="dropdown-basic">
            Download Report
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleDownload('employeeWise')}>
              Employee-wise Report
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <p></p>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>EMP ID</th>
              <th>Full Name</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Emp Type</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {financialInformations.map((info, index) => (
              <tr key={index}>
                <td>{info.user.username}</td>
                <td>{info.user.fullName}</td>
                <td>{info.salaryGross}</td>
                <td>{info.deductionTotal}</td>
                <td>{info.salaryNet}</td>
                <td>{info.employmentType}</td>
                <td>
                  <Form>
                    <button
                     className="btn btn-light btn-sm"
                      onClick={onView(info.user)}
                    >
                      <i className="far fa-eye"></i>
                    </button>
                    {/* <button
                     className="btn btn-light btn-sm"
                      onClick={onEdit(info)}
                    >
                      <i className="fas fa-edit"></i>
                    </button> */}
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryList;
