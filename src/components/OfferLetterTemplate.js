import React, { useRef, useState } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OfferLetter = () => {
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);

  const toggleSlip = () => {
    setShowSlip(prevShowSlip => !prevShowSlip);
  };

  const downloadPDF = () => {
    if (slipRef.current) {
      const salarySlipContent = slipRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(salarySlipContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("offerletter.pdf");
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
              <Form>
                {/* Your form elements here */}
              </Form>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button onClick={toggleSlip}>
                {showSlip ? "Hide Offer Letter" : "Show Offer Letter"}
              </Button>
            </Col>
            <Col>
              <Button onClick={downloadPDF}>Download PDF</Button>
            </Col>
          </Row>
          {showSlip && (
            <Row>
              <Col>
                <div ref={slipRef} style={{ padding: '10px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', width: '80%', margin: '0 auto' }}>
                  <img style={{ height: "60px" }} src={img} alt="Company Logo" />
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <h1 style={{ textAlign: "center", color: '#EB7301', fontSize: '22px' }}><strong>Offer Letter</strong></h1>
                  <p>&nbsp;</p>
                  <p>Date: 25.03.24</p>
                  <p>{"name"}</p>
                  <p>{"place"}</p>
                  
                  
                  <p>
                  Dear {"name"}, we are delighted to extend an offer to you for the position of <strong>{"name"}</strong> at CreditMitra.
                    After carefully considering your qualifications and interview performance, we believe that
                    your skills, enthusiasm, and potential will greatly contribute to our team and provide you
                    with valuable learning opportunities.
                  </p>
                
                  <h2 style={{ fontSize: '18px' }}><strong>Position Details</strong></h2>
                  <p><strong>Position:</strong> {"position"}</p>
                  <p><strong>Department:</strong> {"Department"}</p>
                  <p><strong>Stipend:</strong> {"00000"}</p>
                  <p><strong>Start Date:</strong> {"1st April, 2024"}</p>
                  {/* <p><strong>End Date:</strong> 29th June, 2024</p> */}
                  <p><strong>Work Schedule:</strong> 9:30 am to 6:30 pm, Monday to Friday</p>
                  <p><strong>Location:</strong> Hyderabad</p>
                  
                  <p>
                    Our team at CreditMitra is looking forward to having you work with us. During your internship,
                    the concentration will be on helping you understand the theoretical concepts with their practicality
                    and implications to help you connect your classroom knowledge and on-field experience. We will be happy
                    to train you to learn new skills which are extremely helpful in the professional setting.
                  </p>
                
                  <p>Once again, congratulations to you on your selection and all the best for your endeavors.</p>
                  <p>&nbsp;</p>
                  <p>Regards,</p>
                  <p>{"HR name"}</p>
                  <p>HR Manager</p>
                  <p>CreditMitra</p>
                
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OfferLetter;
