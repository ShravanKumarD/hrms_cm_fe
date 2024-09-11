import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import { useHistory } from "react-router-dom"; // For redirection

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [empCount, setEmpCount] = useState(0);
  const history = useHistory(); // For redirection

  const fetchUsers = useCallback(async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
      setEmpCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleView = (user) => {
    setSelectedUser(user);
    history.push(`/view/${user.id}`); // Redirect to the view page
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    history.push(`/edit/${user.id}`); // Redirect to the edit page
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => setDeleteModal(false);

  const deleteUser = async () => {
    try {
      await axios.delete(`/api/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Remove the deleted user from the list
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setEmpCount(empCount - 1);
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h3>Employee List</h3>
          <Badge bg="secondary">Total Employees: {empCount}</Badge>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Job Title</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.department?.departmentName || 'N/A'}</td>
                  <td>{user.jobs[0]?.jobTitle || 'N/A'}</td>
                  <td>{user.user_personal_info?.mobile || 'N/A'}</td>
                  <td>{user.active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="btn-sm"
                      onClick={() => handleView(user)}
                    >
                      <i className="far fa-eye"></i> View
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      className="btn-sm"
                      onClick={() => handleEdit(user)}
                    >
                      <i className="far fa-edit"></i> Edit
                    </Button>
                    {user.id !== JSON.parse(localStorage.getItem("user")).id && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user)}
                      >
                        <i className="far fa-trash-alt"></i> Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser?.fullName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteUser} // Perform the delete action
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
