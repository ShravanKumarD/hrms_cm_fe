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
    palette: {
      primary: {
        main: "#2E8B57", // Dark leaf green
      },
      background: {
        default: "#e0ffe0", // Light green background
      },
      text: {
        primary: "#FFF", // White text
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          color: "#FFF", // White text
          padding: "10px", // Consistent padding for table cells
        },
      },
      MuiTableHead: {
        root: {
          backgroundColor: "#2E8B57", // Dark leaf green background for header
        },
      },
      MuiTableBody: {
        root: {
          backgroundColor: "#2E8B57", // Dark leaf green background for body rows
        },
      },
      MuiToolbar: {
        root: {
          backgroundColor: "#2E8B57", // Dark leaf green
          color: "#FFF", // White text color
          borderRadius: "8px 8px 0 0", // Rounded corners for the toolbar
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: "none", // Remove default shadow
          borderRadius: "12px", // Rounded border for the table
          border: "2px solid #2E8B57", // Dark leaf green border
          backgroundColor: "#2E8B57", // Dark leaf green background
          color: "#FFF", // White text inside the table
        },
      },
      MuiTypography: {
        h6: {
          color: "#FFF", // White color for the title
        },
        h5: {
          color: "#FFF", // White color for the subtitle
        },
        h4: {
          color: "#FFF", // White color for the subtitle
        },
      },
    },
  });

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <div className="main-card">
            <div>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "ID", field: "id", cellStyle: { color: "#FFF" } },
                    {
                      title: "Title",
                      field: "announcementTitle",
                      cellStyle: { color: "#FFF" },
                    },
                    {
                      title: "Description",
                      field: "announcementDescription",
                      cellStyle: { color: "#FFF" },
                    },
                    {
                      title: "Created By",
                      field: "user.fullName",
                      cellStyle: { color: "#FFF" },
                    },
                    {
                      title: "Department",
                      field: "department.departmentName",
                      cellStyle: { color: "#FFF" },
                    },
                  ]}
                  data={announcements}
                  options={{
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: "#98FB98" }; // Light leaf green for alternating rows
                      }
                      return { backgroundColor: "#2E8B57" }; // Dark leaf green for default rows
                    },
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                    headerStyle: {
                      backgroundColor: "#2E8B57", // Dark leaf green for header
                      color: "#FFF", // White text color for header
                    },
                    toolbar: true,
                    toolbarStyle: {
                      backgroundColor: "#2E8B57", // Dark leaf green for toolbar
                      color: "#FFF", // White text color for toolbar
                    },
                  }}
                  title="Announcements"
                />
              </ThemeProvider>
            </div>
          </div>
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
