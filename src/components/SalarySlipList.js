import React, { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import SalarySlipAddModal from "./SalarySlipAddModal";
import SalarySlipEditModal from "./SalarySlipEditModal";
import SalarySlipDeleteModal from "./SalarySlipDeleteModal";
import SalarySlipPreviewModal from "./SalarySlipPreviewModal";
import API_BASE_URL from "../env";

const convertToCSV = (data) => {
  const headers = [
    "ID",
    "Name",
    "Month",
    "Basic Salary",
    "HRA",
    "Conveyance Allowance",
    "Special Allowance",
    "Medical Allowance",
    "Total Earnings",
    "TDS",
    "Professional Tax",
    "Employee PF",
    "Other Deductions",
    "Total Deductions",
  ];

  const csvRows = [];
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((header) => {
      const key = header.toLowerCase().replace(/ /g, "_");
      if (key === "month") {
        return moment(row[key], "M, YYYY").format("MMM-YYYY");
      }
      return JSON.stringify(row[key]) || "";
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

const downloadCSV = (data, filterBy) => {
  const filteredData = data
    .filter((record) => {
      if (filterBy.month) {
        return (
          moment(record.month, "M, YYYY").format("MMM-YYYY") === filterBy.month
        );
      }
      if (filterBy.year) {
        return moment(record.month, "M, YYYY").format("YYYY") === filterBy.year;
      }
      return true;
    })
    .map((record) => {
      const { userId, address, designation, dateOfJoining, ...rest } = record;
      return rest;
    });

  const csv = convertToCSV(filteredData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  if (filterBy.month) {
    link.setAttribute(
      "download",
      `salary_slips_${filterBy.month.replace(", ", "-")}.csv`
    );
  } else if (filterBy.year) {
    link.setAttribute("download", `salary_slips_${filterBy.year}.csv`);
  } else {
    link.setAttribute("download", "salary_slips.csv");
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SalarySlipList = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [selectedSalarySlip, setSelectedSalarySlip] = useState(null);
  const [showModal, setShowModal] = useState({
    edit: false,
    add: false,
    delete: false,
    preview: false,
  });

  const fetchData = useCallback(async () => {
    try {
      console.log("Fetching salary slips...");
      const response = await axios.get("/api/salary-slip", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const formattedSlips = response.data.map((slip) => ({
        ...slip,
        date_of_joining: moment(slip.date_of_joining).format("YYYY-MM-DD"),
        month: moment(slip.month, "M, YYYY").format("M, YYYY"),
      }));
      setSalarySlips(formattedSlips);
      console.log("Salary slips fetched successfully", formattedSlips);
    } catch (error) {
      console.error("Failed to fetch salary slips:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalShow = (modalType, slip = null) => {
    setSelectedSalarySlip(slip);
    setShowModal((prevState) => ({
      ...prevState,
      [modalType]: true,
    }));
  };

  const closeModal = () => {
    setShowModal({
      edit: false,
      add: false,
      delete: false,
      preview: false,
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

  const ActionButton = ({ variant, icon, label, onClick }) => (
    <Button size="sm" variant={variant} onClick={onClick} className="mx-1 mb-1">
      <i className={`fa fa-${icon}`}></i> {label}
    </Button>
  );

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
              <i className="fa fa-plus" /> Add Salary Slip
            </Button>
          </h4>
          <Card className="main-card">
            <Card.Header>
              <strong>Salary Slip List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    {
                      title: "Action",
                      render: (rowData) => (
                        <div className="text-center">
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
                    { title: "ID", field: "id" },
                    { title: "Name", field: "name" },
                    { title: "User ID", field: "userId" },
                    { title: "Address", field: "address" },
                    { title: "Designation", field: "designation" },
                    {
                      title: "Month",
                      field: "month",
                      render: (rowData) =>
                        moment(rowData.month, "M, YYYY").format("MMM, YYYY"),
                    },
                    { title: "Date of Joining", field: "date_of_joining" },
                    { title: "Basic Salary", field: "basic_salary" },
                    { title: "HRA", field: "hra" },
                    {
                      title: "Conveyance Allowance",
                      field: "conveyance_allowance",
                    },
                    { title: "Special Allowance", field: "special_allowance" },
                    { title: "Medical Allowance", field: "medical_allowance" },
                    { title: "Total Earnings", field: "total_earnings" },
                    { title: "TDS", field: "tds" },
                    { title: "Professional Tax", field: "professional_tax" },
                    { title: "Employee PF", field: "employee_pf" },
                    { title: "Other Deductions", field: "other_deductions" },
                    { title: "Total Deductions", field: "total_deductions" },
                  ]}
                  data={salarySlips}
                  options={{
                    rowStyle: (rowData, index) =>
                      index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  }}
                  title="Salary Slips"
                  actions={[
                    {
                      icon: () => <i className="fas fa-download"></i>,
                      tooltip: "Download All Salary Slips",
                      isFreeAction: true,
                      onClick: () => downloadCSV(salarySlips, {}),
                    },
                    {
                      icon: () => <i className="fas fa-file-invoice"></i>,
                      tooltip: "Download Current Month's Salary Slips",
                      isFreeAction: true,
                      onClick: () => {
                        const currentMonth = moment().format("MMM-YYYY");
                        downloadCSV(salarySlips, { month: currentMonth });
                      },
                    },
                    {
                      icon: () => <i className="fas fa-calendar-check"></i>,
                      tooltip: "Download Current Year's Salary Slips",
                      isFreeAction: true,
                      onClick: () => {
                        const currentYear = moment().format("YYYY");
                        downloadCSV(salarySlips, { year: currentYear });
                      },
                    },
                  ]}
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
          {showModal.edit && (
            <SalarySlipEditModal
              show={showModal.edit}
              onHide={closeModal}
              data={selectedSalarySlip}
              onUpdateSuccess={fetchData}
            />
          )}
          {showModal.add && (
            <SalarySlipAddModal
              show={showModal.add}
              onHide={closeModal}
              onAddSuccess={fetchData}
              selectedUserId={selectedSalarySlip?.userId}
            />
          )}
          {showModal.delete && (
            <SalarySlipDeleteModal
              show={showModal.delete}
              onHide={closeModal}
              salarySlipId={selectedSalarySlip.id}
              onDeleteSuccess={fetchData}
            />
          )}
          {showModal.preview && (
            <SalarySlipPreviewModal
              show={showModal.preview}
              onHide={closeModal}
              data={selectedSalarySlip}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySlipList;
