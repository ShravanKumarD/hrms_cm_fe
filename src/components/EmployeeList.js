import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewRedirect, setViewRedirect] = useState(false);
  const [editRedirect, setEditRedirect] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      axios.defaults.baseURL = "http://localhost:80";
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleView = (user) => {
    setSelectedUser(user);
    setViewRedirect(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditRedirect(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => setDeleteModal(false);

  const theme = createTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px 6px 6px 6px",
        },
      },
    },
  });

  return (
    <div className="container-fluid pt-4">
      {viewRedirect && (
        <Redirect
          to={{
            pathname: "/employee-view",
            state: { selectedUser },
          }}
        />
      )}
      {editRedirect && (
        <Redirect
          to={{
            pathname: "/employee-edit",
            state: { selectedUser },
          }}
        />
      )}
      {deleteModal && (
        <DeleteModal
          show={true}
          onHide={closeDeleteModal}
          data={selectedUser}
        />
      )}
      <h4>
        <a className="fa fa-plus mb-2 ml-2" href="/employee-add">
          Add Employee
        </a>
      </h4>
      <div className="col-sm-12">
        <Card>
          <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
            <div className="panel-title">
              <strong>Employee List</strong>
            </div>
          </Card.Header>
          <Card.Body>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { title: "EMP ID", field: "id" },
                  { title: "Full Name", field: "fullName" },
                  { title: "Department", field: "department.departmentName" },
                  {
                    title: "Job Title",
                    field: "jobs",
                    render: (rowData) =>
                      rowData.jobs
                        .filter(
                          (job) =>
                            new Date(job.startDate).setHours(0) <= Date.now() &&
                            new Date(job.endDate).setHours(24) >= Date.now()
                        )
                        .map((job) => job.jobTitle)
                        .join(", "),
                  },
                  { title: "Mobile", field: "user_personal_info.mobile" },
                  {
                    title: "Status",
                    field: "active",
                    render: (rowData) =>
                      rowData.active ? (
                        <Badge pill variant="success">
                          Active
                        </Badge>
                      ) : (
                        <Badge pill variant="danger">
                          Inactive
                        </Badge>
                      ),
                  },
                  {
                    title: "View",
                    render: (rowData) => (
                      <Form>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleView(rowData)}
                        >
                          <i className="far fa-address-card"></i>
                        </Button>
                      </Form>
                    ),
                  },
                  {
                    title: "Action",
                    render: (rowData) => (
                      <>
                        <Button
                          size="sm"
                          variant="info"
                          className="mr-2"
                          onClick={() => handleEdit(rowData)}
                        >
                          <i className="far fa-edit"></i>Edit
                        </Button>
                        {rowData.id !==
                        JSON.parse(localStorage.getItem("user")).id ? (
                          <Button
                            size="sm"
                            variant="danger"
                            className="ml-1"
                            onClick={() => handleDelete(rowData)}
                          >
                            <i className="far fa-bin"></i>Delete
                          </Button>
                        ) : null}
                      </>
                    ),
                  },
                ]}
                data={users}
                options={{
                  rowStyle: (_, index) => ({
                    backgroundColor: index % 2 ? "#f2f2f2" : undefined,
                  }),
                  pageSize: 10,
                  pageSizeOptions: [10, 20, 30, 50, 75, 100],
                }}
                title="Employees"
              />
            </ThemeProvider>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeList;
