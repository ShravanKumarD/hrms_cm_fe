import React, { useState } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import { useHistory } from "react-router-dom";

const RelievingLetterDeleteModal = ({
  relievingLetterId,
  onHide,
  onDeleteSuccess,
}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const history = useHistory();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(
        `${API_BASE_URL}/api/relievingLetters/${relievingLetterId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setIsDeleted(true);
      onDeleteSuccess();
      setTimeout(() => {
        history.push("/relieving-letter-list");
      }, 1500);
    } catch (err) {
      console.error("Error occurred while deleting the relieving letter:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while deleting the relieving letter."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDeleted) {
      history.push("/relieving-letter-list");
    } else {
      onHide();
    }
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title id="contained-modal-title-vcenter">
          {isDeleted ? "Success" : "Confirm Deletion"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {isDeleted ? (
          <Alert variant="success">
            Relieving letter deleted successfully.
          </Alert>
        ) : (
          <>
            <p>Are you sure you want to delete this Relieving Letter?</p>
            <p className="text-danger">
              <strong>Warning:</strong> This action is irreversible.
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isDeleted && (
          <>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Deleting..."}
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        )}
        {isDeleted && (
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RelievingLetterDeleteModal;
