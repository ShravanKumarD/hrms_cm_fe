import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import { useHistory, Redirect } from "react-router-dom";
import "./EmployeeList.css"; // Import custom CSS for styling

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [empCount, setEmpCount] = useState(0);
  const [editRedirect, setEditRedirect] = useState(false);
  const history = useHistory();

  const fetchUsers = useCallback(async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmpCount(res.data.length);
      res.data.shift(1);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleView = (user) => {
    history.push({
      pathname: `/employee-view`,
      state: { selectedUser: user },
    });
  };
  const handleEdit = (user) => {
    history.push({
      pathname: "/employee-edit",
      state: { selectedUser: user },
    });
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
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setEmpCount(empCount - 1);
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  };
  console.log(users ? users : "na", "users");
  return (
    <div className="container mt-4">
      <div>
        <div>
          <h3>Employee List</h3>
          <Badge bg="secondary">
           <h4><strong>Total Employees: {empCount} members</strong></h4> 
          </Badge>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                {/* <th>Address</th>
                <th>Marital Status</th>
                <th>Date of Birth</th> */}
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
                  <td>{user.user_personal_info?.emailAddress}</td>
                  {/* <td>{user.user_personal_info?.address}</td>
                  <td>{user.user_personal_info?.maritalStatus}</td>
                  <td>{user.user_personal_info?.dateOfBirth.split(' ')[0]}</td> */}
                  <td>{user.department?.departmentName || "N/A"}</td>
                  <td>{user.jobs[0]?.jobTitle || "N/A"}</td>
                  <td>{user.user_personal_info?.mobile || "N/A"}</td>
                  <td>
  <span
    className={`badge ${
      user.active ? "bg-success" : "bg-danger"
    }`}
  >
    {user.active ? "Active" : "Inactive"}
  </span>
</td>


                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="action-btn"
                      onClick={() => handleView(user)}
                    >
                      <i className="far fa-eye"></i> View
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      className="action-btn"
                      onClick={() => handleEdit(user)}
                    >
                      <i className="far fa-edit"></i> Edit
                    </Button>
                    {/* {user.id !==
                      JSON.parse(localStorage.getItem("user")).id && (
                      <Button
                        size="sm"
                        variant="danger"
                        className="action-btn"
                        onClick={() => handleDelete(user)}
                      >
                        <i className="far fa-trash-alt"></i> Delete
                      </Button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

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
          <Button variant="danger" onClick={deleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
