import React from "react";
import { Modal, Button } from "react-bootstrap";
import SalarySlipTemplate from "./SalarySlipTemplate";

const SalarySlipPreviewModal = ({ show, onHide, data }) => {
  console.log(data, "SalarySlipPreviewModal data");

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Salary Slip Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Pass the entire data object directly to the SalarySlipTemplate */}
        <SalarySlipTemplate data={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalarySlipPreviewModal;

// {
//     id,
//     name,
//     userId,✅
//     address,✅
//     designation,
//     date_of_joining,
//     month,
//     basic_salary,
//     hra,
//     conveyance_allowance,
//     medical_allowance,
//     special_allowance,
//     employee_pf,
//     professional_tax,
//     other_deductions,
//     tds,
//     total_deductions,
//     total_earnings,
//     tableData
//   }
