import React from "react";

const CompensationTable = ({ compensationDetails, employeeName, dateOfJoining, designation }) => {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th className="header">Employee Name</th>
          <th className="header">Date of Joining</th>
          <th className="header">Designation</th>
          <th className="header" colSpan="2">Salary & Benefits Structure</th>
        </tr>
        <tr>
          <td>{employeeName}</td>
          <td>{dateOfJoining}</td>
          <td>{designation}</td>
          <td>Salary PM</td>
          <td>Salary PA</td>
        </tr>
        <tr>
          <td className="section-title" colSpan="5">A) Fixed Pay</td>
        </tr>
        <tr>
          <td className="header">Basic</td>
          <td>{compensationDetails.basic || "-"}</td>
          <td>{compensationDetails.basic * 12 || "-"}</td>
          <td>{compensationDetails.basic || "-"}</td>
          <td>{compensationDetails.basic * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">House Rent Allowance</td>
          <td>{compensationDetails.houseRentAllowance || "-"}</td>
          <td>{compensationDetails.houseRentAllowance * 12 || "-"}</td>
          <td>{compensationDetails.houseRentAllowance || "-"}</td>
          <td>{compensationDetails.houseRentAllowance * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Medical Allowance</td>
          <td>{compensationDetails.medicalAllowance || "-"}</td>
          <td>{compensationDetails.medicalAllowance * 12 || "-"}</td>
          <td>{compensationDetails.medicalAllowance || "-"}</td>
          <td>{compensationDetails.medicalAllowance * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Conveyance Allowance</td>
          <td>{compensationDetails.conveyanceAllowance || "-"}</td>
          <td>{compensationDetails.conveyanceAllowance * 12 || "-"}</td>
          <td>{compensationDetails.conveyanceAllowance || "-"}</td>
          <td>{compensationDetails.conveyanceAllowance * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Special Allowance</td>
          <td>{compensationDetails.specialAllowance || "-"}</td>
          <td>{compensationDetails.specialAllowance * 12 || "-"}</td>
          <td>{compensationDetails.specialAllowance || "-"}</td>
          <td>{compensationDetails.specialAllowance * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Performance Bonus</td>
          <td>{compensationDetails.performanceBonus || "-"}</td>
          <td>{compensationDetails.performanceBonus * 12 || "-"}</td>
          <td>{compensationDetails.performanceBonus || "-"}</td>
          <td>{compensationDetails.performanceBonus * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Gross Salary</td>
          <td>{compensationDetails.grossSalary || "-"}</td>
          <td>{compensationDetails.grossSalary * 12 || "-"}</td>
          <td>{compensationDetails.grossSalary || "-"}</td>
          <td>{compensationDetails.grossSalary * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="section-title" colSpan="5">B) Deductions</td>
        </tr>
        <tr>
          <td className="header">Employee PF</td>
          <td>{compensationDetails.employeePF || "-"}</td>
          <td>{compensationDetails.employeePF * 12 || "-"}</td>
          <td>{compensationDetails.employeePF || "-"}</td>
          <td>{compensationDetails.employeePF * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Professional Tax</td>
          <td>{compensationDetails.professionalTax || "-"}</td>
          <td>{compensationDetails.professionalTax * 12 || "-"}</td>
          <td>{compensationDetails.professionalTax || "-"}</td>
          <td>{compensationDetails.professionalTax * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">TDS</td>
          <td>{compensationDetails.tds || "-"}</td>
          <td>{compensationDetails.tds * 12 || "-"}</td>
          <td>{compensationDetails.tds || "-"}</td>
          <td>{compensationDetails.tds * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Total Deductions</td>
          <td>{compensationDetails.totalDeductions || "-"}</td>
          <td>{compensationDetails.totalDeductions * 12 || "-"}</td>
          <td>{compensationDetails.totalDeductions || "-"}</td>
          <td>{compensationDetails.totalDeductions * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="section-title" colSpan="5">Net Salary</td>
        </tr>
        <tr>
          <td className="header">Net Salary</td>
          <td>{compensationDetails.netSalary || "-"}</td>
          <td>{compensationDetails.netSalary * 12 || "-"}</td>
          <td>{compensationDetails.netSalary || "-"}</td>
          <td>{compensationDetails.netSalary * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="section-title" colSpan="5">C) Other Benefits (Not Paid in Cash)</td>
        </tr>
        <tr>
          <td className="header">Provident Fund (Employer's Contribution)</td>
          <td>{compensationDetails.providentFund || "-"}</td>
          <td>{compensationDetails.providentFund * 12 || "-"}</td>
          <td>{compensationDetails.providentFund || "-"}</td>
          <td>{compensationDetails.providentFund * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="header">Total</td>
          <td>{compensationDetails.total || "-"}</td>
          <td>{compensationDetails.total * 12 || "-"}</td>
          <td>{compensationDetails.total || "-"}</td>
          <td>{compensationDetails.total * 12 || "-"}</td>
        </tr>
        <tr>
          <td className="section-title" colSpan="5">Cost to Company (CTC = A + C)</td>
        </tr>
        <tr>
          <td className="header">Cost to Company (CTC)</td>
          <td>{compensationDetails.total || "-"}</td>
          <td>{compensationDetails.total * 12 || "-"}</td>
          <td>{compensationDetails.total || "-"}</td>
          <td>{compensationDetails.total * 12 || "-"}</td>
        </tr>
      </thead>
    </table>
  );
};

export default CompensationTable;
