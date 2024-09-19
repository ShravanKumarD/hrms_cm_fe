import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import JobAddModal from "./JobAddModal";
import JobEditModal from "./JobEditModal";
import JobDeleteModal from "./JobDeleteModal";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../env";

const JobList = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);

  const location = useLocation();

  // Fetch departments and jobs on component mount
  useEffect(() => {
    const selectedDepartment = location.state
      ? location.state.selectedDepartment
      : null;

    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setDepartments(res.data);
        setSelectedDepartment(selectedDepartment || "all");
        if (!selectedDepartment) {
          fetchDataAll();
        } else {
          fetchData(selectedDepartment);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location.state]);

  const fetchData = (departmentId) => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get(`/api/departments/${departmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const jobs = [];
        res.data.users.forEach((user) => {
          user.jobs.forEach((job) => {
            job.startDate = moment(job.startDate).format("YYYY-MM-DD");
            job.endDate = moment(job.endDate).format("YYYY-MM-DD");
            jobs.push(job);
          });
        });
        setJobs(jobs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchDataAll = () => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const jobs = [];
        res.data.forEach((dept) => {
          dept.users.forEach((user) => {
            user.jobs.forEach((job) => {
              job.startDate = moment(job.startDate).format("YYYY-MM-DD");
              job.endDate = moment(job.endDate).format("YYYY-MM-DD");
              jobs.push(job);
            });
          });
        });
        setJobs(jobs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDepartmentChange = (event) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);

    if (departmentId === "all") {
      fetchDataAll();
    } else {
      fetchData(departmentId);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowEditModel(true);
  };

  const handleDelete = (job) => {
    setSelectedJob(job);
    setShowDeleteModel(true);
  };

  const pushSelectItems = () => {
    return [
      <option key="all" value="all">
        All departments
      </option>,
      ...departments.map((dept, index) => (
        <option key={index} value={dept.id}>
          {dept.departmentName}
        </option>
      )),
    ];
  };

  const renderJobState = (job) => {
    const startDate = new Date(job.startDate).setHours(0);
    const endDate = new Date(job.endDate).setHours(24);
    const currentDate = new Date();
    if (startDate > currentDate) {
      return <Badge variant="warning">Future Job</Badge>;
    } else if (endDate >= currentDate) {
      return <Badge variant="success">Current Job</Badge>;
    } else {
      return <Badge variant="info">Old Job</Badge>;
    }
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <div>
          <h4>
            <button className="dashboard-icons">
            <a
              onClick={() => setShowAddModel(true)}
            >
              Add Job
            </a>
            </button>
          </h4>
            <>
              <div>
              <div className="required"><strong>Select Department</strong></div>
              <p></p>
                <select
                  className="select-custom"
                  value={selectedDepartment || ""}
                  onChange={handleDepartmentChange}
                >
                  <option value="">Choose one...</option>
                  {pushSelectItems()}
                </select>
              </div>
            </>
            <p></p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
       
          <div className="table-responsive">
          <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>Job Title</th>
                  <th>Employee</th>
                  <th>Start Date</th>
                  {/* <th>End Date</th> */}
                  {/* <th>State</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.id}</td>
                    <td>{job.jobTitle}</td>
                    <td>{job.user.fullName}</td>
                    <td>{job.startDate}</td>
                    {/* <td>{job.endDate}</td> */}
                    {/* <td>{renderJobState(job)}</td> */}
                    <td>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => handleEdit(job)}
                        // className="mr-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="light" 
                        onClick={() => handleDelete(job)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showEditModel && (
            <JobEditModal
              show={true}
              onHide={() => setShowEditModel(false)}
              data={selectedJob}
            />
          )}

          {showAddModel && (
            <JobAddModal show={true} onHide={() => setShowAddModel(false)} />
          )}

          {showDeleteModel && (
            <JobDeleteModal
              show={true}
              onHide={() => setShowDeleteModel(false)}
              data={selectedJob}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
