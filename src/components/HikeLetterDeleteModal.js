import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import { useHistory } from "react-router-dom";

const HikeLetterDeleteModal = ({ hikeLetterId, onHide, onDeleteSuccess }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const history = useHistory(); // Initialize the history object

  const handleDelete = async () => {
    try {
      console.log("Deleting hike letter with id", hikeLetterId);
      console.log(
        "API URL:",
        `${API_BASE_URL}/api/hikeLetters/${hikeLetterId}`
      );
      console.log("Authorization Token:", localStorage.getItem("token"));

      await axios.delete(`${API_BASE_URL}/api/hikeLetters/${hikeLetterId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Hike letter deleted successfully");
      setSuccess("Hike letter deleted successfully.");
      setError(null); // Clear any previous errors
      onDeleteSuccess(); // Refetch the data
      setTimeout(() => {
        history.push("/hike-letter-list"); // Redirect to the main list
      }, 1000); // Add a delay to allow the success message to be displayed
    } catch (err) {
      console.error("Error occurred while deleting the hike letter:", err);
      setError("An error occurred while deleting the hike letter.");
      setSuccess(null); // Clear the success message if there's an error
    }
  };

  const handleClose = () => {
    history.push("/hike-letter-list"); // Redirect to the main list
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
            Deleting this Hike Letter is irreversible. Are you sure you want to
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

export default HikeLetterDeleteModal;
