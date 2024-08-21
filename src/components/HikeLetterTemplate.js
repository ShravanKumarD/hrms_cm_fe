import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../env";
import html2canvas from "html2canvas";
import waterMark from "./../assets/10.png";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const HikeLetterTemplate = ({
  userId,
  name,
  place,
  effective_date,
  new_salary,
  previous_salary,
  hr_name,
}) => {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef(null);
  const [user, setUser] = useState({});
  const location = useLocation();

  const dateToday = new Date();
  const latestDate = moment(dateToday).format("YYYY-MM-DD");

  const toggleLetter = () => {
    setShowLetter((prevShowLetter) => !prevShowLetter);
  };

  const downloadPDF = () => {
    if (letterRef.current) {
      html2canvas(letterRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = pdfMake.createPdf({
          info: {
            title: 'Hike Letter',
            author: 'Samcint Solutions Pvt. Ltd.',
            subject: 'Hike Letter Document',
            keywords: 'Hike letter, samcint, employment',
          },
          content: [
            {
              image: imgData,
              width: 500,
            },
          ],
        });
        pdf.download("HikeLetter.pdf");
      });
    } else {
      console.error("Letter element is not found");
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
                    position: "relative",
                    backgroundColor: "white", // Ensure background is white
                  }}
                >
                  {/* Watermark */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "10%",
                      width: "80%",
                      height: "50%",
                      backgroundImage: `url(${waterMark})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      opacity: 0.2,
                      pointerEvents: "none",
                      zIndex: 1, // Keep it behind the text but in front of the background
                    }}
                  />

                  <img
                    style={{ height: "40px", width: "150px", zIndex: 2 }}
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
                      zIndex: 2,
                    }}
                  >
                    <strong>Hike Letter</strong>
                  </h1>
                  <p>&nbsp;</p>
                  <p style={{ zIndex: 2 }}>Date: {latestDate}</p>
                  <p style={{ zIndex: 2 }}>Name: {name} </p>
                  <p style={{ zIndex: 2 }}>Place: {place}</p>

                  <p style={{ zIndex: 2 }}>
                    Dear {user.fullName}, we are pleased to inform you that your
                    salary has been revised. Effective from{" "}
                    <strong>{effective_date}</strong>, your new salary will be{" "}
                    <strong>{new_salary}</strong>. This hike reflects our
                    recognition of your hard work, dedication, and contributions
                    to the company.
                  </p>

                  <h4 style={{ zIndex: 2 }}>
                    <strong>Revised Salary Details</strong>
                  </h4>
                  <p style={{ zIndex: 2 }}>
                    <strong>Previous Salary:</strong> {previous_salary}
                  </p>
                  <p style={{ zIndex: 2 }}>
                    <strong>New Salary:</strong> {new_salary}
                  </p>
                  <p style={{ zIndex: 2 }}>
                    <strong>Effective Date:</strong> {effective_date}
                  </p>

                  <p style={{ zIndex: 2 }}>
                    We value your efforts and commitment and hope that this
                    increase will encourage you to continue excelling in your
                    role. Thank you for your continued contributions to the
                    company. If you have any questions or require further
                    information, please feel free to reach out.
                  </p>

                  <p style={{ zIndex: 2 }}>
                    Congratulations and best wishes for your continued success.
                  </p>
                  <p>&nbsp;</p>
                  <p style={{ zIndex: 2 }}>Regards,</p>
                  <p style={{ zIndex: 2 }}>{hr_name}</p>
                  <p style={{ zIndex: 2 }}>HR Manager</p>
                  <p style={{ zIndex: 2 }}>CreditMitra</p>
                  <hr />
                  <p style={{ textAlign: "center", zIndex: 2 }}>
                    4th Floor, B-Wing , Purva Summit, White field Road, Hitec city , Kondapur,<br/> Telangana- 500081
                  </p>
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
