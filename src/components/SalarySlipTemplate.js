import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const SalarySlipTemplate = React.forwardRef((props, ref) => {
  const { userData, salarySlipData,selectedMonth } = props;
console.log(selectedMonth,"userData")

if (!userData || !salarySlipData) {
  return <div>Data not available</div>;
}

  const netPay = salarySlipData.total_earnings - salarySlipData.total_deductions;
  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, open-sans",
        margin: "20px",
        padding: "20px",
        border: "1px solid #000",
        maxWidth: "600px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img
                    style={{ height: "40px",width:"150px" }}
                    src={img}
                    alt="Company Logo"
                  />
                  <p>
                    &nbsp;
                  </p>
        <h2>SAMCINT SOLUTIONS PVT LTD</h2>
        <p>
          Kailashnath Arcade, #201 2nd Floor, Samcint Solutions Pvt. Ltd.,
          Near Madhapur Metro station, opposite to HDFC Bank Lane, Hyderabad –
          500033
        </p>
        <p>+91- 9663347744</p>
      </div>
      <hr/>
      <h3 style={{textAlign:"center", fontSize:"18px"}}>
        Salary slip for the month of April - 2024
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Name of Employee:</strong> {salarySlipData.name}
        </p>
        <p>
          <strong>Address:</strong> {userData.user_personal_info.address}
        </p>
        <p>
  <strong>Designation:</strong> {userData.jobs?.[0]?.jobTitle ?? "Not provided"}
</p>

        <p>
          <strong>Month:</strong> {salarySlipData.month}
        </p>
        <p>
          <strong>DOJ:</strong> {salarySlipData.date_of_joining.split('T')[0]}
        </p>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Earnings
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Amount (Rs.)
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Deductions
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Amount (Rs.)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Basic Salary
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              {/* 33,333 */}{salarySlipData.basic_salary}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>TDS</td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>{salarySlipData.tds}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>H.R.A</td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
             {salarySlipData.hra}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Professional tax
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>{salarySlipData.professional_tax}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Conveyance Allowance
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
             {salarySlipData.
conveyance_allowance
}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Employee PF
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              {salarySlipData.
employee_pf}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Special Allowance
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              {salarySlipData.
special_allowance}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>Others</td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>{salarySlipData.
other_deductions}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              Medical Allowance
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
            {salarySlipData.
medical_allowance}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}></td>
            <td style={{ border: "1px solid #000", padding: "8px" }}></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              <strong>Total Earnings</strong>
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
             {salarySlipData.
total_earnings}
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>
              <strong>Total Deductions</strong>
            </td>
            <td style={{ border: "1px solid #000", padding: "8px" }}>{salarySlipData.
total_deductions}</td>
          </tr>
        </tfoot>
      </table>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <p>
          <strong>Net Pay:</strong>{netPay}
        </p>
      </div>
      <div>
        <p>
          <strong>For SAMCINT SOLUTIONS PVT LTD</strong>
        </p>
        <p>
          This is a system generated payslip and does not require any
          signature
        </p>
      </div>
    </div>
  );
});

const SalarySlipModule = ({selectedMonth}) => {
  console.log(selectedMonth,"selectedMonth jhhh")
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [salarySlipData, setSalarySlipData] = useState(null);
  const location = useLocation();
  const[month,setMonth]=useState(null);

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
  };
  
  useEffect(() => {
    setMonth(selectedMonth)
    const fetchUserData = async () => {
      try {
        axios.defaults.baseURL = "http://13.232.177.171";
        const userId = location.state.selectedUser.id;
  
        const userRes = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userData = userRes.data;
        console.log(userData, "user");
        setUserData(userData);
  
        const salarySlipRes = await axios.get(`/api/salary-slip`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const salarySlipData = salarySlipRes.data;
        console.log(salarySlipData.month=month, "salary_slip dat");
        const filteredData = salarySlipData.filter(slip => slip.month == month);
        if(!filteredData){
          return "no salary slips found"
        }
        setSalarySlipData(filteredData[0]);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserData();
  }, [selectedMonth, month]); 

  const downloadPDF = () => {
    if (slipRef.current) {
      const salarySlipContent = slipRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(salarySlipContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("salary_slip.pdf");
    } else {
      console.error("Slip element is not found");
    }
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <Form>{/* Your form elements here */}</Form>
            </Col>
          </Row>
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
            <Row>
              <Col>
                <SalarySlipTemplate
               userData={userData} // Change prop name
               salarySlipData={salarySlipData}
               selectedMonth={selectedMonth}
                  ref={slipRef}
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalarySlipModule;
