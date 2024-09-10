import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Row, Col, Table } from "react-bootstrap";
import html2canvas from "html2canvas";
import img from "./../assets/samcint_logo.jpeg";
import axios from "axios";
import API_BASE_URL from "../env";
import moment from "moment";
import jsPDF from "jspdf";

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
        // pdf.text(
        //   "This is a computer-generated payslip and does not require a signature or stamp.",
        //   pageWidth / 2,
        //   pageHeight - margin,
        //   { align: "center" }
        // );

        pdf.save("SalarySlip.pdf");
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
            Payslip for {moment(data.month, "M, YYYY").format("MMM, YYYY")}
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
              userData.username || "-",
              "Employee Name",
              data.name,
            ],
            [
              "Bank",
              userData.user_financial_info.bankName || "-",
              "A/c No",
              userData.user_financial_info.accountNumber || "-",
            ],
            [
              "DOJ",
              // 2024-08-24
              moment(data.date_of_joining, "YYYY-MM-DD").format("D MMM YYYY"),
              "LOP Days",
              `${30 - Number(data.daysWorked)}`,
            ],
            [
              "PF A/c No",
              data.pfAccountNumber || "-",
              "STD Days",
              totalDaysInMonth,
            ],
            ["PF UAN", data.pfUAN || "-", "No. of Days Paid", data.daysWorked],
            [
              "Department",
              userData.department?.departmentName ?? "",
              "Designation",
              userData.jobs?.[0]?.jobTitle ?? "",
            ],
            [
              "Location",
              data.address,
              "Previous Month LOP",
              data.previousMonthLop || "-",
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
            ["Basic", data.basic_salary, "PF Employee Cont.", data.employee_pf],
            [
              "House Rent Allowance",
              data.hra,
              "Professional Tax",
              data.professional_tax,
            ],
            [
              "Children Education Allowance",
              data.childrenEducationAllowance || "-",
              "VPF",
              data.vpf || "-",
            ],
            [
              "Children Hostel Allowance",
              data.childrenHostelAllowance || "-",
              "Income Tax",
              data.tds,
            ],
            ["Leave Travel Assistance", data.lta || "-", "", ""],
            [
              "Self-Owned Vehicle Expenses",
              data.vehicleExpenses || "-",
              "",
              "",
            ],
            ["Medical", data.medical_allowance || "-", "", ""],
            ["Meal Allowance", data.mealAllowance || "-", "", ""],
            ["Flexi Allowance", data.flexiAllowance || "-", "", ""],
            ["Performance Bonus", data.joiningBonus || "-", "", ""],
            [
              "Transportation Allowance",
              data.conveyance_allowance || "-",
              "",
              "",
            ],
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
              <strong>{data.total_earnings}</strong>
            </td>
            <td>
              <strong>GROSS DEDUCTIONS</strong>
            </td>
            <td>
              <strong>{data.total_deductions}</strong>
            </td>
          </tr>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <td style={{ textAlign: "left" }}>
              <strong>NET PAY</strong>
            </td>
            <td style={{ textAlign: "left" }}>
              <strong>{netPay}</strong>
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
    <Card>
      <Card.Body>
        <Row className="mt-3">
          <Col>
            <Button onClick={toggleSlip}>
              {showSlip ? "Hide Salary Slip" : "Show Salary Slip"}
            </Button>
          </Col>
          <Col>
            <Button onClick={downloadPDF}>Download PDF</Button>
          </Col>
        </Row>

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
    </Card>
  );
});

export default SalarySlipTemplate;
