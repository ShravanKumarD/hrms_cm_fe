import React from "react";
import { Modal, Button } from "react-bootstrap";
import HikeLetterTemplate from "./HikeLetterTemplate";

const HikeLetterPreviewModal = ({ show, onHide, data }) => {
  console.log(data);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Hike Letter Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <HikeLetterTemplate
          userId={data.userId}
          name={data.name}
          place={data.place}
          effective_date={data.effective_date}
          new_salary={data.new_salary}
          previous_salary={data.previous_salary}
          hr_name={data.hr_name}
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

export default HikeLetterPreviewModal;
