// OfferLetterEditModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../env';

const OfferLetterEditModal = ({ show, onHide, offerLetter }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    recipient_place: '',
    role: '',
    department: '',
    salary: '',
    start_date: '',
    end_date: '',
    location: '',
    work_schedule: '',
    company_name: '',
    sender_name: '',
    sender_title: '',
  });

  useEffect(() => {
    if (offerLetter) {
      setFormData(offerLetter);
    }
  }, [offerLetter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/offerLetters/${offerLetter.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onHide();
    } catch (error) {
      console.error('Error updating offer letter:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Offer Letter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {/* Add more form fields for other offer letter properties */}
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OfferLetterEditModal;
