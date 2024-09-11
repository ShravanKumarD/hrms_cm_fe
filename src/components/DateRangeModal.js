import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeModal = ({ show, onHide, startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Date Range</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <DatePicker
              selected={startDate ? moment(startDate).toDate() : null}
              onChange={date => onStartDateChange(date ? moment(date).startOf('day').toDate() : null)}
              placeholderText="Select Start Date"
              className="form-control"
              dateFormat="yyyy/MM/dd"
            />
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <DatePicker
              selected={endDate ? moment(endDate).toDate() : null}
              onChange={date => onEndDateChange(date ? moment(date).endOf('day').toDate() : null)}
              placeholderText="Select End Date"
              className="form-control"
              dateFormat="yyyy/MM/dd"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DateRangeModal;
