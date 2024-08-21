import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import SalarySlipAddModal from "./SalarySlipAddModal";
import SalarySlipEditModal from "./SalarySlipEditModal";
import SalarySlipDeleteModal from "./SalarySlipDeleteModal";
import SalarySlipPreviewModal from "./SalarySlipPreviewModal"; // Import the preview modal
import API_BASE_URL from "../env";

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
        // Format any other date fields as needed
      }));
      setSalarySlips(formattedSlips);
      console.log("Salary slips fetched successfully",formattedSlips);
    } catch (error) {
      console.error("Failed to fetch salary slips:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    console.log(selectedSalarySlip, "selectedSalarySlip");
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
    <Button
      size="sm"
      variant={variant}
      onClick={onClick}
      className="mx-1 mb-1" // Add mb-2 for bottom margin
    >
      <i className={`fas fa-${icon}`}></i> {label}
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
                    { title: "ID", field: "id" },
                    { title: "Name", field: "name" },
                    { title: "User ID", field: "userId" },
                    { title: "Address", field: "address" },
                    { title: "Designation", field: "designation" },
                    { title: "Month", field: "month" },
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
                    {
                      title: "Action",
                      render: (rowData) => (
                        <div className="text-center">
                          {/* <ActionButton
                            variant="info"
                            icon="edit"
                            label="Edit"
                            onClick={() => handleModalShow("edit", rowData)}
                          /> */}
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
                  data={salarySlips}
                  options={{
                    rowStyle: (rowData, index) =>
                      index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  }}
                  title="Salary Slips"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
          {showModal.edit && (
            <SalarySlipEditModal
              show={showModal.edit}
              onHide={closeModal}
              data={selectedSalarySlip}
              onUpdateSuccess={fetchData} // Refetch data after update
            />
          )}
          {showModal.add && (
            <SalarySlipAddModal
              show={showModal.add}
              onHide={closeModal}
              onAddSuccess={fetchData} // Refetch data after addition
              selectedUserId={selectedSalarySlip?.userId} // Pass the selected user's userId
            />
          )}
          {showModal.delete && (
            <SalarySlipDeleteModal
              show={showModal.delete}
              onHide={closeModal}
              salarySlipId={selectedSalarySlip.id} // Pass salarySlipId to the modal
              onDeleteSuccess={fetchData} // Refetch data after deletion
            />
          )}
          {showModal.preview && (
            <SalarySlipPreviewModal
              show={showModal.preview}
              onHide={closeModal}
              data={selectedSalarySlip} // Pass selected salary slip data to the preview modal
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySlipList;
