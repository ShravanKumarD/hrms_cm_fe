import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Row, Col, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import axios from "axios";
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const dateToday = new Date();
let latestDate = moment(dateToday).format("YYYY-MM-DD");

const HikeLetterTemplate = () => {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef(null);
  const [user, setUser] = useState("");
  const location = useLocation();

  const toggleLetter = () => {
    setShowLetter((prevShowLetter) => !prevShowLetter);
  };

  const downloadPDF = () => {
    if (letterRef.current) {
      const hikeLetterContent = letterRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(hikeLetterContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("hike_letter.pdf");
    } else {
      console.error("Letter element is not found");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const userId = location.state.selectedUser.id;

        const userRes = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userData = userRes.data;
        console.log(userData, "user hike letter");
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div>
      <Card>
        <Card.Body>
          <Row className="mt-3">
            <Col>
              <Button onClick={toggleLetter}>
                {showLetter ? "Hide Hike Letter" : "Show Hike Letter"}
              </Button>
            </Col>
            <Col>
              <Button onClick={downloadPDF}>Download PDF</Button>
            </Col>
          </Row>
          {showLetter && (
            <Row>
              <Col>
                <div
                  ref={letterRef}
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
                    <strong>Hike Letter</strong>
                  </h1>
                  <p>&nbsp;</p>
                  <p>Date: {latestDate}</p>
                  <p>Name: {user.fullName} </p>
                  <p>Place: {user.user_personal_info.city}</p>

                  <p>
                    Dear {user.fullName}, we are pleased to inform you that your
                    salary has been revised. Effective from{" "}
                    <strong>{latestDate}</strong>, your new salary will be{" "}
                    <strong>{"new salary"}</strong>. This hike reflects our
                    recognition of your hard work, dedication, and contributions
                    to the company.
                  </p>

                  <h4>
                    <strong>Revised Salary Details</strong>
                  </h4>
                  <p>
                    <strong>Previous Salary:</strong> {"previous salary"}
                  </p>
                  <p>
                    <strong>New Salary:</strong> {"new salary"}
                  </p>
                  <p>
                    <strong>Effective Date:</strong> {"effective date"}
                  </p>

                  <p>
                    We value your efforts and commitment and hope that this
                    increase will encourage you to continue excelling in your
                    role. Thank you for your continued contributions to the
                    company. If you have any questions or require further
                    information, please feel free to reach out.
                  </p>

                  <p>
                    Congratulations and best wishes for your continued success.
                  </p>
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

export default HikeLetterTemplate;
