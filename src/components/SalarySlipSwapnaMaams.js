import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Row, Col, Table } from "react-bootstrap";
import html2canvas from "html2canvas";
import img from "./../assets/samcint_logo.jpeg";
import axios from "axios";
import API_BASE_URL from "../env";
import moment from "moment";
import jsPDF from "jspdf";
import "./SalarySlip.css";

let userData = null;

const SalarySlipTemplate = React.forwardRef((props, ref) => {
  const { data } = props;
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalDaysInMonth, setTotalDaysInMonth] = useState(0);
  const [user, setUser] = useState({});
  const [department, setDepartment] = useState({ departmentName: null });
  const [jobTitle, setJobTitle] = useState(null);
  const [userPersonalInfo, setUserPersonalInfo] = useState({
    dateOfBirth: null,
    gender: null,
    maritalStatus: null,
    fatherName: null,
    country: null,
    address: null,
    mobile: null,
    emailAddress: null,
  });
  const [userFinancialInfo, setUserFinancialInfo] = useState({
    bankName: null,
    accountName: null,
    accountNumber: null,
    iban: null,
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [salarySlip, setSalarySlip] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
  };

  useEffect(() => {
    if (data?.month) {
      extractMonthAndYear(data.month);
    }
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setTotalDaysInMonth(daysInMonth);
  }, [month, year]);

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        try {
          axios.defaults.baseURL = API_BASE_URL;
          const userResponse = await axios.get(`api/users/${data.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          userData = userResponse.data;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isPrinting) {
      setTimeout(() => {
        generatePDF();
        setIsPrinting(false);
      }, 100);
    }
  }, [isPrinting]);

  const extractMonthAndYear = (input) => {
    const [monthStr, yearStr] = input.split(",");
    setMonth(parseInt(monthStr.trim(), 10) - 1);
    setYear(parseInt(yearStr.trim(), 10));
  };

  const downloadPDF = () => {
    setIsPrinting(true);
  };

  const generatePDF = () => {
    const printElement = document.getElementById("print-content");
    if (printElement) {
      html2canvas(printElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "px", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Convert 20px to points (1 inch = 72 points, 1 px ≈ 0.75 points)
        const margin = 20 * 0.75;

        const contentWidth = pageWidth - 2 * margin;
        const contentHeight = pageHeight - 2 * margin;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(
          contentWidth / imgWidth,
          contentHeight / imgHeight
        );
        const imgX = margin + (contentWidth - imgWidth * ratio) / 2;
        const imgY = margin;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.setFontSize(10);
        pdf.setProperties({
          title: "Salary slip",
          author: "Samcint Solutions Pvt. Ltd.",
          subject: "Salary slip Document",
          keywords: "Salary slip, samcint, employment",
        });

        // pdf.text(
        //   "This is a computer-generated payslip and does not require a signature or stamp.",
        //   pageWidth / 2,
        //   pageHeight - margin,
        //   { align: "center" }
        // );

        pdf.save("SwapnaEskilla_Sep.pdf");
      });
    } else {
      console.error("Print element not found");
    }
  };

  if (!data) {
    return <div>Data not available</div>;
  }

  const netPay = data.total_earnings - data.total_deductions - data.lop;

  const renderSalarySlipContent = () => (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              height: "40px",
              width: "150px",
              marginRight: "30px",
            }}
            src={img}
            alt="Company Logo"
          />
          <h2 style={{ margin: 0, fontStyle: "normal" }}>
            SAMCINT SOLUTIONS PVT LTD
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: "normal" }}>
            {/* Payslip for {moment(data.month, "M, YYYY").format("MMM, YYYY")} */}
            Payslip for Sep, 2024
          </p>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>Amount in INR</p>
        </div>
      </div>

      <Table
        bordered
        size="sm"
        style={{ fontSize: "12px", lineHeight: "1.2", margin: "10" }}
      >
        <tbody>
          {[
            [
              "Employee Code",
              "SSA002" || "-",
              "Employee Name",
              "Eskilla Swapna Rani",
            ],
            [
              "Bank",
              // userData.user_financial_info.bankName || "-",
              "ICICI Bank",
              "A/c No",
              // userData.user_financial_info.accountNumber || "-",
              "272301504786",
            ],
            [
              "DOJ",
              "2024-07-01",
              // moment(data.date_of_joining, "YYYY-MM-DD").format("D MMM YYYY"),
              "LOP Days",
              // `${30 - Number(data.daysWorked)}`,
              0,
            ],
            [
              "PF A/c No",
              data.pfAccountNumber || "-",
              "STD Days",
              // totalDaysInMonth,
              30,
            ],
            ["PF UAN", 101814796569 || "-", "No. of Days Paid", 30],
            [
              "Department",
              // userData.department?.departmentName ?? "",
              "-",
              "Designation",
              // userData.jobs?.[0]?.jobTitle ?? "",
              "Chief Executive Officer",
            ],
            [
              "Location",
              "Hyderabad",
              // data.address,
              "Previous Month LOP",
              0,
            ],
            [
              "ESI No",
              data.esiNumber || "-",
              "Employee Class",
              data.employeeClass || "-",
            ],
          ].map(([label1, value1, label2, value2], idx) => (
            <tr key={idx}>
              <td>
                <strong>{label1}</strong>
              </td>
              <td>{value1}</td>
              <td>
                <strong>{label2}</strong>
              </td>
              <td>{value2}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Table
        bordered
        size="sm"
        className="mt-4"
        style={{
          fontSize: "12px",
          lineHeight: "1.2",
          margin: "0",
          color: "black",
          textAlign: "left",
        }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Earnings</th>
            <th>Amount (Rs.)</th>
            <th>Deductions</th>
            <th>Amount (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Basic", 250000, "PF Employee Cont.", 1800],
            [ "House Rent Allowance", 125000, "Professional Tax",200,],
            ["Special Allowance", 122150 || "-","Income Tax",77593,],
            ["Conveyance Allowance", 1600 || "-","VPF",data.vpf || "-",],
            ["Medical Allowance", 1250 || "-", "", ""],
            ["Performance Bonus", 161215 || "-", "", ""],
            ["Children Education Allowance", data.childrenEducationAllowance],
            [  "Children Hostel Allowance", data.childrenHostelAllowance],
       
    
           
        
            [ "Self-Owned Vehicle Expenses", data.vehicleExpenses || "-", "","",],
            ["Meal Allowance", data.mealAllowance || "-", "", ""],
            ["Flexi Allowance", data.flexiAllowance || "-", "", ""],
            ["Leave Travel Assistance", data.lta || "-", "", ""],
          ].map(
            (
              [earningsLabel, earningsValue, deductionsLabel, deductionsValue],
              idx
            ) => (
              <tr key={idx} style={{ borderBottom: "none" }}>
                <td>{earningsLabel}</td>
                <td>{earningsValue}</td>
                <td>{deductionsLabel}</td>
                <td>{deductionsValue}</td>
              </tr>
            )
          )}
          <tr style={{ borderTop: "1px solid black" }}>
            <td>
              <strong>GROSS EARNINGS</strong>
            </td>
            <td>
              <strong>661215</strong>
            </td>
            <td>
              <strong>GROSS DEDUCTIONS</strong>
            </td>
            <td>
              <strong>110715</strong>
            </td>
          </tr>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <td style={{ textAlign: "left" }}>
              <strong>NET PAY</strong>
            </td>
            <td style={{ textAlign: "left" }}>
              <strong>5050500</strong>
            </td>
          </tr>
        </tbody>
      </Table>

      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "10px",
        }}
      >
        ** This is a computer-generated payslip and does not require a signature
        or stamp.
      </p>
    </>
  );

  return (
    <>
      <Card.Body>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Row>
            <Col>
              <button className="dashboard-icons" onClick={toggleSlip}>
                {showSlip ? "Hide Salary Slip" : "Show Salary Slip"}
              </button>
            </Col>
            <Col>
              <button
                className="dashboard-icons"
                onClick={downloadPDF}
                style={{ marginLeft: "10px" }}
              >
                Download PDF
              </button>
            </Col>
          </Row>
        </div>

        {showSlip && (
          <>
            <div ref={slipRef} style={{ margin: "20px" }}>
              {renderSalarySlipContent()}
            </div>

            {isPrinting && (
              <div
                id="print-content"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "800px",
                }}
              >
                {renderSalarySlipContent()}
              </div>
            )}
          </>
        )}
      </Card.Body>
    </>
  );
});

export default SalarySlipTemplate;
