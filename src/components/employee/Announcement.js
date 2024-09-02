import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
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
        main: "#E0FFE0", // Dark leaf green
      },
      secondary: {
        main: "#98FB98", // Light leaf green
      },
      background: {
        default: "#e0ffe0", // Light green background
      },
      text: {
        primary: "#000", // Ensure text is black
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          padding: "10px", // Consistent padding for table cells
        },
      },
      MuiButton: {
        root: {
          color: "#000",
          backgroundColor: "#E0FFE0",
          "&:hover": {
            backgroundColor: "#006400", // Darker green on hover
          },
          borderRadius: "12px", // More rounded buttons
        },
      },
      MuiToolbar: {
        root: {
          backgroundColor: "#4CAF4F", // Dark leaf green
          color: "#000", // White text color
          borderRadius: "8px 8px 8px 8px", // Rounded corners for the toolbar
          borderCollapse: "collapse",
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
      MuiPaper: {
        elevation2: {
          boxShadow: "none", // Remove default shadow
          borderRadius: "12px", // Rounded border for the table
          border: "2px solid #E0FFE0", // Dark leaf green border
          backgroundColor: "#E0FFE0", // Dark leaf green background
          color: "#000", // Black text inside the table
        },
      },
      MuiTable: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 8px", // Adds space between rows for a rounded effect
        },
      },
      MuiTableRow: {
        root: {
          backgroundColor: "#E0FFE0",
        },
      },
      MuiTableHead: {
        root: {
          backgroundColor: "#E0FFE0",
        },
      },
      MuiTableBody: {
        root: {
          backgroundColor: "#E0FFE0",
        },
      },
      MuiInputBase: {
        root: {
          color: "#FFF", // White text color in the search input
        },
      },
      MuiInputAdornment: {
        root: {
          color: "#FFF",
        },
      },
      MuiIconButton: {
        root: {
          color: "#000",
        },
      },
      MuiInput: {
        underline: {
          "&:before": {
            borderBottomColor: "#FFF", // White underline before focus
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor: "#FFF", // White underline on hover
          },
          "&:after": {
            borderBottomColor: "#FFF", // White underline after focus
          },
        },
      },
      MuiSelect: {
        icon: {
          color: "#FFF", // White dropdown icon
        },
      },
      MuiTablePagination: {
        toolbar: {
          color: "#FFF", // White color for pagination toolbar
        },
        selectIcon: {
          color: "#FFF", // White dropdown icon in pagination
        },
        caption: {
          color: "#FFF", // White text for "1-4 of 4"
        },
        actions: {
          color: "#FFF", // White color for pagination actions (icons)
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
                    { title: "ID", field: "id", cellStyle: { color: "#000" } },
                    {
                      title: "Title",
                      field: "announcementTitle",
                      cellStyle: { color: "#000" },
                    },
                    {
                      title: "Description",
                      field: "announcementDescription",
                      cellStyle: { color: "#000" },
                    },
                    {
                      title: "Created By",
                      field: "user.fullName",
                      cellStyle: { color: "#000" },
                    },
                    {
                      title: "Department",
                      field: "department.departmentName",
                      cellStyle: { color: "#000" },
                    },
                  ]}
                  data={announcements}
                  options={{
                    rowStyle: {
                      backgroundColor: "#E0FFE0", // Dark leaf green background color for rows
                      color: "#000", // Ensure text is black
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    headerStyle: {
                      backgroundColor: "#E0FFE0", // Dark leaf green for header
                      color: "#000", // Black text color for header
                    },
                    toolbar: true,
                    toolbarStyle: {
                      backgroundColor: "#E0FFE0", // Dark leaf green for toolbar
                      color: "#000", // Black text color for toolbar
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
