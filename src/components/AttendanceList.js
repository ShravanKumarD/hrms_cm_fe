import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Form, Modal, Dropdown, ListGroup } from "react-bootstrap";
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
    key: 'status',
    direction: 'asc',
  });
  const [filterText, setFilterText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // New status filter state
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const formattedAttendances = response.data.map((attendance) => {
        const date = moment(attendance.date).format("YYYY-MM-DD"); // Use ISO format for better sorting
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
        };
      });

      setAttendances(formattedAttendances.reverse());

      // Calculate today's attendance count
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

      const monthlyAttendance = Object.entries(monthlyData).map(([monthYear, days]) => ({
        monthYear,
        days: Object.entries(days).map(([day, count]) => ({ day, count })),
      }));

      setMonthlyAttendance(monthlyAttendance);

      // Update employee list for selection
      const employeeNames = [...new Set(formattedAttendances.map(att => att.user.fullName))];
      setEmployeeList(employeeNames);

    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    }
  }, []);

  useEffect(() => {
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
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("Attendance_Records.pdf");
  };

  const downloadCSV = (data, filename) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Hours Worked,Clock In Time,Clock Out Time,Status\n" +
      data
        .map(
          (e) =>
            `${e.date},${e.user.fullName},${e.totalHours || ""},${e.clockinTime || ""},${e.clockoutTime || ""},${e.status}`
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
    const todaysAttendance = attendances.filter((attendance) =>
      moment(attendance.date).isSame(today, "day")
    );

    if (todaysAttendance.length === 0) {
      alert("No attendance records found for today.");
      return;
    }

    downloadCSV(todaysAttendance, `attendance_${today.format("DD-MM-YYYY")}.csv`);
  };

  const downloadThisMonthsAttendance = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const thisMonthsAttendance = attendances.filter((attendance) =>
      moment(attendance.date).isBetween(
        startOfMonth,
        endOfMonth,
        null,
        "[]"
      )
    );

    if (thisMonthsAttendance.length === 0) {
      alert("No attendance records found for this month.");
      return;
    }

    downloadCSV(thisMonthsAttendance, `attendance_${startOfMonth.format("YYYY-MM")}.csv`);
  };

  const downloadThisYearsAttendance = () => {
    const startOfYear = moment().startOf("year");
    const endOfYear = moment().endOf("year");
    const thisYearsAttendance = attendances
      .filter((attendance) =>
        moment(attendance.date).isBetween(
          startOfYear,
          endOfYear,
          null,
          "[]"
        )
      )
      .sort((a, b) =>
        moment(a.date).diff(moment(b.date))
      );

    if (thisYearsAttendance.length === 0) {
      alert("No attendance records found for this year.");
      return;
    }

    downloadCSV(thisYearsAttendance, `attendance_${startOfYear.format("YYYY")}.csv`);
  };

  const downloadByEmployeeName = (employeeName) => {
    const employeeAttendance = attendances.filter(att => att.user.fullName === employeeName);
    if (employeeAttendance.length > 0) {
      downloadCSV(employeeAttendance, `attendance_${employeeName.replace(/\s+/g, '_')}.csv`);
    }
  };

  const handleEmployeeSelect = (employeeName) => {
    setSelectedEmployee(employeeName);
    setShowModal(prev => ({ ...prev, selectEmployee: false }));
    downloadByEmployeeName(employeeName);
  };

  const exportReport = (reportType) => {
    switch (reportType) {
      case 'daily':
        downloadTodaysAttendance();
        break;
      case 'monthly':
        downloadThisMonthsAttendance();
        break;
      case 'yearly':
        downloadThisYearsAttendance();
        break;
      case 'employee':
        setShowModal(prev => ({ ...prev, selectEmployee: true }));
        break;
      default:
        alert('Invalid export option selected.');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedAttendances = [...attendances].sort((a, b) => {
      if (key === 'date') {
        const dateA = moment(a[key]);
        const dateB = moment(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setAttendances(sortedAttendances);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  const filteredAttendances = attendances.filter((att) => {
    const isNameMatch = att.user.fullName.toLowerCase().includes(filterText.toLowerCase());
    const date = moment(att.date);
    const isDateInRange = (!startDate || date.isSameOrAfter(moment(startDate).startOf('day'))) &&
                          (!endDate || date.isSameOrBefore(moment(endDate).endOf('day')));
    const isStatusMatch = statusFilter ? att.status.toLowerCase() === statusFilter.toLowerCase() : true;
    return isNameMatch && isDateInRange && isStatusMatch;
  });

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
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
            <Form.Label>Filter by Date</Form.Label>
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Select Start Date"
                  className="form-control"
                />
              </div>
              {/* <div className="mr-2">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Select End Date"
                  className="form-control"
                />
              </div> */}
              <div className="mr-2">
                <Form.Control
                  as="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  {/* Add more status options if needed */}
                </Form.Control>
              </div>
              <div className="flex-grow-1">
                <Form.Control
                  type="text"
                  placeholder="Filter by Employee Name"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <div style={{padding:"10px"}}></div>
              <div className="mb-3">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Export Options
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => exportReport('daily')}>Daily Report</Dropdown.Item>
                    <Dropdown.Item onClick={() => exportReport('monthly')}>Monthly Report</Dropdown.Item>
                    <Dropdown.Item onClick={() => exportReport('yearly')}>Yearly Report</Dropdown.Item>
                    <Dropdown.Item onClick={() => exportReport('employee')}>By Employee Name</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p>Today's Attendance Count: {todaysCount}</p>
          </div>

          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('user.username')}>Employee Id {getSortIcon('user.username')}</th>
                  <th onClick={() => handleSort('user.fullName')}>Name {getSortIcon('user.fullName')}</th>
                  <th onClick={() => handleSort('date')}>Date {getSortIcon('date')}</th>
                  <th onClick={() => handleSort('clockinTime')}>Clock In Time {getSortIcon('clockinTime')}</th>
                  <th onClick={() => handleSort('clockoutTime')}>Clock Out Time {getSortIcon('clockoutTime')}</th>
                  <th onClick={() => handleSort('totalHours')}>Hours {getSortIcon('totalHours')}</th>
                  <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendances.map((att, index) => (
                  <tr key={att.id} style={{ backgroundColor: index % 2 ? '#f9f9f9' : 'white' }}>
                    <td>{att.user.username}</td>
                    <td>{att.user.fullName}</td>
                    <td>{att.date}</td>
                    <td>{att.clockinTime}</td>
                    <td>{att.clockoutTime}</td>
                    <td>{att.totalHours}</td>
                    <td style={{ color: getStatusColor(att.status), fontWeight: 'bold' }}>
                      {att.status}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleModalShow("edit", att)}
                        className="mx-1"
                      >
                        <i className="fa fa-edit"></i> Edit
                      </Button>
                      <p></p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleModalShow("delete", att)}
                        className="mx-1"
                      >
                        <i className="fa fa-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Employee Selection Modal */}
          <Modal show={showModal.selectEmployee} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Select Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ListGroup>
                {employeeList.map((employee, index) => (
                  <ListGroup.Item key={index} action onClick={() => handleEmployeeSelect(employee)}>
                    {employee}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

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
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
