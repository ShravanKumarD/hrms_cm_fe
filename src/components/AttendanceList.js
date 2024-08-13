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
      console.log("Records:" + response);

      const formattedAttendances = response.data.map((attendance) => {
        console.log("Attendance:" + attendance.date);
        console.log("Clock IN:" + attendance.clockinTime);
        console.log("Clock OUT:" + attendance.clockoutTime);
        // Formatting date to '10th Aug 2024'
        const date = moment(attendance.date).format("Do MMM YYYY");

        const clockinTime = attendance.clockinTime
          ? moment(attendance.clockinTime).format("hh:mm A")
          : "";
        const clockoutTime = attendance.clockoutTime
          ? moment(attendance.clockoutTime).format("hh:mm A")
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
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px",
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
    <Button size="sm" variant={variant} onClick={onClick} className="mx-1 mb-1">
      <i className={`fas fa-${icon}`}></i> {label}
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
              ],
              ...attendances.map((att) => [
                att.id,
                att.userId,
                att.user.fullName,
                att.date,
                att.status,
                att.clockinTime,
                att.clockoutTime,
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

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            <Button
              variant="link"
              onClick={() => handleModalShow("add")}
              className="p-0"
              style={{ color: "blue", cursor: "pointer" }}
            >
              <i className="fa fa-plus" /> Add Attendance Record
            </Button>
          </h4>
          <Card className="main-card">
            <Card.Header>
              <strong>Attendance List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    // { title: "ID", field: "id" },
                    // { title: "User ID", field: "userId" },
                    { title: "Name", field: "user.fullName" },
                    { title: "Date", field: "date" },

                    { title: "Clock In Time", field: "clockinTime" },
                    // { title: "Clock In Latitude", field: "latitudeClockin" },
                    // { title: "Clock In Longitude", field: "longitudeClockin" },
                    { title: "Clock Out Time", field: "clockoutTime" },
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
                  data={attendances}
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
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
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
