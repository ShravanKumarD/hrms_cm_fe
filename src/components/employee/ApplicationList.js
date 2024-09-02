import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, makeStyles } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import API_BASE_URL from "../../env";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: `/api/applications/user/${userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const formattedData = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("YYYY-MM-DD"),
          endDate: moment(app.endDate).format("YYYY-MM-DD"),
        }));
        setApplications(formattedData);
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.message || "An error occurred while fetching data.");
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
        primary: "#000", // Ensure text is white
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          // color: "#000", // White text
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
          color: "#000", // White text inside the table
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

  if (completed) {
    history.push("/application-list");
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={{ paddingTop: "5px" }}>
          {" "}
          {/* Add padding above the table */}
          <MaterialTable
            columns={[
              { title: "APP ID", field: "id", cellStyle: { color: "#000" } },
              {
                title: "Full Name",
                field: "user.fullName",
                cellStyle: { color: "#000" },
              },
              {
                title: "Start Date",
                field: "startDate",
                cellStyle: { color: "#000" },
              },
              {
                title: "End Date",
                field: "endDate",
                cellStyle: { color: "#000" },
              },
              {
                title: "Leave Type",
                field: "type",
                cellStyle: { color: "#000" },
              },
              {
                title: "Comments",
                field: "reason",
                cellStyle: { color: "#000" },
              },
              {
                title: "Status",
                field: "status",
                render: (rowData) => (
                  <Button
                    size="sm"
                    variant={
                      rowData.status === "Approved"
                        ? "success"
                        : rowData.status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                    style={{
                      backgroundColor:
                        rowData.status === "Approved"
                          ? "#4CAF4F"
                          : rowData.status === "Pending"
                          ? "#FFD700"
                          : "#DC143C",
                      color: "#FFF",
                      borderRadius: "12px", // More rounded buttons
                      padding: "6px 12px", // Consistent padding for buttons
                    }}
                  >
                    {rowData.status}
                  </Button>
                ),
              },
            ]}
            data={applications}
            options={{
              toolbar: true,
              toolbarStyle: {
                backgroundColor: "#E0FFE0", // Dark leaf green
                color: "#000", // White text color
              },
              headerStyle: {
                backgroundColor: "#E0FFE0", // Dark leaf green
                color: "#000", // White text color
              },
              rowStyle: {
                backgroundColor: "#E0FFE0", // Dark leaf green background color for rows
                color: "#000", // Ensure text is black #000
              },
              pageSize: 10,
              pageSizeOptions: [10, 20, 30, 50, 75, 100],
              emptyRowsWhenPaging: false,
              showEmptyDataSourceMessage: true,
            }}
            title="Applications"
          />
        </div>
      </ThemeProvider>
      {hasError && (
        <Alert variant="danger" className="m-3" block="true">
          {errorMsg}
        </Alert>
      )}
    </>
  );
};

export default ApplicationList;
