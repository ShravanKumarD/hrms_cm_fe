import React, { useRef, useState } from "react";
import { Button, Card, Row, Col, Form,Modal  } from "react-bootstrap";
import moment from 'moment';
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OfferLetter = () => {
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);
  const [formData, setFormData] = useState({
    todaysDate: '',
    place: '',
    name: '',
    position: '',
    department: '',
    stipend: '',
    startDate: '',
    hrName: '',
  });
  const [showModal, setShowModal] = useState(false);

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
    handleShowModal()
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

    // Handler to update form data
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    // Handler to open the modal
    const handleShowModal = () => {
      setShowModal(true);
    };
  
    // Handler to close the modal
    const handleCloseModal = () => {
      setShowModal(false);
    };
    
  return (
    <div>
      <Card>
        <Card.Body>
          <Row>
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
                <div
                  ref={slipRef}
                  style={{
                    padding: "10px",
                    fontFamily: "Arial, sans-serif",
                    lineHeight: "1.6",
                    width: "80%",
                    margin: "20px",
                    padding: "20px",
                    border: "1px solid #000",
                  }}
                >
                  <img
                    style={{ height: "40px",width:"150px" }}
                    src={img}
                    alt="Company Logo"
                  />
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <h1
                    style={{
                      textAlign: "center",
                      color: "#EB7301",
                      fontSize: "22px",
                    }}
                  >
                    <strong>Offer Letter</strong>
                  </h1>
                  <p>&nbsp;</p>
                  <p>Date: {formData.todaysDate} </p>
                  <p> {formData.name}</p>
                  <p>{formData.place}</p>
                

                  <p>
                    Dear {formData.name}, we are delighted to extend an offer to you
                    for the position of <strong>{formData.position}</strong> at
                    CreditMitra. After carefully considering your qualifications
                    and interview performance, we believe that your skills,
                    enthusiasm, and potential will greatly contribute to our
                    team and provide you with valuable learning opportunities.
                  </p>

                  <h4 style={{fontSize:"16px"}}>
                    <strong>Position Details</strong>
                  </h4>
                  <p>
                    <strong>Position:</strong> {formData.position}
                  </p>
                  <p>
                    <strong>Department:</strong> {formData.department}
                  </p>
                  <p>
                    <strong>Stipend:</strong>{formData.stipend}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{formData.startDate}
                  </p>
                  {/* <p><strong>End Date:</strong> 29th June, 2024</p> */}
                  <p>
                    <strong>Work Schedule:</strong> 9:30 am to 6:30 pm, Monday
                    to Friday
                  </p>
                  <p>
                    <strong>Location:</strong> Hyderabad
                  </p>

                  <p>
                    Our team at CreditMitra is looking forward to having you
                    work with us. During your internship, the concentration will
                    be on helping you understand the theoretical concepts with
                    their practicality and implications to help you connect your
                    classroom knowledge and on-field experience. We will be
                    happy to train you to learn new skills which are extremely
                    helpful in the professional setting.
                  </p>

                  <p>
                    Once again, congratulations to you on your selection and all
                    the best for your endeavors.
                  </p>
                  <p>&nbsp;</p>
                  <p>Regards,</p>
                  <p>{formData.hrName}</p>
                  <p>HR Manager</p>
                  <p>Samcint solutions pvt. ltd.</p>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      <div className="container-fluid pt-2">

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Position Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Today's Date</Form.Label>
              <Form.Control
                type="date"
                name="todaysDate"
                value={formData.todaysDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Place</Form.Label>
              <Form.Control
                type="text"
                name="place"
                value={formData.place}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stipend</Form.Label>
              <Form.Control
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>HR Name</Form.Label>
              <Form.Control
                type="text"
                name="hrName"
                value={formData.hrName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default OfferLetter;
