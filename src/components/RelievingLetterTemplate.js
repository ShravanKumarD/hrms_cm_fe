import React, { useRef, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import html2canvas from "html2canvas";
import waterMark from "./../assets/10.png";


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const RelievingLetterTemplate = ({
  employeeName,
  employeeAddress,
  employeeID,
  position,
  department,
  dateOfJoining,
  dateOfRelieving,
  hrName,
  companyName,
  letterDate = new Date().toLocaleDateString(),
}) => {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef(null);

  const toggleLetter = () => {
    setShowLetter((prevShowLetter) => !prevShowLetter);
  };

  const downloadPDF = () => {
    if (letterRef.current) {
      html2canvas(letterRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = pdfMake.createPdf({
          content: [
            {
              image: imgData,
              width: 500,
            },
          ],
        });
        pdf.download("relievingLetter.pdf");
      });
    } else {
      console.error("Letter element is not found");
    }
  };
  return (
    <div>
      <Card>
        <Card.Body>
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
                       <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      left: "10%",
                      width: "60%",
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
                    <strong>Relieving Letter</strong>
                  </h1>
                  <p>&nbsp;</p>
                  <p>Date: {formatDate(letterDate)}</p>
                  <p>{employeeName}</p>
                  <p>{employeeAddress}</p>

                  <p>
                    Dear {employeeName}, we acknowledge the receipt of your
                    resignation and confirm that you have been relieved from
                    your duties with us. We thank you for your contributions to{" "}
                    {companyName} and wish you the best in your future
                    endeavors.
                  </p>

                  <h4>
                    <strong>Details</strong>
                  </h4>
                  <p>
                    <strong>Employee ID:</strong> {employeeID}
                  </p>
                  <p>
                    <strong>Position:</strong> {position}
                  </p>
                  <p>
                    <strong>Department:</strong> {department}
                  </p>
                  <p>
                    <strong>Date of Joining:</strong>{" "}
                    {formatDate(dateOfJoining)}
                  </p>
                  <p>
                    <strong>Date of Relieving:</strong>{" "}
                    {formatDate(dateOfRelieving)}
                  </p>

                  <p>
                    Your services with us have been satisfactory, and you are
                    relieved of your duties as of the above-mentioned date. If
                    you require any further assistance or documentation, please
                    feel free to reach out to us.
                  </p>

                  <p>Regards,</p>
                  <p>{hrName}</p>
                  <p>HR Manager</p>
                  <p>{companyName}</p>
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
