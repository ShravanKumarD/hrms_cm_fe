import React, { useState, useRef } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
import img from "./../assets/samcint_logo.jpeg";
import waterMark from './../assets/10.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const SalarySlipTemplate = React.forwardRef((props, ref) => {
  const { data } = props;
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
  };

  const downloadPDF = () => {
    if (slipRef.current) {
      html2canvas(slipRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = pdfMake.createPdf({
          content: [
            {
              image: imgData,
              width: 500,
            },
          ],
        });
        pdf.download("SalarySlip.pdf");
      });
    } else {
      console.error("Slip element is not found");
    }
  };

  if (!data) {
    return <div>Data not available</div>;
  }

  const netPay = data.total_earnings - data.total_deductions;

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
          <div
            ref={slipRef}
            style={{
              fontFamily: "Arial, open-sans",
              margin: "20px",
              padding: "20px",
              border: "1px solid #000",
              maxWidth: "600px",
              position: "relative",
            }}
          >
            {/* Watermark */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "50%",
                backgroundImage: `url(${waterMark})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                opacity: 0.2,
                zIndex: 1,
                pointerEvents: "none",
              }}
            />

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                style={{ height: "40px", width: "150px" }}
                src={img}
                alt="Company Logo"
              />
              <p>&nbsp;</p>
              <h2>SAMCINT SOLUTIONS PVT LTD</h2>
              <p>
                Kailashnath Arcade, #201 2nd Floor, Samcint Solutions Pvt. Ltd., Near
                Madhapur Metro station, opposite to HDFC Bank Lane, Hyderabad – 500033
              </p>
              <p>+91- 9663347744</p>
            </div>
            <hr />
            <h3 style={{ textAlign: "center", fontSize: "18px" }}>
              Salary slip for the month of {data.month}
            </h3>
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Name of Employee:</strong> {data.name}
              </p>
              <p>
                <strong>Address:</strong> {data.address}
              </p>
              <p>
                <strong>Designation:</strong> {data.designation}
              </p>
              <p>
                <strong>Month:</strong> {data.month}
              </p>
              <p>
                <strong>DOJ:</strong> {data.date_of_joining}
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
                    {data.basic_salary}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>TDS</td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.tds}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>H.R.A</td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.hra}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    Professional tax
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.professional_tax}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    Conveyance Allowance
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.conveyance_allowance}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    Employee PF
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.employee_pf}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    Special Allowance
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.special_allowance}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>Others</td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.other_deductions}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    Medical Allowance
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.medical_allowance}
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
                    {data.total_earnings}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    <strong>Total Deductions</strong>
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {data.total_deductions}
                  </td>
                </tr>
              </tfoot>
            </table>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <p>
                <strong>Net Pay:</strong>
                {netPay}
              </p>
            </div>
            <div>
              <p>
                <strong>For SAMCINT SOLUTIONS PVT LTD</strong>
              </p>
              <p>
                This is a system generated payslip and does not require any signature
              </p>
            </div>
            <hr />
            <p style={{ textAlign: "center" }}>
              4th Floor, B-Wing , Purva Summit, White field Road, Hitec city ,
              Kondapur,
              <br /> Telangana- 500081
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

export default SalarySlipTemplate;
