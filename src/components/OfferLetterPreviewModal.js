import React from "react";
import { Modal, Button } from "react-bootstrap";
import OfferLetterTemplate from "./OfferLetterTemplate";
import moment from "moment";

const OfferLetterPreviewModal = ({ show, onHide, data }) => {
  console.log(data, "data");
  const formatDate = (date) => {
    const day = moment(date).date();
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return moment(date).format(`D[${suffix(day)}] MMM YYYY`);
  };

  const formattedDate = formatDate(Date.now());
  const formattedStartDate = formatDate(data.start_date);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Offer Letter Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OfferLetterTemplate
          userId={data.userId}
          place={data.recipient_place}
          todaysDate={formattedDate}
          position={data.role}
          department={data.department}
          stipend={data.salary}
          startDate={formattedStartDate}
          hrName={data.sender_name}
          sender_title={data.sender_title}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfferLetterPreviewModal;

// {
//     "company_name": "CreditMitra",
//     "department": "Quos odit omnis aliquam exercitationem quod.",✅
//     "end_date": "2024-08-21",
//     "full_name": "Una Nolan",
//     "id": 13,
//     "location": "Hyderabad",
//     "recipient_place": "2237 Susanna Parkway",
//     "role": "Rem ratione voluptas odio vitae maiores ex ducimus quam porro.",
//     "salary": 1232,
//     "sender_name": "Murthy Balaji",✅
//     "sender_title": "Co Founder",
//     "start_date": "2024-08-23",✅
//     "tableData": {
//       "id": 0
//     },
//     "userId": 4,
//     "work_schedule": "9:30 am to 6:30 pm, Monday to Friday"
//   }
