import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Row, Col, Table } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
import img from "./../assets/samcint_logo.jpeg";
import axios from "axios";
import API_BASE_URL from "../env";
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
let userData =null;
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

  const toggleSlip = () => {
    setShowSlip(prevShowSlip => !prevShowSlip);
  };

  useEffect(() => {
    if (data?.month) {
      extractMonthAndYear(data.month);
    }
  }, [data]);

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setTotalDaysInMonth(daysInMonth);
    console.log(user,"useruseruseruser")
  }, [month, year]);




  useEffect(() => {
    const fetchData = async () => {
      if (data.userId) {
        try {
          axios.defaults.baseURL = API_BASE_URL;
          const userResponse = await axios.get(
            `api/users/${data.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          userData = userResponse.data;
          console.log(userData,'userda')
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
  
    fetchData();
  }, [data.userId]); // Add data.userId as a dependency if it changes and you want to refetch
  


  const extractMonthAndYear = (input) => {
    const [monthStr, yearStr] = input.split(',');
    setMonth(parseInt(monthStr.trim(), 10) - 1);
    setYear(parseInt(yearStr.trim(), 10));
  };

  const downloadPDF = () => {
    if (slipRef.current) {
      html2canvas(slipRef.current, {
        scale: window.devicePixelRatio,
        logging: true,
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = pdfMake.createPdf({
          info: {
            title: 'Salary Slip',
            author: 'Samcint Solutions Pvt. Ltd.',
            subject: 'Salary Slip Document',
            keywords: 'salary slip, samcint, employment',
          },
          pageSize: {
            width: canvas.width,
            height: canvas.height,
          },// Set the page size to A4
          pageMargins: [0, 0, 0, 0], // Left, Top, Right, Bottom in points
          content: [
            {
              image: imgData,
              width: canvas.width   , // Adjust width according to the margins
              height: canvas.height, // Adjust height according to the margins
            },
          ],
          defaultStyle: {
            font: 'Roboto',
          },
        });
        pdf.download("SalarySlip.pdf");
      });
    } else {
      console.error("Slip element not found");
    }
  };

  if (!data) {
    return <div>Data not available</div>;
  }

  const netPay = data.total_earnings - data.total_deductions - data.lop;

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
          <div ref={slipRef} style={{ margin:'20px' }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <img
                style={{ height: "40px", width: "150px", marginRight: "10px" }}
                src={img}
                alt="Company Logo"
              />
              <h2 style={{ margin: 0,fontStyle:"normal" }}>SAMCINT SOLUTIONS PVT LTD</h2>
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h3>Payslip For: {data.month}</h3>
              <p>Amount in INR</p>
            </div>

            <Table bordered size="sm" style={{ fontSize: '12px', lineHeight: '1.2', margin: '10' }}>
              <tbody>
                {[
                  ["Employee Code", userData.username || '-', "Employee Name", data.name],
                  ["Bank", userData.user_financial_info.bankName || '-', "A/c No", userData.user_financial_info.accountNumber || '-'],
                  ["DOJ", data.date_of_joining, "LOP Days", `${30 - Number(data.daysWorked)}`],
                  ["PF A/c No", data.pfAccountNumber || '-', "STD Days", totalDaysInMonth],
                  ["PF UAN", data.pfUAN || '-', "No. of Days Paid", data.daysWorked],
                  ["Department", userData.department.departmentName, "Designation", userData.jobs[0].jobTitle],
                  ["Location", data.address, "Previous Month LOP", data.previousMonthLop || '-'],
                  ["ESI No", data.esiNumber || '-', "Employee Class", data.employeeClass || '-']
                ].map(([label1, value1, label2, value2], idx) => (
                  <tr key={idx}>
                    <td><strong>{label1}</strong></td>
                    <td>{value1}</td>
                    <td><strong>{label2}</strong></td>
                    <td>{value2}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Table bordered size="sm" className="mt-4" style={{ fontSize: '12px', lineHeight: '1.2', margin: '0' }}>
              <thead>
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
                  ["House Rent Allowance", data.hra, "Professional Tax", data.professional_tax],
                  ["Children Education Allowance", data.childrenEducationAllowance || '-', "VPF", data.vpf || '-'],
                  ["Children Hostel Allowance", data.childrenHostelAllowance || '-', "Income Tax", data.tds],
                  ["Leave Travel Assistance", data.lta || '-', "", ""],
                  ["Self-Owned Vehicle Expenses", data.vehicleExpenses || '-', "", ""],
                  ["Medical", data.medical_allowance || "-", "", ""],
                  ["Meal Allowance", data.mealAllowance || '-', "", ""],
                  ["Flexi Allowance", data.flexiAllowance || '-', "", ""],
                  ["Monthly Joining Bonus", data.joiningBonus || '-', "", ""],
                  ["Transportation Allowance", data.conveyance_allowance || '-', "", ""]
                ].map(([earningsLabel, earningsValue, deductionsLabel, deductionsValue], idx) => (
                  <tr key={idx}>
                    <td>{earningsLabel}</td>
                    <td>{earningsValue}</td>
                    <td>{deductionsLabel}</td>
                    <td>{deductionsValue}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>GROSS EARNINGS</strong></td>
                  <td><strong>{data.total_earnings}</strong></td>
                  <td><strong>GROSS DEDUCTIONS</strong></td>
                  <td><strong>{data.total_deductions}</strong></td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    <strong>NET PAY</strong>: {netPay}
                  </td>
                </tr>
              </tbody>
            </Table>

            <p style={{ textAlign: "center", marginTop: "10px", fontSize: "10px" }}>
              ** This is a computer-generated payslip and does not require a signature or stamp.
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

export default SalarySlipTemplate;
