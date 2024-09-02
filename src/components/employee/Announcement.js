import React, { useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import API_BASE_URL from "../../env";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const deptId = JSON.parse(localStorage.getItem("user")).departmentId;
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get(`/api/departmentAnnouncements/department/${deptId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setAnnouncements(res.data);
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.message || "Failed to fetch announcements");
      });
  }, []);

  const theme = createTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px",
        },
      },
    },
  });

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <Card className="main-card">
            <Card.Header>
              <strong>Announcement List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "ID", field: "id" },
                    { title: "Title", field: "announcementTitle" },
                    {
                      title: "Description",
                      field: "announcementDescription",
                    },
                    { title: "Created By", field: "user.fullName" },
                    {
                      title: "Department",
                      field: "department.departmentName",
                    },
                  ]}
                  data={announcements}
                  options={{
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: "#f2f2f2" };
                      }
                    },
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  }}
                  title="Announcements"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
      {hasError && (
        <Alert variant="danger" className="m-3">
          {errorMsg}
        </Alert>
      )}
    </div>
  );
};

export default Announcement;
