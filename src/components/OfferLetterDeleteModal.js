

// OfferLetterDeleteModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../env';

const OfferLetterDeleteModal = ({ show, onHide, offerLetter }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/offerLetters/${offerLetter.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onHide();
    } catch (error) {
      console.error('Error deleting offer letter:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Offer Letter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this offer letter for {offerLetter?.full_name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfferLetterDeleteModal;