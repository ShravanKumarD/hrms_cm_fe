import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
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
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px 6px 6px 6px",
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
            { title: "APP ID", field: "id" },
            { title: "Full Name", field: "user.fullName" },
            { title: "Start Date", field: "startDate" },
            { title: "End Date", field: "endDate" },
            { title: "Leave Type", field: "type" },
            { title: "Comments", field: "reason" },
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
                >
                  {rowData.status}
                </Button>
              ),
            },
          ]}
          data={applications}
          options={{
            rowStyle: (rowData, index) => {
              if (index % 2) {
                return { backgroundColor: "#f2f2f2" };
              }
            },
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50, 75, 100],
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
