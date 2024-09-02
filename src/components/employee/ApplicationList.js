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
        main: "#2E8B57", // Dark leaf green
      },
      secondary: {
        main: "#98FB98", // Light leaf green
      },
      background: {
        default: "#e0ffe0", // Light green background
      },
      text: {
        primary: "#FFF", // Ensure text is white
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          color: "#FFF", // White text
          padding: "10px", // Consistent padding for table cells
        },
      },
      MuiButton: {
        root: {
          color: "#FFF",
          backgroundColor: "#2E8B57",
          "&:hover": {
            backgroundColor: "#006400", // Darker green on hover
          },
          borderRadius: "12px", // More rounded buttons
        },
      },
      MuiToolbar: {
        root: {
          backgroundColor: "#2E8B57", // Dark leaf green
          color: "#FFF", // White text color
          borderRadius: "8px 8px 0 0", // Rounded corners for the toolbar
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
          border: "2px solid #2E8B57", // Dark leaf green border
          backgroundColor: "#2E8B57", // Dark leaf green background
          color: "#FFF", // White text inside the table
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
          backgroundColor: "#2E8B57", // Dark leaf green background for rows
        },
      },
      MuiTableHead: {
        root: {
          backgroundColor: "#2E8B57", // Dark leaf green background for header
        },
      },
      MuiTableBody: {
        root: {
          backgroundColor: "#e0ffe0", // Light green background for body rows
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
        <MaterialTable
          columns={[
            { title: "APP ID", field: "id", cellStyle: { color: "#FFF" } },
            {
              title: "Full Name",
              field: "user.fullName",
              cellStyle: { color: "#FFF" },
            },
            {
              title: "Start Date",
              field: "startDate",
              cellStyle: { color: "#FFF" },
            },
            {
              title: "End Date",
              field: "endDate",
              cellStyle: { color: "#FFF" },
            },
            {
              title: "Leave Type",
              field: "type",
              cellStyle: { color: "#FFF" },
            },
            {
              title: "Comments",
              field: "reason",
              cellStyle: { color: "#FFF" },
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
                        ? "#2E8B57"
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
              backgroundColor: "#2E8B57", // Dark leaf green
              color: "#FFF", // White text color
            },
            headerStyle: {
              backgroundColor: "#2E8B57", // Dark leaf green
              color: "#FFF", // White text color
            },
            rowStyle: {
              backgroundColor: "#2E8B57", // Dark leaf green background color for rows
              color: "#FFF", // Ensure text is white
            },
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50, 75, 100],
            emptyRowsWhenPaging: false,
            showEmptyDataSourceMessage: true,
          }}
          title="Applications"
        />
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
