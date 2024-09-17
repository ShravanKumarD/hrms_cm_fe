import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import EditDepartmentModal from "./EditDepartmentModal";
import AlertModal from "./AlertModal";
import AddDepartment from "./DepartmentAdd";
import API_BASE_URL from "../env";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showAlertModel, setShowAlertModel] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log(res,"dept data")
        setDepartments(res.data);
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "Error fetching departments");
      });
  }, []);

  const onEdit = (department) => (event) => {
    event.preventDefault();
    setSelectedDepartment(department);
    setShowEditModel(true);
  };

  const onDelete = (department) => (event) => {
    event.preventDefault();
    if (department.users.length > 0) {
      setShowAlertModel(true);
    } else {
      axios.defaults.baseURL = API_BASE_URL;
      axios
        .delete(`/api/departments/${department.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          setCompleted(true);
          setDepartments((prevDepartments) =>
            prevDepartments.filter((d) => d.id !== department.id)
          );
        })
        .catch((err) => {
          setHasError(true);
          setErrorMsg(err.response?.data?.message || "Error deleting department");
        });
    }
  };

  const closeEditModel = () => setShowEditModel(false);
  const closeAlertModel = () => setShowAlertModel(false);

  return (
    <div className="container">
   
      <div className="mt-4">
      <AddDepartment/>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Department List</h2>
            {/* <NavLink to="/AddDepartment" className="btn btn-primary">
              Add Department
            </NavLink> */}
          </div>
        </Card.Header>

        <Card.Body>
          {hasError && <Alert variant="danger">{errorMsg}</Alert>}

          <div className="table-responsive">
            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Employees'</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>
                      <td>{department.departmentName}</td>
                      <td>
                        <NavLink
                          to={{
                            pathname: "/job-list",
                            state: { selectedDepartment: department.id },
                          }}
                        >
                          <i className="fas fa-eye"></i> {department.users.length}
                        </NavLink>
                        <p></p>
                               
                       
                      </td>
                      <td>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={onEdit(department)}
                          className="mr-2"
                        >
                                <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={onDelete(department)}
                        >
                      <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </div>

      {showEditModel && (
       <EditDepartmentModal
       show={true}
       onHide={closeEditModel}
       data={selectedDepartment}
     />
      )}

      {showAlertModel && (
        <AlertModal
          show={showAlertModel}
          onHide={closeAlertModel}
          message="Cannot delete department with active users."
        />
      )}
    </div>
  );
};

export default DepartmentList;
