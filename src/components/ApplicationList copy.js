import React, { useState, useEffect, useCallback } from "react";
import { Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import API_BASE_URL from "../env";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]).format("Do MMM YYYY"),
          endDate: moment(app.endDate, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]).format("Do MMM YYYY"),
        }));
        console.log(formattedApplications,"formattedApplications")
        setApplications(formattedApplications.reverse());
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, []);

  const handleStatusChange = useCallback((app, status) => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .put(`/api/applications/${app.id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setCompleted(true);
        history.push("/application-list");
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, [history]);

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
    <div>
      <ThemeProvider theme={theme}>
        <MaterialTable
          columns={[
            {title:"EMP ID",field:"user.username"},
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
            {
              title: "Action",
              render: (rowData) =>
                rowData.user.id !== JSON.parse(localStorage.getItem("user")).id ? (
                  rowData.status === "Pending" ? (
                    <>
                      <Button
                        onClick={() => handleStatusChange(rowData, "Approved")}
                        variant="success"
                        size="sm"
                        className="mr-2"
                      >
                        <i className="fas fa-edit"></i>Approve
                      </Button>
                      <p>&nbsp;</p>
                      <Button
                        onClick={() => handleStatusChange(rowData, "Rejected")}
                        variant="danger"
                        size="sm"
                        className="ml-2"
                      >
                        <i className="fas fa-trash"></i>Reject
                      </Button>
                    </>
                  ) : null
                ) : null,
            },
          ]}
          data={applications}
          options={{
            rowStyle: (rowData, index) => (index % 2 ? { backgroundColor: "#f2f2f2" } : {}),
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50, 75, 100],
          }}
          title="Applications"
        />
      </ThemeProvider>

      {hasError && (
        <Alert variant="danger" className="m-3" block>
          {errorMsg}
        </Alert>
      )}
    </div>
  );
};

export default ApplicationList;
