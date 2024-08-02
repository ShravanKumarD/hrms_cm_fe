import React, { useRef, useState } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ResignationTemplate = () => {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef(null);

  const toggleLetter = () => {
    setShowLetter(prevShowLetter => !prevShowLetter);
  };

  const downloadPDF = () => {
    if (letterRef.current) {
      const resignationContent = letterRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(resignationContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("resignation_letter.pdf");
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
                {showLetter ? "Hide Resignation Letter" : "Show Resignation Letter"}
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
                  <h1 style={{ textAlign: "center", color: '#EB7301', fontSize: '22px' }}><strong>Resignation Letter</strong></h1>
                  <p>&nbsp;</p>
                  <p>Date: {"dd.mm.yyyy"}</p>
                  <p>{"Recipient Name"}</p>
                  <p>{"Recipient Position"}</p>
                  <p>{"Company Name"}</p>
                  <p>{"Company Address"}</p>

                  <p>
                    Dear {"Recipient Name"},
                  </p>
                  <p>
                    I am writing to formally resign from my position as <strong>{"Your Position"}</strong> at <strong>{"Company Name"}</strong>, effective <strong>{"Last Working Day"}</strong>.
                  </p>
                  <p>
                    I have enjoyed working at <strong>{"Company Name"}</strong> and appreciate the opportunities I have been given. I will ensure that all my responsibilities are completed and will assist in the transition process.
                  </p>
                  <p>
                    Thank you for your support and understanding. Please let me know if there is anything specific you would like me to do before my departure.
                  </p>
                  <p>
                    Sincerely,
                  </p>
                  <p>{"Your Name"}</p>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResignationTemplate;
