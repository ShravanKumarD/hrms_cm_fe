import React, { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import jsPDF from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import API_BASE_URL from "../env";
import AttendanceEditModal from "./AttendanceEditModal";
import AttendancePreviewModal from "./AttendancePreviewModal";
import AttendanceDeleteModal from "./AttendanceDeleteModal";
import AttendanceAddModal from "./AttendanceAddModal";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showModal, setShowModal] = useState({
    edit: false,
    preview: false,
    delete: false,
    add: false, // New state for add modal
  });

  const fetchData = useCallback(async () => {
    try {
      console.log("Fetching attendance records...");
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Records:" + response.data);

      const formattedAttendances = response.data.map((attendance) => {
        console.log("Attendance:" + attendance.date);
        console.log("Clock IN:" + attendance.clockinTime);
        console.log("Clock OUT:" + attendance.clockoutTime);
        console.log("Hours:" + attendance.totalHours);
        // Formatting date to '10th Aug 2024'
        const date = moment(attendance.date).format("Do MMM YYYY");

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
        };
      });

      setAttendances(formattedAttendances);
      console.log("Attendance records fetched successfully");
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
    });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: "#f5f5f5",
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          padding: "12px",
        },
      },
      MuiButton: {
        root: {
          textTransform: "none",
        },
      },
    },
  });

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

  const ActionButton = ({ variant, icon, label, onClick }) => (
    <Button
      size="sm"
      variant={variant}
      onClick={onClick}
      className="mx-1 mb-1"
      style={{ minWidth: "80px" }}
    >
      <i className={`fas fa-${icon} mr-1`}></i> {label}
    </Button>
  );

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

  // Function to handle download of today's attendance
  const downloadTodaysAttendance = () => {
    const today = moment().startOf("day");

    // Filter today's attendance based on the date
    const todaysAttendance = attendances.filter((attendance) =>
      moment(attendance.date, "Do MMM YYYY").isSame(today, "day")
    );

    // If no attendance records for today, return early
    if (todaysAttendance.length === 0) {
      alert("No attendance records found for today.");
      return;
    }

    // Prepare CSV content with Name, Date, Clock In Time, Clock Out Time, and Status
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Hours Worked,Clock In Time,Clock Out Time,Status\n" + // CSV header
      todaysAttendance
        .map(
          (e) =>
            `${e.user.fullName},${e.date},${e.totalHours},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a download link and trigger it
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_${today.format("DD-MM-YYYY")}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  const downloadThisMonthsAttendance = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    // Filter attendance records for the current month
    const thisMonthsAttendance = attendances.filter((attendance) =>
      moment(attendance.date, "Do MMM YYYY").isBetween(
        startOfMonth,
        endOfMonth,
        null,
        "[]"
      )
    );

    // If no attendance records for the current month, return early
    if (thisMonthsAttendance.length === 0) {
      alert("No attendance records found for this month.");
      return;
    }

    // Prepare CSV content with Name, Date, Clock In Time, Clock Out Time, and Status
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Date,Clock In Time,Clock Out Time,Status\n" + // CSV header
      thisMonthsAttendance
        .map(
          (e) =>
            `${e.user.fullName},${e.date},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a download link and trigger it
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_${startOfMonth.format("YYYY-MM")}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  const downloadThisYearsAttendance = () => {
    const startOfYear = moment().startOf("year");
    const endOfYear = moment().endOf("year");

    // Filter and sort attendance records for the current year by date
    const thisYearsAttendance = attendances
      .filter((attendance) =>
        moment(attendance.date, "Do MMM YYYY").isBetween(
          startOfYear,
          endOfYear,
          null,
          "[]"
        )
      )
      .sort((a, b) =>
        moment(a.date, "Do MMM YYYY").diff(moment(b.date, "Do MMM YYYY"))
      );

    // If no attendance records for the current year, return early
    if (thisYearsAttendance.length === 0) {
      alert("No attendance records found for this year.");
      return;
    }

    // Prepare CSV content with Date as the first column
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Clock In Time,Clock Out Time,Status\n" + // CSV header with Date first
      thisYearsAttendance
        .map(
          (e) =>
            `${e.date},${e.user.fullName},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a download link and trigger it
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_${startOfYear.format("YYYY")}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            <Button
              variant="link"
              onClick={() => handleModalShow("add")}
              className="p-0"
              style={{ color: "blue", cursor: "pointer" ,color:"#040404"}}
            >
              <i className="fa fa-plus" /> Add Attendance Record
            </Button>
          </h4>

          <div>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  // { title: "ID", field: "id" },
                  // { title: "User ID", field: "userId" },
                  {title:"EMP ID",field:"user.username"},
                  { title: "Name", field: "user.fullName" },
                  { title: "Date", field: "date" },

                  { title: "Clock In Time", field: "clockinTime" },
                  // { title: "Clock In Latitude", field: "latitudeClockin" },
                  // { title: "Clock In Longitude", field: "longitudeClockin" },
                  { title: "Clock Out Time", field: "clockoutTime" },
                  { title: "Hours", field: "totalHours" },
                  // { title: "Clock Out Latitude", field: "latitudeClockout" },
                  // {
                  //   title: "Clock Out Longitude",
                  //   field: "longitudeClockout",
                  // },
                  {
                    title: "Status",
                    field: "status",
                    render: (rowData) => (
                      <span
                        style={{
                          color: getStatusColor(rowData.status),
                          fontWeight: "bold",
                        }}
                      >
                        {rowData.status}
                      </span>
                    ),
                  },
                  {
                    title: "Action",
                    render: (rowData) => (
                      <div className="text-center">
                        <ActionButton
                          variant="info"
                          icon="edit"
                          label="Edit"
                          onClick={() => handleModalShow("edit", rowData)}
                        />
                        <ActionButton
                          variant="primary"
                          icon="eye"
                          label="Preview"
                          onClick={() => handleModalShow("preview", rowData)}
                        />
                        <ActionButton
                          variant="danger"
                          icon="trash"
                          label="Delete"
                          onClick={() => handleModalShow("delete", rowData)}
                        />
                      </div>
                    ),
                  },
                ]}
                data={attendances.reverse()}
                options={{
                  rowStyle: (rowData, index) =>
                    index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  exportButton: true,
                  exportPdf: () => exportPDF(),
                  // filtering: true,
                  sorting: true,
                  columnsButton: true,
                }}
                title="Attendance Records"
                actions={[
                  {
                    icon: () => <i className="fas fa-calendar-day"></i>,
                    tooltip: "Download Today's Attendance",
                    isFreeAction: true,
                    onClick: () => downloadTodaysAttendance(),
                  },
                  {
                    icon: () => <i className="fas fa-calendar-week"></i>,
                    tooltip: "Download Month's Attendance",
                    isFreeAction: true,
                    onClick: () => downloadThisMonthsAttendance(),
                  },
                  {
                    icon: () => <i className="fas fa-calendar"></i>,
                    tooltip: "Download Year's Attendance",
                    isFreeAction: true,
                    onClick: () => downloadThisYearsAttendance(),
                  },
                ]}
              />
            </ThemeProvider>
          </div>

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
