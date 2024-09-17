import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Button } from "react-bootstrap";


export default class AlertModal extends Component {

  render() {
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Warning
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This Department has Employees. Transfer Employees to a new Department first.
          <p>&nbsp;</p>
            <button className="dashboard-icons"> <a href="/employee-list">Go To Employee List</a></button>
           
        </Modal.Body>
        <Modal.Footer>
          <button className="dashboard-icons" onClick={this.props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    )
  }
}