import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Row, Col, Form, Modal } from "react-bootstrap";
import axios from "axios";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import API_BASE_URL from "../env";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OfferLetterTemplate = ({
  userId,
  place,
  todaysDate,
  position,
  department,
  stipend,
  startDate,
  hrName,
}) => {
  const [showSlip, setShowSlip] = useState(false);
  const slipRef = useRef(null);
  const [user, setUser] = useState({});

  // Separate states for each form field

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;

        const userRes = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userData = userRes.data;
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      <Card>
        <Card.Body>
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
                    style={{ height: "40px", width: "150px" }}
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
                  <p>Date: {todaysDate} </p>
                  <p> {user.fullName}</p>
                  <p>{place}</p>
                  <p>
                    Dear {user.fullName}, we are delighted to extend an offer to
                    you for the position of <strong>{position}</strong> at
                    CreditMitra. After carefully considering your qualifications
                    and interview performance, we believe that your skills,
                    enthusiasm, and potential will greatly contribute to our
                    team and provide you with valuable learning opportunities.
                  </p>
                  <h4 style={{ fontSize: "16px" }}>
                    <strong>Position Details</strong>
                  </h4>
                  <p>
                    <strong>Position: </strong> {position}
                  </p>
                  <p>
                    <strong>Department: </strong> {department}
                  </p>
                  <p>
                    <strong>Salary: </strong>
                    {stipend}
                  </p>
                  <p>
                    <strong>Start Date: </strong>
                    {startDate}
                  </p>
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
                  <p>{hrName}</p>
                  <p>HR Manager</p>
                  <p>Samcint solutions pvt. ltd.</p>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OfferLetterTemplate;
