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
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showModal, setShowModal] = useState({
    edit: false,
    preview: false,
    delete: false,
    add: false,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/attendance", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const formattedAttendances = response.data.map((attendance) => {
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

      // Aggregate monthly attendance data
      const monthlyData = {};
      formattedAttendances.forEach((att) => {
        const monthYear = moment(att.date, "Do MMM YYYY").format("YYYY-MM");
        const day = moment(att.date, "Do MMM YYYY").format("DD");

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

  const downloadTodaysAttendance = () => {
    const today = moment().startOf("day");
    const todaysAttendance = attendances.filter((attendance) =>
      moment(attendance.date, "Do MMM YYYY").isSame(today, "day")
    );

    if (todaysAttendance.length === 0) {
      alert("No attendance records found for today.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Hours Worked,Clock In Time,Clock Out Time,Status\n" +
      todaysAttendance
        .map(
          (e) =>
            `${e.user.fullName},${e.date},${e.totalHours},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
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
    const thisMonthsAttendance = attendances.filter((attendance) =>
      moment(attendance.date, "Do MMM YYYY").isBetween(
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

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Date,Clock In Time,Clock Out Time,Status\n" +
      thisMonthsAttendance
        .map(
          (e) =>
            `${e.user.fullName},${e.date},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
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

    if (thisYearsAttendance.length === 0) {
      alert("No attendance records found for this year.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Clock In Time,Clock Out Time,Status\n" +
      thisYearsAttendance
        .map(
          (e) =>
            `${e.date},${e.user.fullName},${e.clockinTime},${e.clockoutTime},${e.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
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
              style={{ color: "blue", cursor: "pointer", color: "#040404" }}
            >
              <i className="fa fa-plus" /> Add Attendance Record
            </Button>
          </h4>

          <div>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { title: "EMP ID", field: "user.username" },
                  { title: "Name", field: "user.fullName" },
                  { title: "Date", field: "date" },
                  { title: "Clock In Time", field: "clockinTime" },
                  { title: "Clock Out Time", field: "clockoutTime" },
                  { title: "Hours", field: "totalHours" },
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

          {/* Display Monthly Attendance Data */}
          <div className="mt-4">
            <h5>Monthly Attendance Overview</h5>
            <MaterialTable
              columns={[
                { title: "Month-Year", field: "monthYear" },
                { title: "Day", field: "day" },
                { title: "Total Records", field: "count" },
              ]}
              data={monthlyAttendance.flatMap(month => 
                month.days.map(day => ({
                  monthYear: month.monthYear,
                  day: day.day,
                  count: day.count,
                }))
              )}
              options={{
                rowStyle: (rowData, index) =>
                  index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                pageSize: 10,
                pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                sorting: true,
                columnsButton: true,
              }}
              title="Monthly Attendance Overview"
            />
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
