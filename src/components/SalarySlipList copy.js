import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import SalarySlipAddModal from "./SalarySlipAddModal";
import SalarySlipEditModal from "./SalarySlipEditModal";
import SalarySlipDeleteModal from "./SalarySlipDeleteModal";
import SalarySlipTemplate from "./SalarySlipTemplate";
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

const SalarySlipPreviewModal = ({ show, onHide, data }) => {
  console.log(data, "SalarySlipPreviewModal data");

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Salary Slip Preview</Modal.Title>
      </Modal.Header>
      {/* <Modal.Body> */}
        {/* Pass the entire data object directly to the SalarySlipTemplate */}
        <SalarySlipTemplate data={data} />
      {/* </Modal.Body> */}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
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
    console.log(`Opening ${modalType} modal with slip:`, slip);
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

  return (
    <div>
      <Card.Header>
        <button
         className="dashboard-icons mx-1 mb-1"
          onClick={() => handleModalShow("add")}
        >
          <i className="fa fa-plus"></i> Add Salary Slip
        </button>
        <button
       className="dashboard-icons mx-1 mb-1"
          onClick={() => downloadCSV(salarySlips, {})}
        >
          <i className="fa fa-download"></i> Export CSV
        </button>
      </Card.Header>
      <Card.Body>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>HRA</th>
              <th>Conveyance Allowance</th>
              <th>Special Allowance</th>
              <th>Medical Allowance</th>
              <th>Total Earnings</th>
              <th>TDS</th>
              <th>Professional Tax</th>
              <th>Employee PF</th>
              <th>Other Deductions</th>
              <th>Total Deductions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salarySlips.map((slip) => (
              <tr key={slip.id}>
                <td>{slip.id}</td>
                <td>{slip.name}</td>
                <td>{moment(slip.month, "M, YYYY").format("MMM-YYYY")}</td>
                <td>{slip.basic_salary}</td>
                <td>{slip.hra}</td>
                <td>{slip.conveyance_allowance}</td>
                <td>{slip.special_allowance}</td>
                <td>{slip.medical_allowance}</td>
                <td>{slip.total_earnings}</td>
                <td>{slip.tds}</td>
                <td>{slip.professional_tax}</td>
                <td>{slip.employee_pf}</td>
                <td>{slip.other_deductions}</td>
                <td>{slip.total_deductions}</td>
                <td>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                      variant="light"
                      onClick={() => handleModalShow("edit", slip)}
                      className="sm"
                    >
                      <i className="fa fa-edit"></i>
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => handleModalShow("delete", slip)}
                      className="sm"
                    >
                      <i className="fa fa-trash"></i>
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => handleModalShow("preview", slip)}
                      className="sm"
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {showModal.add && <SalarySlipAddModal show={showModal.add} onHide={closeModal} onSuccess={fetchData} />}
      {showModal.edit && <SalarySlipEditModal show={showModal.edit} onHide={closeModal} slip={selectedSalarySlip} onSuccess={fetchData} />}
      {showModal.delete && <SalarySlipDeleteModal show={showModal.delete} onHide={closeModal} slip={selectedSalarySlip} onDeleteSuccess={fetchData} />}
      {showModal.preview && (
        <SalarySlipPreviewModal
          show={showModal.preview}
          onHide={closeModal}
          data={selectedSalarySlip}
        />
      )}
    </div>
  );
};

export default SalarySlipList;
