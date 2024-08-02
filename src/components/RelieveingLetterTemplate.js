import React, { useRef, useState } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import img from "./../assets/samcint_logo.jpeg"; 
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const RelievingLetterTemplate = () => {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef(null);

  const toggleLetter = () => {
    setShowLetter(prevShowLetter => !prevShowLetter);
  };

  const downloadPDF = () => {
    if (letterRef.current) {
      const relievingLetterContent = letterRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(relievingLetterContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("relieving_letter.pdf");
    } else {
      console.error("Letter element is not found");
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
              <Button onClick={toggleLetter}>
                {showLetter ? "Hide Relieving Letter" : "Show Relieving Letter"}
              </Button>
            </Col>
            <Col>
              <Button onClick={downloadPDF}>Download PDF</Button>
            </Col>
          </Row>
          {showLetter && (
            <Row>
              <Col>
                <div ref={letterRef} style={{ padding: '10px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', width: '80%', margin: '0 auto' }}>
                  <img style={{ height: "60px" }} src={img} alt="Company Logo" />
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <h1 style={{ textAlign: "center", color: '#EB7301', fontSize: '22px' }}><strong>Relieving Letter</strong></h1>
                  <p>&nbsp;</p>
                  <p>Date: 25.03.24</p>
                  <p>{"Employee Name"}</p>
                  <p>{"Employee Address"}</p>
                  
                  <p>
                    Dear {"Employee Name"}, we acknowledge the receipt of your resignation and confirm that you have been relieved from your duties with us.
                    We thank you for your contributions to the company and wish you the best in your future endeavors.
                  </p>
                
                  <h2 style={{ fontSize: '18px' }}><strong>Details</strong></h2>
                  <p><strong>Employee ID:</strong> {"Employee ID"}</p>
                  <p><strong>Position:</strong> {"Position"}</p>
                  <p><strong>Department:</strong> {"Department"}</p>
                  <p><strong>Date of Joining:</strong> {"Date of Joining"}</p>
                  <p><strong>Date of Relieving:</strong> {"Date of Relieving"}</p>
                  
                  <p>
                    Your services with us have been satisfactory, and you are relieved of your duties as of the above-mentioned date.
                    If you require any further assistance or documentation, please feel free to reach out to us.
                  </p>
                
                  <p>Regards,</p>
                  <p>{"HR Name"}</p>
                  <p>HR Manager</p>
                  <p>Company Name</p>
                
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default RelievingLetterTemplate;
