import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";

const OfferLetterDeleteModal = ({ offerLetterId, onHide, onDeleteSuccess }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/offerLetters/${offerLetterId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("Offer letter deleted successfully.");
      setError(null); // Clear any previous errors

      setTimeout(() => {
        onDeleteSuccess(); // Refresh the data in the parent component
        onHide(); // Close the modal
      }, 1000); // Optional: Delay to show success message
    } catch (err) {
      setError("An error occurred while deleting the offer letter.");
      setSuccess(null); // Clear the success message if there's an error
    }
  };

  return (
    <Modal
      show={true}
      onHide={onHide}
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
            Deleting this Offer Letter is irreversible. Are you sure you want to
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
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </>
        )}
        {success && (
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default OfferLetterDeleteModal;
