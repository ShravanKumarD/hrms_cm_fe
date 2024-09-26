import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../../env";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [totalApplications, setTotalApplications] = useState(0);

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
          appliedOn: moment(app.appliedOn).format("YYYY-MM-DD") || "NA",
        }));
        console.log(formattedData,'formms')
        setApplications(formattedData.reverse());
        setTotalApplications(
          formattedData.filter(app => app.status === "Approved").length
        );
        
      })
      .catch((err) => {
        setHasError(true);
        setErrorMsg(err.message || "An error occurred while fetching data.");
      });
  }, []);

  if (totalApplications === 0 && !hasError) {
    return (
      <div className="text-center">
        Loading applications...
        <br />
        It seems you haven't applied for any leaves so far.
      </div>
    );
  }
  

  if (hasError) {
    return (
      <Alert variant="danger" className="m-3">
        {errorMsg}
      </Alert>
    );
  }

  return (
    <div className="p-3">
      <h3>Applications (Total: {totalApplications})</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>APP ID</th>
            <th>Full Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Leave Type</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Applied On</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.user.fullName}</td>
              <td>{app.startDate}</td>
              <td>{app.endDate}</td>
              <td>{app.type}</td>
              <td>{app.reason}</td>
              <td>
              <button
  className={`btn btn-sm ${
    app.status === "Approved"
      ? "btn-light btn-sm"
      : app.status === "Pending"
      ? "btn-info btn-sm"
      : "btn-warning btn-sm"
  }`}
>
  {app.status}
</button>

              </td>
              <td>{app.appliedOn}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApplicationList;
