import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import { useHistory } from "react-router-dom";

const SalarySlipDeleteModal = ({ salarySlipId, onHide, onDeleteSuccess }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const history = useHistory(); // Initialize the history object

  const handleDelete = async () => {
    try {
      console.log("Deleting salary slip with id", salarySlipId);
      console.log(
        "API URL:",
        `${API_BASE_URL}/api/salary-slip/${salarySlipId}`
      );
      console.log("Authorization Token:", localStorage.getItem("token"));

      await axios.delete(`${API_BASE_URL}/api/salary-slip/${salarySlipId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Salary Slip deleted successfully");
      setSuccess("Salary Slip deleted successfully.");
      setError(null); // Clear any previous errors
      onDeleteSuccess(); // Refetch the data
      setTimeout(() => {
        history.push("/salary-slip-list"); // Redirect to the main list
      }, 1000); // Add a delay to allow the success message to be displayed
    } catch (err) {
      console.error("Error occurred while deleting the salary slip:", err);
      setError("An error occurred while deleting the salary slip.");
      setSuccess(null); // Clear the success message if there's an error
    }
  };

  const handleClose = () => {
    history.push("/salary-slip-list"); // Redirect to the main list
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!success && !error && (
          <p>
            Deleting this Salary Slip is irreversible. Are you sure you want to
            proceed?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!success && (
          <>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </>
        )}
        {success && (
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SalarySlipDeleteModal;
