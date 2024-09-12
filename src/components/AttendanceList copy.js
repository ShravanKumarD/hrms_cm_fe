import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Form, Modal, Dropdown } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import API_BASE_URL from "../env";
import AttendanceEditModal from "./AttendanceEditModal";
import AttendancePreviewModal from "./AttendancePreviewModal";
import AttendanceDeleteModal from "./AttendanceDeleteModal";
import AttendanceAddModal from "./AttendanceAddModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AttendanceList.css";
import TimePicker from 'react-time-picker';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [todaysCount, setTodaysCount] = useState(0);
  const [showModal, setShowModal] = useState({
    edit: false,
    preview: false,
    delete: false,
    add: false,
    selectEmployee: false,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "asc",
  });
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [clockinStart, setClockinStart] = useState(null);
  const [clockoutEnd, setClockoutEnd] = useState(null);
  const [minHours, setMinHours] = useState(null);
  const [maxHours, setMaxHours] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [exactHours, setExactHours] = useState(null);
  const [applications, setApplications] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const formattedAttendances = response.data.map((attendance) => {
        const date = moment(attendance.date).format("YYYY-MM-DD");
        const clockinTime = attendance.clockinTime
          ? moment(attendance.clockinTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]).format("hh:mm A")
          : "";
        const clockoutTime = attendance.clockoutTime
          ? moment(attendance.clockoutTime, ["YYYY-MM-DD HH:mm:ss", "HH:mm:ss"]).format("hh:mm A")
          : "";

        return {
          ...attendance,
          date,
          clockinTime,
          clockoutTime,
          applicationType: applications.find(app => moment(attendance.date).isBetween(moment(app.startDate), moment(app.endDate), null, '[]'))?.type || "Not Applied",
        };
      });

      setAttendances(formattedAttendances.reverse());

      const today = moment().startOf("day");
      const todaysAttendance = formattedAttendances.filter((attendance) =>
        moment(attendance.date).isSame(today, "day")
      );
      setTodaysCount(todaysAttendance.length);

      const monthlyData = {};
      formattedAttendances.forEach((att) => {
        const monthYear = moment(att.date).format("YYYY-MM");
        const day = moment(att.date).format("DD");

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {};
        }

        if (!monthlyData[monthYear][day]) {
          monthlyData[monthYear][day] = 0;
        }

        monthlyData[monthYear][day]++;
      });

      const monthlyAttendance = Object.entries(monthlyData).map(
        ([monthYear, days]) => ({
          monthYear,
          days: Object.entries(days).map(([day, count]) => ({ day, count })),
        })
      );

      setMonthlyAttendance(monthlyAttendance);

      const employeeNames = [
        ...new Set(formattedAttendances.map((att) => att.user.fullName)),
      ];
      setEmployeeList(employeeNames);
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    }
  }, [applications]);

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("YYYY-MM-DD"),
          endDate: moment(app.endDate).format("YYYY-MM-DD"),
        }));
        setApplications(formattedApplications);
        fetchData(); // Fetch attendances after applications are loaded
      })
      .catch((err) => {
        console.log(err, "ERRR");
      });
  }, [fetchData]);

  const handleModalShow = (modalType, attendance = null) => {
    setSelectedAttendance(attendance);
    setShowModal((prevState) => ({
      ...prevState,
      [modalType]: true,
    }));
  };

  const closeModal = () => {
    setShowModal({
      edit: false,
      preview: false,
      delete: false,
      add: false,
      selectEmployee: false,
    });
  };

  const handleEmployeeSelect = (employeeName) => {
    setSelectedEmployee(employeeName);
    setShowModal((prev) => ({ ...prev, selectEmployee: false }));
    downloadByEmployeeName(employeeName);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "#4CAF50";
      case "absent":
        return "#F44336";
      default:
        return "#FFC107";
    }
  };

  const exportPDF = () => {
    const docDefinition = {
      content: [
        { text: "Attendance Records", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                "ID",
                "User ID",
                "Name",
                "Date",
                "Status",
                "Clock In",
                "Clock Out",
                "Hours",
                "Application Type",
              ],
              ...attendances.map((att) => [
                att.id,
                att.userId,
                att.user.fullName,
                att.date,
                att.status,
                att.clockinTime,
                att.clockoutTime,
                att.totalHours,
                att.applicationType,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };
    pdfMake.createPdf(docDefinition).download("attendance_records.pdf");
  };

  const handleSort = (key) => {
    setSortConfig((prevState) => {
      const direction =
        prevState.key === key && prevState.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  const downloadCSV = (data, filename) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Hours Worked,Clock In Time,Clock Out Time,Status,Application Type\n" +
      data
        .map(
          (e) =>
            `${e.date},${e.user.fullName},${e.totalHours || ""},${
              e.clockinTime || ""
            },${e.clockoutTime || ""},${e.status},${e.applicationType}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  const downloadTodaysAttendance = () => {
    const today = moment().startOf("day");
    const todaysAttendance = attendances.filter((att) =>
      moment(att.date).isSame(today, "day")
    );

    if (todaysAttendance.length === 0) {
      alert("No attendance records found for today.");
      return;
    }

    downloadCSV(
      todaysAttendance,
      `attendance_${today.format("DD-MM-YYYY")}.csv`
    );
  };

  const downloadThisMonthsAttendance = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const thisMonthsAttendance = attendances.filter((att) =>
      moment(att.date).isBetween(startOfMonth, endOfMonth, null, "[]")
    );

    if (thisMonthsAttendance.length === 0) {
      alert("No attendance records found for this month.");
      return;
    }

    downloadCSV(
      thisMonthsAttendance,
      `attendance_${moment().format("MM-YYYY")}.csv`
    );
  };

  const downloadByEmployeeName = (employeeName) => {
    const employeeAttendance = attendances.filter(
      (att) => att.user.fullName === employeeName
    );

    if (employeeAttendance.length === 0) {
      alert(`No attendance records found for ${employeeName}.`);
      return;
    }

    downloadCSV(
      employeeAttendance,
      `attendance_${employeeName.replace(/\s+/g, "_")}.csv`
    );
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleDateChange = (date, setter) => {
    setter(date);
  };

  const handleClockinStartChange = (time) => {
    setClockinStart(time);
  };

  const handleClockoutEndChange = (time) => {
    setClockoutEnd(time);
  };

  const handleExactHoursChange = (e) => {
    setExactHours(e.target.value);
  };

  const handleFilterSubmit = () => {
    fetchData(); // Apply the filter
  };

  const sortedAttendances = [...attendances].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredAttendances = sortedAttendances.filter((attendance) => {
    const statusMatch = statusFilter ? attendance.status === statusFilter : true;
    const nameMatch = filterText ? attendance.user.fullName.toLowerCase().includes(filterText.toLowerCase()) : true;
    const dateMatch = startDate && endDate ? moment(attendance.date).isBetween(startDate, endDate, null, "[]") : true;
    const clockinMatch = clockinStart ? moment(attendance.clockinTime, "hh:mm A").isSameOrAfter(moment(clockinStart, "HH:mm:ss")) : true;
    const clockoutMatch = clockoutEnd ? moment(attendance.clockoutTime, "hh:mm A").isSameOrBefore(moment(clockoutEnd, "HH:mm:ss")) : true;
    const hoursMatch = exactHours ? attendance.totalHours === exactHours : true;
    const minHoursMatch = minHours ? attendance.totalHours >= minHours : true;
    const maxHoursMatch = maxHours ? attendance.totalHours <= maxHours : true;

    return statusMatch && nameMatch && dateMatch && clockinMatch && clockoutMatch && hoursMatch && minHoursMatch && maxHoursMatch;
  });

  return (
    <div className="attendance-list">
      <div className="filters">
        <Form.Group>
          <Form.Label>Filter by Name:</Form.Label>
          <Form.Control type="text" value={filterText} onChange={handleFilterChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Date Range:</Form.Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, setStartDate)}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(date, setEndDate)}
            placeholderText="End Date"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Status:</Form.Label>
          <Form.Control as="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Clock In Time:</Form.Label>
          <TimePicker onChange={handleClockinStartChange} value={clockinStart} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Clock Out Time:</Form.Label>
          <TimePicker onChange={handleClockoutEndChange} value={clockoutEnd} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Exact Hours:</Form.Label>
          <Form.Control type="number" value={exactHours} onChange={handleExactHoursChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Min Hours:</Form.Label>
          <Form.Control type="number" value={minHours} onChange={(e) => setMinHours(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by Max Hours:</Form.Label>
          <Form.Control type="number" value={maxHours} onChange={(e) => setMaxHours(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleFilterSubmit}>Apply Filters</Button>
      </div>
      <div className="actions">
        <Button variant="success" onClick={() => handleModalShow("add")}>Add Attendance</Button>
        <Button variant="info" onClick={downloadTodaysAttendance}>Download Today's Attendance</Button>
        <Button variant="info" onClick={downloadThisMonthsAttendance}>Download This Month's Attendance</Button>
        <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            Download by Employee
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {employeeList.map((employeeName) => (
              <Dropdown.Item key={employeeName} onClick={() => handleEmployeeSelect(employeeName)}>
                {employeeName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="warning" onClick={exportPDF}>Export as PDF</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>Date</th>
            <th onClick={() => handleSort("user.fullName")}>Name</th>
            <th onClick={() => handleSort("totalHours")}>Hours Worked</th>
            <th onClick={() => handleSort("clockinTime")}>Clock In Time</th>
            <th onClick={() => handleSort("clockoutTime")}>Clock Out Time</th>
            <th onClick={() => handleSort("status")}>Status</th>
            <th onClick={() => handleSort("applicationType")}>Application Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.map((attendance) => (
            <tr key={attendance.id}>
              <td>{attendance.date}</td>
              <td>{attendance.user.fullName}</td>
              <td>{attendance.totalHours || ""}</td>
              <td>{attendance.clockinTime || ""}</td>
              <td>{attendance.clockoutTime || ""}</td>
              <td style={{ color: getStatusColor(attendance.status) }}>{attendance.status}</td>
              <td>{attendance.applicationType}</td>
              <td>
                <Button variant="warning" onClick={() => handleModalShow("preview", attendance)}>Preview</Button>
                <Button variant="primary" onClick={() => handleModalShow("edit", attendance)}>Edit</Button>
                <Button variant="danger" onClick={() => handleModalShow("delete", attendance)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AttendanceEditModal
        show={showModal.edit}
        onHide={closeModal}
        attendance={selectedAttendance}
        fetchData={fetchData}
      />
      <AttendancePreviewModal
        show={showModal.preview}
        onHide={closeModal}
        attendance={selectedAttendance}
      />
      <AttendanceDeleteModal
        show={showModal.delete}
        onHide={closeModal}
        attendance={selectedAttendance}
        fetchData={fetchData}
      />
      <AttendanceAddModal
        show={showModal.add}
        onHide={closeModal}
        fetchData={fetchData}
      />
    </div>
  );
};

export default AttendanceList;
