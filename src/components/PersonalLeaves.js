import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";
import API_BASE_URL from "../env";
import "./Holidays.css";

export default function PersonalLeaves() {
  const [applications, setApplications] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("nameAsc"); // Default sort option
  const [nameFilter, setNameFilter] = useState(""); // State for name filter
  const history = useHistory();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const response = await axios.get("/api/applications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const formattedApplications = response.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate, [
            "YYYY-MM-DD HH:mm:ss",
            "HH:mm:ss",
          ]).format("Do MMM YYYY"),
          endDate: moment(app.endDate, [
            "YYYY-MM-DD HH:mm:ss",
            "HH:mm:ss",
          ]).format("Do MMM YYYY"),
        }));

        setApplications(formattedApplications.reverse());

        // Fetch names for all users
        const userIds = [
          ...new Set(formattedApplications.map((app) => app.userId)),
        ];
        fetchUserNames(userIds);
      } catch (error) {
        setHasError(true);
        setErrorMsg(error.response?.data?.message || "An error occurred");
      }
    };

    const fetchUserNames = async (userIds) => {
      try {
        const userNameRequests = userIds.map((userId) =>
          axios.get(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );
        const responses = await Promise.all(userNameRequests);
        const nameMap = responses.reduce((acc, res) => {
          acc[res.data.id] = res.data.fullName;
          return acc;
        }, {});

        setUserNames(nameMap);
      } catch (error) {
        console.error("Error fetching user names:", error);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    // Filter and sort applications based on status, name filter, and sorting option
    let filtered =
      statusFilter === "All"
        ? applications
        : applications.filter((app) => app.status === statusFilter);

    if (nameFilter) {
      filtered = filtered.filter((app) => {
        const name = userNames[app.userId] || "";
        return name.toLowerCase().includes(nameFilter.toLowerCase());
      });
    }

    if (sortBy === "nameAsc") {
      filtered = filtered.sort((a, b) => {
        const nameA = userNames[a.userId] || "";
        const nameB = userNames[b.userId] || "";
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === "nameDesc") {
      filtered = filtered.sort((a, b) => {
        const nameA = userNames[a.userId] || "";
        const nameB = userNames[b.userId] || "";
        return nameB.localeCompare(nameA);
      });
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, sortBy, nameFilter, userNames]);

  const handleRowClick = (applicationId) => {
    history.push(`/applications/${applicationId}`);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  return (
    <div>
      <h3 className="title">Personal Leaves</h3>
      {hasError && <p className="error">{errorMsg}</p>}
      <div className="filter-section">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          className="filter-dropdown"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
     
      <div className="sort-section">
        <label htmlFor="sort-by">Sort by Name:</label>
        <select
          id="sort-by"
          className="filter-dropdown"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="nameAsc">A-Z</option>
          <option value="nameDesc">Z-A</option>
        </select>
      </div>
      <div className="name-filter-section">
        <label htmlFor="name-filter">Search by Name:</label>
        <input
          type="text"
          id="name-filter"
          className="name-filter-input"
          value={nameFilter}
          onChange={handleNameFilterChange}
        />
      </div>
      </div>
      {filteredApplications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} onClick={() => handleRowClick(app.id)}>
                <td>{userNames[app.userId] || "Loading..."}</td>
                <td>{app.startDate}</td>
                <td>{app.endDate}</td>
                <td>{app.status}</td>
                <td>{app.type}</td>
                <td>{app.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
