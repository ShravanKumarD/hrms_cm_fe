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
import TimePicker from "react-time-picker";

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
          ? moment(attendance.clockinTime, [
              "YYYY-MM-DD HH:mm:ss",
              "HH:mm:ss",
            ]).format("hh:mm A")
          : "";
        const clockoutTime = attendance.clockoutTime
          ? moment(attendance.clockoutTime, [
              "YYYY-MM-DD HH:mm:ss",
              "HH:mm:ss",
            ]).format("hh:mm A")
          : "";

        return {
          ...attendance,
          date,
          clockinTime,
          clockoutTime,
          applicationType:
            applications.find((app) =>
              moment(attendance.date).isBetween(
                moment(app.startDate),
                moment(app.endDate),
                null,
                "[]"
              )
            )?.type || "Not Applied",
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
  }, []);

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    axios
      .get("/api/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("Do MMM YYYY"),
          endDate: moment(app.endDate).format("Do MMM YYYY"),
        }));
        console.log(formattedApplications, "fornm");
        setApplications(formattedApplications);
      })
      .catch((err) => {
        console.log(err, "ERRR");
      });

    fetchData();
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
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
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
      "Date,Name,Hours Worked,Clock In Time,Clock Out Time,Status\n" +
      data
        .map(
          (e) =>
            `${e.date},${e.user.fullName},${e.totalHours || ""},${
              e.clockinTime || ""
            },${e.clockoutTime || ""},${e.status}`
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
      `attendance_${startOfMonth.format("YYYY-MM")}.csv`
    );
  };

  const downloadThisYearsAttendance = () => {
    const startOfYear = moment().startOf("year");
    const endOfYear = moment().endOf("year");
    const thisYearsAttendance = attendances
      .filter((att) =>
        moment(att.date).isBetween(startOfYear, endOfYear, null, "[]")
      )
      .sort((a, b) => moment(a.date).diff(moment(b.date)));

    if (thisYearsAttendance.length === 0) {
      alert("No attendance records found for this year.");
      return;
    }

    downloadCSV(
      thisYearsAttendance,
      `attendance_${startOfYear.format("YYYY")}.csv`
    );
  };

  const downloadByEmployeeName = (employeeName) => {
    console.log(`Filtering for employee: ${employeeName}`);
    const employeeAttendance = attendances.filter(
      (att) =>
        att.user.fullName.trim().toLowerCase() ===
        employeeName.trim().toLowerCase()
    );
    console.log("Filtered Attendances:", employeeAttendance);

    if (employeeAttendance.length > 0) {
      downloadCSV(
        employeeAttendance,
        `attendance_${employeeName.replace(/\s+/g, "_")}.csv`
      );
    } else {
      alert("No attendance records found for the selected employee.");
    }
  };
  const downloadFilteredData = () => {
    if (filteredAttendances.length === 0) {
      alert("No attendance records found with the current filters.");
      return;
    }

    downloadCSV(
      filteredAttendances,
      `attendance_filtered_${moment().format("YYYY-MM-DD")}.csv`
    );
  };

  const exportReport = (reportType) => {
    switch (reportType) {
      case "daily":
        downloadTodaysAttendance();
        break;
      case "monthly":
        downloadThisMonthsAttendance();
        break;
      case "yearly":
        downloadThisYearsAttendance();
        break;
      case "employee":
        setShowModal((prev) => ({ ...prev, selectEmployee: true }));
        break;
      case "filtered":
        downloadFilteredData();
        break;
      default:
        alert("Invalid export option selected.");
    }
  };
  const sortedAttendances = [...attendances].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredAttendances = sortedAttendances.filter((att) => {
    const isNameMatch = att.user.fullName
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const date = moment(att.date, "YYYY-MM-DD");
    const isDateInRange =
      (!startDate || date.isSameOrAfter(startDate, "day")) &&
      (!endDate || date.isSameOrBefore(endDate, "day"));
    const isStatusMatch = statusFilter
      ? att.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    // Convert clockinTime and clockoutTime to moment objects for comparison
    const clockinTime = att.clockinTime?moment(att.clockinTime, "hh:mm A"):null;
    const clockoutTime =att.clockoutTime? moment(att.clockoutTime, "hh:mm A"):null;

    // Create moment objects for filter start and end times
    const clockinStartMoment = clockinStart
      ? moment(clockinStart, "hh:mm A")
      : null;
    const clockoutEndMoment = clockoutEnd
      ? moment(clockoutEnd, "hh:mm A")
      : null;

    const isClockinInRange =
      !clockinStartMoment || clockinTime.isSameOrAfter(clockinStartMoment);
    const isClockoutInRange =
      !clockoutEndMoment || clockoutTime.isSameOrBefore(clockoutEndMoment);

    const isHoursInRange =
      (!minHours || att.totalHours >= Number(minHours)) &&
      (!maxHours || att.totalHours <= Number(maxHours));
    const isExactHoursMatch =
      exactHours === null ||
      (att.totalHours >= exactHours && att.totalHours < exactHours + 1);

    return (
      isNameMatch &&
      isDateInRange &&
      isStatusMatch &&
      isClockinInRange &&
      isClockoutInRange &&
      isHoursInRange &&
      isExactHoursMatch
    );
  });

  const clearFilters = () => {
    setFilterText("");
    setStartDate(null);
    setEndDate(null);
    setStatusFilter("");
    setClockinStart(null);
    setClockoutEnd(null);
    setMinHours(null);
    setMaxHours(null);
    setExactHours(null);
  };
  

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-3">
          <div
            variant="link"
            onClick={() => handleModalShow("add")}
            className="text-primary"
          >
            <i className="fa fa-plus" /> Add Attendance Record
          </div>
        </h4>
        <div className="mb-3">
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="dashboard-icons btn-sm"
            >
              Export Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportReport("daily")}>
                Daily Report
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport("monthly")}>
                Monthly Report
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport("yearly")}>
                Yearly Report
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport("employee")}>
                By Employee Name
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport("filtered")}>
                Download Filtered Data
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center">
        <p>
          <strong>Apply Filters</strong>
        </p>
      </div>
      <div className="filters-container">
        <div className="d-flex flex-wrap align-items-center">
          <Form.Group className="mr-2 mb-2">
            <Form.Control
              type="text"
              placeholder="Search by name"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mr-2 mb-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mr-2 mb-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mr-2 mb-2">
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Form.Control>
          </Form.Group>
        </div>

        <div className="d-flex flex-wrap align-items-center mb-3">
          <Form.Group className="mr-2 mb-2">
            <Form.Control
              type="number"
              placeholder="Min Hours"
              value={minHours || ""}
              onChange={(e) => setMinHours(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mr-2 mb-2">
            <Form.Control
              type="number"
              placeholder="Max Hours"
              value={maxHours || ""}
              onChange={(e) => setMaxHours(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap align-items-center mb-3">
            Sort By Time:{" "}
          </div>
          <Form.Group className="mr-3 mb-3">
            {/* <Form.Label>Clock In Start (hh:mm AM/PM)</Form.Label> */}
            <TimePicker
              format="hh:mm a"
              value={clockinStart}
              onChange={setClockinStart}
              className="timePicker"
            />
          </Form.Group>

          <Form.Group className="mr-3 mb-3">
            {/* <Form.Label>Clock Out End (hh:mm AM/PM)</Form.Label> */}
            <TimePicker
              format="hh:mm a"
              value={clockoutEnd}
              onChange={setClockoutEnd}
              className="timePicker"
            />
          </Form.Group>
          <Form.Group className="mr-2 mb-2">
            <Form.Control
              type="number"
              placeholder="By Exact Hours"
              value={exactHours || ""}
              onChange={(e) => setExactHours(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>
      <br/>
      <button  className="dashboard-icons" onClick={clearFilters}>
    Clear Filters
  </button>
<p></p>
     

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Emp Id</th>
            <th onClick={() => handleSort("user.fullName")}>Name</th>
            <th onClick={() => handleSort("date")}>Date</th>
            <th onClick={() => handleSort("status")}>Status</th>
            <th onClick={() => handleSort("clockinTime")}>Clock In</th>
            <th onClick={() => handleSort("clockoutTime")}>Clock Out</th>
            <th onClick={() => handleSort("totalHours")}>Total Hours</th>
            {/* <th onClick={() => handleSort("applicationType")}>Application Type</th> */}
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.map((att) => (
            <tr key={att.id}>
              <td>{att.user.username}</td>
              <td>{att.user.fullName}</td>
              <td>{att.date}</td>
              <td style={{ color: getStatusColor(att.status) }}>
                {att.status === "Absent"
                  ? `${att.applicationType}`
                  : att.status}
              </td>

              <td>{att.clockinTime}</td>
              <td>{att.clockoutTime}</td>
              <td>{att.totalHours || "N/A"}</td>
              {/* <td>{}</td> */}
              <td className="text-center">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleModalShow("edit", att)}
                  className="mx-1"
                >
                  <i className="fa fa-edit"></i>
                </Button>

                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleModalShow("delete", att)}
                  className="mx-1"
                >
                  <i className="fa fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal.selectEmployee && (
        <Modal show={showModal.selectEmployee} onHide={closeModal}>
          <Modal.Header closeButton>
            <p>
              <strong>Please Select an Employee to proceed</strong>
            </p>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {employeeList.map((employeeName) => (
                <li
                  key={employeeName}
                  onClick={() => handleEmployeeSelect(employeeName)}
                >
                  <p>{employeeName}</p>
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
      )}

      {showModal.edit && (
        <AttendanceEditModal
          show={showModal.edit}
          onHide={closeModal}
          data={selectedAttendance}
          onUpdateSuccess={fetchData}
        />
      )}
      {showModal.preview && (
        <AttendancePreviewModal
          show={showModal.preview}
          onHide={closeModal}
          data={selectedAttendance}
        />
      )}
      {showModal.delete && (
        <AttendanceDeleteModal
          show={showModal.delete}
          onHide={closeModal}
          attendanceId={selectedAttendance.id}
          onDeleteSuccess={fetchData}
        />
      )}
      {showModal.add && (
        <AttendanceAddModal
          show={showModal.add}
          onHide={closeModal}
          onAddSuccess={fetchData}
        />
      )}
    </>
  );
};

export default AttendanceList;
