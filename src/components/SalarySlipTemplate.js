import React, { Component, createRef } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class SalarySlipTemplate extends Component {
  render() {
    return (
      <div
        ref={this.props.slipRef}
        style={{
          fontFamily: "Arial, sans-serif",
          margin: "20px",
          padding: "20px",
          border: "1px solid #000",
          maxWidth: "600px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={img} alt="Company Logo" />
          <h2>SAMCINT SOLUTIONS PVT LTD</h2>
          <p>
            Kailashnath Arcade, #201 2nd Floor, Samcint Solutions Pvt. Ltd.,
            Near Madhapur Metro station, opposite to HDFC Bank Lane, Hyderabad –
            500033
          </p>
          <p>+91- 9663347744</p>
        </div>

        <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
          Salary Slip for the month of April - 2024
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Name of Employee:</strong> shravan kumar
          </p>
          <p>
            <strong>Address:</strong> Kailashnath Arcade, #201 2nd Floor,
            opposite to HDFC bank Lane, near Madhapur metro station, Hyderabad –
            500033
          </p>
          <p>
            <strong>Designation:</strong> Digital Marketing Manager
          </p>
          <p>
            <strong>Month:</strong> April 2024
          </p>
          <p>
            <strong>DOJ:</strong> 17.01.2024
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
                33,333
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>TDS</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>0.00</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>H.R.A</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                13,333
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Professional tax
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>200</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Conveyance Allowance
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                1,333
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Employee PF
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                1,800.00
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Special Allowance
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                11,292
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>Others</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>0.00</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Medical Allowance
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                1,042
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
                60,333
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                <strong>Total Deductions</strong>
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>2,000</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>
            <strong>Net Pay:</strong> Rs. 58,333
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
  }
}

class SalarySlipModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSlip: false,
    };
    this.slipRef = createRef();
  }

  toggleSlip = () => {
    this.setState(prevState => ({
      showSlip: !prevState.showSlip,
    }));
  }

  downloadPDF = () => {
    if (this.slipRef.current) {
      const salarySlipContent = this.slipRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(salarySlipContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("salary_slip.pdf");
    } else {
      console.error("Slip element is not found");
    }
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <Form>
                  {/* Your form elements here */}
                </Form>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button onClick={this.toggleSlip}>
                  {this.state.showSlip ? "Hide Salary Slip" : "Show Salary Slip"}
                </Button>
              </Col>
              <Col>
                <Button onClick={this.downloadPDF}>Download PDF</Button>
              </Col>
            </Row>
            {this.state.showSlip && (
              <Row>
                <Col>
                  <SalarySlipTemplate slipRef={this.slipRef} />
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default SalarySlipModule;
