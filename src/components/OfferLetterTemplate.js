import React, { useRef, useState, useEffect, forwardRef } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import img from "./../assets/samcint_logo.jpeg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import API_BASE_URL from "../env";
import waterMark from "./../assets/10.png";
import html2canvas from "html2canvas";
import "./OfferletterTable.css";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OfferLetterTemplate = forwardRef(({
  userId,
  place,
  todaysDate,
  position,
  department,
  stipend,
  startDate,
  hrName,
  sender_title,props
}, ref) => {
  const [showSlip, setShowSlip] = useState(false);
  const [user, setUser] = useState({});
  const pageRefs = useRef([]);
  const toggleSlip = () => {
    setShowSlip((prevShowSlip) => !prevShowSlip);
  };
let compensationDetails=JSON.parse(localStorage.getItem('compensationDetails'));
console.log(compensationDetails,'compensationDetails')
  // const downloadPDF = async () => {
  //   if (pageRefs.current && pageRefs.current.length > 0) {
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 500));
  
  //       // Capture canvases for each page
  //       const canvases = await Promise.all(
  //         pageRefs.current.map(pageRef => 
  //           pageRef ? html2canvas(pageRef, { scale: 2 }) : Promise.resolve(null)
  //         )
  //       );
  
  //       // Convert canvases to image data
  //       const imgData = canvases
  //         .filter(canvas => canvas !== null)
  //         .map(canvas => canvas.toDataURL("image/png"));

  //       const docDefinition = {
  //         info: {
  //           title: "Offer Letter",
  //           author: "Samcint Solutions Pvt. Ltd.",
  //           subject: "Offer Letter Document",
  //           keywords: "offer letter, samcint, employment",
  //         },
  //         pageSize: "A4",
  //         content: imgData.map((data, i) => ({
  //           image: data,
  //           width: 500,
  //           height: 750,
  //           pageBreak: i < imgData.length - 1 ? "before" : null,
  //         })),
  //         pageMargins: [40, 60, 40, 60],
  //         defaultStyle: {
  //           font: "Roboto",
  //         },
  //       };
  //       const pdf = pdfMake.createPdf(docDefinition);
  //       pdf.download("offerLetter_samcint.pdf");
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //     }
  //   } else {
  //     console.error("No pages found for PDF generation");
  //   }
  // };

  const downloadPDF = async () => {
    localStorage.removeItem('compensationDetails');
    if (pageRefs.current && pageRefs.current.length > 0) {
      try {
        await new Promise(resolve => requestAnimationFrame(resolve));
  
        // Capture canvases for each page
        const canvases = await Promise.all(
          pageRefs.current.map(pageRef => 
            pageRef ? html2canvas(pageRef, { scale: 2 }) : Promise.resolve(null)
          )
        );
  
        // Convert canvases to image data
        const imgData = canvases
          .filter(canvas => canvas !== null)
          .map(canvas => canvas.toDataURL("image/png"));
  
        // Define PDF document
        const docDefinition = {
          info: {
            title: "Offer Letter",
            author: "Samcint Solutions Pvt. Ltd.",
            subject: "Offer Letter Document",
            keywords: "offer letter, samcint, employment",
          },
          pageSize: "A4",
          content: imgData.map((data, i) => ({
            image: data,
            width: 500,
            height: 750,
            pageBreak: i < imgData.length - 1 ? "before" : null,
          })),
          pageMargins: [40, 60, 40, 60],
          defaultStyle: {
            font: "Roboto",
          },
        };
  
        // Create and download PDF
        const pdf = pdfMake.createPdf(docDefinition);
        pdf.download("offerLetter_samcint.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      console.error("No pages found for PDF generation");
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
        <>
  <div style={{ textAlign: "center", marginTop: "20px", }}>
   <Row>
<Col>
  <button className="dashboard-icons" onClick={toggleSlip}>
    {showSlip ? "Hide Salary Slip" : "Show Salary Slip"}
  </button>
  </Col>
  <Col>
  <button className="dashboard-icons" onClick={downloadPDF} style={{ marginLeft: "10px" }}>
    Download PDF
  </button>
  </Col>
  </Row>
</div>


<Card.Body>
          {showSlip && (
            <>
              <Row>
                <Col>
                <div ref={el => (pageRefs.current[0] = el)} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    <img
                      style={{ height: "40px", width: "150px" }}
                      src={img}
                      alt="logo"
                    />
                    <p>&nbsp;</p>
                    <p style={{ textAlign: "right" }}>Date: {todaysDate} </p>
                    <h1
                      style={{
                        textAlign: "center",
                        color: "#EB7301",
                        fontSize: "22px",
                      }}
                    >
                      <strong>LETTER OF APPOINTMENT</strong>
                    </h1>
                    <p> {user.fullName}</p>
                    {/* <p>{place}</p> */}

                    <p>Greetings from Samcint Solutions Private Limited!</p>

                    <p>
                      Pursuant to our meetings & discussions, we are pleased to
                      offer you full-time Employment, with our esteemed
                      organization <strong> Samcint Solutions Pvt Ltd.</strong>
                    </p>
                    <ul>
                      <li>Your current designation will be{}</li>
                      <li>
                        You will be required to work at the Company's office in{" "}
                        <strong>Hyderabad, India.</strong>{" "}
                      </li>
                      <li>
                        Your all-inclusive Annual compensation (on a
                        cost-to-company basis) will be INR {stipend}
                        which shall be paid monthly. The Company shall deduct
                        all taxes from source at the time of payment.
                      </li>
                    </ul>

                    <p>
                      The terms and conditions of your appointment are as
                      follows.
                    </p>
                    <p>
                      <strong>1. APPOINTMENT AND REPORTING</strong>
                    </p>
                    <p>
                      This appointment offer is purely provisional, subject to
                      your joining on or before {startDate}2024 and it will be
                      withdrawn immediately if any of the following events
                      occur.{" "}
                    </p>

                    <ul>
                      <li>
                        If any information provided by you is found to be
                        incorrect or misrepresented or concealment of any
                        important information.
                      </li>
                      <li>
                        If any documents furnished by you for this employment
                        are found false/fabricated.
                      </li>
                      <li>Adverse report of your background verification.</li>
                    </ul>
                    <p>
                      <strong>2. EMOLUMENTS AND TAXES </strong>
                    </p>
                    <p>
                      Your remuneration will be as per the details provided in
                      Annexure annexed hetero. You shall be solely responsible
                      for paying taxes, direct or indirect, central or local
                      payable in India. The Company is entitled to deduct from
                      your remuneration, income tax, other taxes and levies
                      which it is liable to deduct at source as applicable.{" "}
                    </p>
                    <p>
                      All information regarding your remuneration and terms of
                      employment are confidential and you shall not divulge the
                      contents to any other employee of the Company.{" "}
                    </p>
                    <p>
                      <strong>3. TERMINATION </strong>
                    </p>
                    <p>
                      Either the Company or you may terminate your employment at
                      any time, without assigning any reasons, by providing one
                      (1) month's written notice or One (1) month's basic salary
                      in lieu thereof. However, considering that during the
                      course of your employment with the Company, you shall be
                      privy to or shall otherwise have access to sensitive and
                      confidential information of the Company,<br/>
                    </p>
                  
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div ref={el => (pageRefs.current[1] = el)} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    <p>  which may include
                      products' related information for existing or conceived
                      products, business plans, information related to existing
                      and planned projects, vendors and partners' related
                      information and other valuable information of the Company
                      or you may be or need to be engaged in a project that
                      needs to be completed or for the needs of other business
                      reasons/requirements, in the event you choose to terminate
                      your employment with the Company,the Company shall have
                      the right to refuse acceptance of Two(1) months' basic
                      salary in lieu of notice period and (i) require you to
                      continue to serve the Company during the notice period or
                      any part thereof, OR (ii) for the duration of the notice
                      period or any part thereof, require that you do not
                      perform any official duties or attend office and return
                      all assets provided by the Company, provided however that
                      during such notice period or part thereof, you shall not
                      take up employment or any other engagement (including as a
                      consultant or advisor), whether on a full-time or
                      part-time basis, with any other person or entity.{" "}</p>
                    <li>
                      Your employment shall stand terminated forthwith without
                      any notice period in the event of the following.
                    </li>
                    <ul>
                      (i) If you do not join within the stipulated date unless
                      extended in writing.{" "}
                    </ul>
                    <ul>
                      (ii) ii.If you are held guilty of any offence involving
                      moral turpitude or any breach of the code of conduct of
                      the Company.{" "}
                    </ul> 
                    <p>
                      Upon termination of your employment, you (or your legal
                      heirs as the case may be) will complete the exit
                      formalities and shall immediately return to the Company,
                      any and all documents, manuals, documented confidential
                      information (without making any copies thereof and/ or
                      extracts therefrom), kits and other property belonging to
                      the Company that may be entrusted to and/ or placed in
                      your possession by virtue of and/ or during the course of
                      your employment with the Company. You (or your legal heirs
                      as the case may be) shall also deliver to the Company
                      immediately all notes, analyses, summaries and working
                      papers relating thereto. Prior to leaving the Company, you
                      will also ensure that all your outgoing/ pending
                      activities are successfully completed and properly handed
                      over to the satisfaction of your reporting manager.{" "}
                    </p>
                    <p>
                      <strong> 4. INITIAL POSTING AND TRANSFER </strong>
                    </p>
                    <ul>
                      <li>
                        Your initial place of posting shall be in{" "}
                        <strong>Hyderabad</strong>.
                      </li>
                      <li>
                        However, at the sole discretion of the Management, you
                        will be liable to be transferred /deputed from one place
                        to another anywhere in India or abroad and/or from one
                        department to another or from one establishment to
                        another and/or to any other concern including to any of
                        Company's affiliates, associates, group companies and/or
                        entities in which the Company may be having any interest
                        whether existing or which may be set up in future.
                      </li>
                      <li>
                        Consequent to your transfer, all the existing terms and
                        conditions of your employment shall remain the same.
                      </li>
                      <li>
                        As per the exigency of business, you may be required to
                        carry out additional work for the Company's
                        affiliates/associates/group companies.
                      </li>
                      <li>
                        oAs per the exigency of business, you may be required to
                        carry out additional work for the Company's
                        affiliates/associates/group companies.
                      </li>
                    </ul>

                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div ref={el => (pageRefs.current[2] = el)} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    
                    <p>
                      <strong>5. PROBATION PERIOD </strong>
                    </p>
                    <p>
                      You will receive a confirmation letter upon the completion
                      of your probationary period, which will be 6 (six) months.
                      During this time, if performance reviews determine that
                      you are not meeting performance standards, you may be
                      removed from your appointed post without cause or notice.
                    </p>
                    <p>
                      <strong>6. GENERAL EMPLOYMENT OBLIGATIONS: </strong>
                    </p>
                    <ul>
                      <li>
                        During your employment with us, you shall not be
                        engaged, concerned or interested directly or indirectly
                        in any other occupation, business or employment
                        whatsoever (either for remuneration or on an honorary
                        basis), and shall devote your whole time, attention and
                        abilities exclusively to the performance of your duties
                        and shall faithfully serve the Company and use your best
                        endeavour to promote the interest and business thereof.
                        In the event of above, the company shall be entitled to
                        take appropriate action.{" "}
                      </li>
                      <li>
                        You shall be governed by the service rules and
                        regulations of the Company, as amended by the
                        Management, from time to time including the code of
                        conduct, the terms of which are hereby incorporated by
                        reference. You shall sincerely abide by and carry out
                        operational instructions/procedures as contained in the
                        Company's guidelines and other administrative
                        instructions as may be issued by the Management from
                        time to time. <br />
                        You shall keep the Management always informed of your
                        latest postal address and intimate in writing in case of
                        change of address. Any communication sent to you by the
                        management on your last known address (as intimated by
                        you) shall be deemed to have been duly served
                        notwithstanding the fact that you have changed your
                        address.{" "}
                      </li>
                    </ul>
                    <p>
                      <strong>7. CONFIDENTIALITY </strong>
                    </p>
                    <ul>
                      <li>
                        You shall not, except as authorized or required by your
                        obligations in terms hereof, reveal to any person or
                        entity any of the trade secrets, secret or confidential
                        information, information contained in any manuals or
                        dealings or any information concerning the organization,
                        business, finances, transactions or affairs of the
                        Company and/or its affiliates/associates/group companies
                        (confidential information), which may come to your
                        knowledge and/ or be imparted to you by the Company
                        during his employment hereunder. You shall hold in
                        strict confidence, all such confidential information.
                        This restriction shall survive termination of your
                        employment with the Company without limit in point of
                        time but shall cease to apply to information or
                        knowledge which may come into the public domain without
                        any of fault on your part.{" "}
                      </li>
                      <li>
                        You shall not during the term of your employment or at
                        any time thereafter, use or permit to be used, any
                        information, notes or memoranda relating to the business
                        and/ or transactions of the Company and/or its
                        affiliates/associates/group companies which may come to
                        your knowledge and/ or possession by virtue of his
                        employment with the Company for any purpose other than
                        for the benefit of the Company.{" "}
                      </li>
                      <li>
                        You acknowledge that the breach of any of the provisions
                        of Clause 6 hereof will cause irreparable loss and harm
                        to the Company which cannot be reasonably or adequately
                        compensated by damages in an action at law, and
                        accordingly, the Company will be entitled, to injunctive
                        and other equitable relief to prevent or cure any breach
                        or threatened breach thereof, but no action for any such
                        relief shall be deemed to waive the right of the Company
                        to an action for damages.
                      </li>
                    </ul>
                  
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div ref={el => (pageRefs.current[3] = el)} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    <p>
                      <strong> 8. LEAVES AND OTHER SERVICE BENEFITS </strong>
                    </p>
                    <p>
                      You will be entitled to 10 (Ten) days of general leave in
                      a calendar year. This leave will include annual, sick,
                      privilege, and casual leaves, as well as 2 (two) optional
                      leaves. It is subject to change at the company's sole
                      discretion and in compliance with applicable laws. The
                      mentioned leaves are applicable upon the completion of the
                      probationary period.
                    </p>
                    <p>
                      Holidays and other service benefits shall be as per
                      applicable laws and the rules of the management as framed
                      from time to time and applicable to the managerial cadre
                      employees in the office/establishment/department in which
                      you are for the time being posted including maternity
                      benefits as per the Parental Leave Policy of the Company,
                      as applicable.{" "}
                    </p>
                    <p>
                      <strong>9. CONTINUATION OF EMPLOYMENT </strong>
                    </p>
                    <ul>
                      <li>
                        It is understood that this employment is being offered
                        to you based on the particulars submitted by you with
                        the Company at the time of recruitment process. However,
                        if at any time it should emerge that the particulars
                        furnished by you are false/incorrect or if any material
                        or relevant information has been suppressed or concealed
                        this appointment will be considered ineffective and
                        irregular and would be liable to be terminated by the
                        management forthwith. Without notice. This will be
                        without prejudice to the right of the management to take
                        disciplinary action against you for the same.
                      </li>
                      <li>
                        Your appointment and its continuation is subject to your
                        being medically fit and the Management reserves its
                        right to ask you to undergo medical examination, as and
                        when deemed necessary.
                      </li>
                    </ul>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p> Yours faithfully</p>
                    <p>
                      <strong>Human Resource Department</strong>
                    </p>
                    <p>{hrName}</p>
                    <p>{sender_title}</p>
                    <p>Samcint solutions pvt. ltd.</p>
                    <p>&nbsp;</p>
                    <p>
                      I have gone through the aforesaid terms and conditions /
                      terms of appointment and have fully understood the same. I
                      hereby accept the above appointment on the terms and
                      conditions stated herein above.{" "}
                    </p>
                    <p style={{ textAlign: "right" }}>
                      Signature of the Employee
                    </p>
                  


                  {/* yours */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div ref={el => (pageRefs.current[4] = el)} style={pageStyle}>
                    <div style={waterMarkStyle}></div>
                    <h2>COMPENSATION STRUCTURE</h2>
                    <table class="styled-table">
  <tr>
    <th class="header"></th>
    <th class="header">Date of Joining</th>
    <th class="header">Designation</th>
    <th class="header" colspan="2">
      Salary & Benefits Structure
    </th>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td>Salary PM</td>
    <td>Salary PA</td>
  </tr>
  <tr>
    <td class="section-title" colspan="5">
      A) Fixed Pay
    </td>
  </tr>
  <tr>
    <td class="header">Basic</td>
    <td>-</td>
    <td>-</td>
    <td>{compensationDetails.basic}</td>
    <td>-</td>
  </tr>
  <tr>
    <td class="header">House Rent Allowance</td>
    <td>-</td>
    <td>-</td>
    <td>{compensationDetails.houseRentAllowance}</td>
    <td>-</td>
  </tr>
  <tr>
    <td class="header">Medical Allowance</td>
    <td>{compensationDetails.medicalAllowance}</td>
    <td>{compensationDetails.medicalAllowance * 12}</td>
    <td>{compensationDetails.medicalAllowance}</td>
    <td>{compensationDetails.medicalAllowance * 12}</td>
  </tr>
  <tr>
    <td class="header">Conveyance Allowance</td>
    <td>{compensationDetails.conveyanceAllowance}</td>
    <td>{compensationDetails.conveyanceAllowance * 12}</td>
    <td>{compensationDetails.conveyanceAllowance}</td>
    <td>{compensationDetails.conveyanceAllowance * 12}</td>
  </tr>
  <tr>
    <td class="header">Special Allowance</td>
    <td>-</td>
    <td>-</td>
    <td>{compensationDetails.specialAllowance}</td>
    <td>-</td>
  </tr>
  <tr>
    <td class="header">Performance Bonus</td>
    <td>-</td>
    <td>-</td>
    <td>{compensationDetails.performanceBonus}</td>
    <td>-</td>
  </tr>
  <tr>
    <td class="header">Gross Salary</td>
    <td>-</td>
    <td>-</td>
    <td>{compensationDetails.grossSalary}</td>
    <td>-</td>
  </tr>
  <tr>
    <td class="section-title" colspan="5">
      B) Deductions
    </td>
  </tr>
  <tr>
    <td class="header">Employee PF</td>
    <td>{compensationDetails.employeePF}</td>
    <td>{compensationDetails.employeePF * 12}</td>
    <td>{compensationDetails.employeePF}</td>
    <td>{compensationDetails.employeePF * 12}</td>
  </tr>
  <tr>
    <td class="header">Professional Tax</td>
    <td>{compensationDetails.professionalTax}</td>
    <td>{compensationDetails.professionalTax * 12}</td>
    <td>{compensationDetails.professionalTax}</td>
    <td>{compensationDetails.professionalTax * 12}</td>
  </tr>
  <tr>
    <td class="header">TDS</td>
    <td>{compensationDetails.tds}</td>
    <td>{compensationDetails.tds * 12}</td>
    <td>{compensationDetails.tds}</td>
    <td>{compensationDetails.tds * 12}</td>
  </tr>
  <tr>
    <td class="header">Total Deductions</td>
    <td>{compensationDetails.totalDeductions}</td>
    <td>{compensationDetails.totalDeductions * 12}</td>
    <td>{compensationDetails.totalDeductions}</td>
    <td>{compensationDetails.totalDeductions * 12}</td>
  </tr>
  <tr>
    <td class="section-title" colspan="5">
      Net Salary
    </td>
  </tr>
  <tr>
    <td class="header">Net Salary</td>
    <td>{compensationDetails.netSalary}</td>
    <td>{compensationDetails.netSalary * 12}</td>
    <td>{compensationDetails.netSalary}</td>
    <td>{compensationDetails.netSalary * 12}</td>
  </tr>
  <tr>
    <td class="section-title" colspan="5">
      C) Other Benefits (Not Paid in Cash)
    </td>
  </tr>
  <tr>
    <td class="header">
      Provident Fund (Employer's Contribution)
    </td>
    <td>{compensationDetails.providentFund}</td>
    <td>{compensationDetails.providentFund * 12}</td>
    <td>{compensationDetails.providentFund}</td>
    <td>{compensationDetails.providentFund * 12}</td>
  </tr>
  <tr>
    <td class="header">Total</td>
    <td>{compensationDetails.providentFund}</td>
    <td>{compensationDetails.providentFund * 12}</td>
    <td>{compensationDetails.providentFund}</td>
    <td>{compensationDetails.providentFund * 12}</td>
  </tr>
  <tr>
    <td class="section-title" colspan="5">
      Cost to Company (CTC = A + C)
    </td>
  </tr>
  <tr>
    <td class="header">Cost to Company (CTC)</td>
    <td>-</td>
    <td>-</td>
    <td>{Number(compensationDetails.basic) +
     Number(compensationDetails.houseRentAllowance) + 
     Number(compensationDetails.medicalAllowance )+ 
     Number(compensationDetails.conveyanceAllowance) + 
     Number (    compensationDetails.specialAllowance )+
     Number( compensationDetails.performanceBonus) +Number( compensationDetails.providentFund)}</td>
    <td>-</td>
  </tr>
</table>


               
<p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <hr />
                    <p style={{ textAlign: "center" }}>
                      4th Floor, B-Wing , Purva Summit, White field Road, Hitec
                      city , Kondapur,
                      <br /> Telangana- 500081
                    </p>

             
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </>
  );
});

export default OfferLetterTemplate;
