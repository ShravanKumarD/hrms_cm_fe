import React from "react";
import { Modal, Button } from "react-bootstrap";
import RelievingLetterTemplate from "./RelievingLetterTemplate";

const RelievingLetterPreviewModal = ({ show, onHide, data }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Relieving Letter Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RelievingLetterTemplate
          employeeName={data.employee_name}
          employeeAddress={data.employee_address}
          employeeID={data.employee_id}
          position={data.position}
          department={data.department}
          dateOfJoining={data.date_of_joining}
          dateOfRelieving={data.date_of_relieving}
          hrName={data.hr_name}
          companyName={data.company_name}
          letterDate={data.date}
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

export default RelievingLetterPreviewModal;
