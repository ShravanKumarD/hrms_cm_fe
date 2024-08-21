import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import API_BASE_URL from "../env";
import waterMark from "./../assets/10.png";
import html2canvas from "html2canvas";
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
  sender_title,
}) => {
  const [showSlip, setShowSlip] = useState(false);
  const slipRef1 = useRef(null);
  const slipRef2 = useRef(null);
  const [user, setUser] = useState({});

  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
  };

  const downloadPDF = async () => {
    if (slipRef1.current && slipRef2.current) {
      const canvas1 = await html2canvas(slipRef1.current, { scale: 2 });
      const canvas2 = await html2canvas(slipRef2.current, { scale: 2 });

      const imgData1 = canvas1.toDataURL("image/png");
      const imgData2 = canvas2.toDataURL("image/png");

      const docDefinition = {
        info: {
          title: 'Offer Letter',
          author: 'Samcint Solutions Pvt. Ltd.',
          subject: 'Offer Letter Document',
          keywords: 'offer letter, samcint, employment',
        },
        pageSize: "A4",
        content: [
          {
            image: imgData1,
            width: 500,
            height: 750,
          },
          {
            text: "",
            pageBreak: "before"
          },
          {
            image: imgData2,
            width: 500,
            height: 750,
          }
        ],
        pageMargins: [40, 60, 40, 60],
        defaultStyle: {
          font: 'Roboto',
        },
      };

      const pdf = pdfMake.createPdf(docDefinition);
      pdf.download("offerLetter_samcint.pdf");
    } else {
      console.error("Slip elements are not found");
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

  const pageStyle = {
    position: "relative",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    width: "80%",
    margin: "20px auto",
    border: "1px solid #000",
    zIndex: 0,
  };

  const waterMarkStyle = {
    content: '""',
    position: "absolute",
    top: 140,
    left: 100,
    width: "65%",
    height: "65%",
    backgroundImage: `url(${waterMark})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    opacity: 0.1,
    zIndex: -1,
  };

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
            <>
              <Row>
                <Col>
                  <div ref={slipRef1} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    <img style={{ height: "40px", width: "150px" }} src={img} alt="logo" />
                    <p>&nbsp;</p>
                    <p style={{textAlign:"right"}}>Date: {todaysDate} </p>
                    <h1 style={{ textAlign: "center", color: "#EB7301", fontSize: "22px" }}>
                      <strong>Offer Letter</strong>
                    </h1>
                    <p> {user.fullName}</p>
                    {/* <p>{place}</p> */}

                    <p>Greetings from Samcint Solutions Private Limited!</p>

                    <p>
                      With reference to our discussions and meetings, we are pleased to offer you full-time employment with our esteemed organisation Samcint Solutions Private Limited as <strong>{position}.</strong>
                    </p>

                    <p>
                      <strong>We are glad to inform you your revised CTC will be Rs. {stipend}</strong>
                    </p>
                    <p>
                      Your initial place of posting will be the Company's office in Hyderabad, India. Your date of joining will be {startDate}. Further, your compensation including fixed components will be as per Annexure A.
                    </p>
                    <p>
                      You understand that this employment is being offered to you based on the particulars submitted by you with the Company at the time of the recruitment process. The management has the right to investigate your education and employment background based on the facts provided by you either in your "Resume" or during the course of your interview. You hereby give your consent to the transfer of your personally identifiable information and specifically authorise the Company to validate the information provided by you and to conduct your background reference check throughout India or abroad. However, if at any time it should emerge that the particulars furnished by you are false/incorrect or if any material or relevant information has been suppressed or concealed this appointment will be considered ineffective and irregular and would be liable to be terminated by the management forthwith. Without notice. This will be without prejudice to the right of the management to take disciplinary action against you for the same.
                    </p>
                    <p>
                      The offer has been made to you in the strictest of confidence. Disclosure to any person at any time, including after issuance of an appointment letter, of these terms, shall make it void.
                    </p>
                    <p>This offer is subject to:</p>
                    <p>a. Successful clearance of your background verification.</p>
                    <p>
                      We request you kindly acknowledge this offer letter/email with your acceptance of the offer and date of joining. If we don't receive your confirmation by {startDate}, this offer will stand withdrawn. The Company reserves the right to revoke the offer letter prior to receiving your written official acceptance.
                    </p>
                  </div>
                 
                </Col>
              </Row>
              <Row>
                <Col>
                  <div ref={slipRef2} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                 
                   
                    <p>
                      A formal appointment letter will be entered into between the Company and you, post the acceptance of the offer. You agree to sign and abide by the terms of the agreement after accepting this offer letter. Further, please note that by accepting this offer, you agree to abide by the rules, by-laws, and policies of the Company.
                    </p>
                    <p>
                      We look forward to your joining the Company and contributing towards mutual and beneficial association.
                    </p>

                    <h4><strong>Code of conduct for employees in the organization</strong></h4>
                    <ul>
                      <li>Employees are expected to treat colleagues, clients, and stakeholders with respect and professionalism at all times.</li>
                      <li>Employees must comply with all applicable laws, regulations, and company policies in the course of their duties.</li>
                      <li>Employees must maintain the confidentiality of sensitive company information and customer data. They should not disclose proprietary information to unauthorized persons.</li>
                      <li>Employees should avoid situations where personal interests conflict with the interests of the company. They must disclose any potential conflicts of interest to management.</li>
                      <li>The organization prohibits discrimination, harassment, and retaliation based on protected characteristics such as race, gender, religion, disability, or sexual orientation.</li>
                      <li>Guidelines on the appropriate use of social media and communication channels, ensuring that personal opinions do not reflect poorly on the company.</li>
                      <li>Employees should conduct themselves ethically and with integrity in all business dealings. This includes avoiding bribery, fraud, and any form of unethical behaviour.</li>
                    </ul>
                    <p>&nbsp;</p>
                    <p>
                      <strong>Disciplinary actions that may result from violations of the code of conduct which could range from warnings to termination of employment without salary payment.</strong>
                    </p>


                 <br/>  
                    <p style={{textAlign:"right"}}>Employee Sign </p>
                    <p>Regards,</p>
                    <p>{hrName}</p>
                    <p>{sender_title}</p>
                    <p>Samcint solutions pvt. ltd.</p>

                    <hr />
                    <p style={{ textAlign: "center" }}>
                      4th Floor, B-Wing , Purva Summit, White field Road, Hitec city , Kondapur,
                      <br /> Telangana- 500081
                    </p>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OfferLetterTemplate;