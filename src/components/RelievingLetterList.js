import React, { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import RelievingLetterAddModal from "./RelievingLetterAddModal";
import RelievingLetterEditModal from "./RelievingLetterEditModal";
import RelievingLetterDeleteModal from "./RelievingLetterDeleteModal";
import RelievingLetterPreviewModal from "./RelievingLetterPreviewModal";
import API_BASE_URL from "../env";

const RelievingLetterList = () => {
  const [relievingLetters, setRelievingLetters] = useState([]);
  const [selectedRelievingLetter, setSelectedRelievingLetter] = useState(null);
  const [showModal, setShowModal] = useState({
    edit: false,
    add: false,
    delete: false,
    preview: false,
  });

  const fetchData = useCallback(async () => {
    try {
      console.log("Fetching relieving letters...");
      const response = await axios.get("/api/relievingLetters", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const formattedLetters = response.data.map((letter) => ({
        ...letter,
        date: moment(letter.date).format("YYYY-MM-DD"),
        date_of_joining: moment(letter.date_of_joining).format("YYYY-MM-DD"),
        date_of_relieving: moment(letter.date_of_relieving).format(
          "YYYY-MM-DD"
        ),
      }));
      setRelievingLetters(formattedLetters);
      console.log("Relieving letters fetched successfully");
    } catch (error) {
      console.error("Failed to fetch relieving letters:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalShow = (modalType, letter = null) => {
    setSelectedRelievingLetter(letter);
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
          padding: "8px",
        },
      },
    },
  });

  const ActionButton = ({ variant, icon, label, onClick }) => (
    <Button size="sm" variant={variant} onClick={onClick} className="mx-1 mb-1">
      <i className={`fas fa-${icon}`}></i> {label}
    </Button>
  );

  const columns = [
    { title: "ID", field: "id" },
    { title: "Date", field: "date" },
    { title: "Employee Name", field: "employee_name" },
    { title: "Employee ID", field: "employee_id" },
    { title: "Position", field: "position" },
    { title: "Department", field: "department" },
    { title: "Date of Joining", field: "date_of_joining" },
    { title: "Date of Relieving", field: "date_of_relieving" },
    { title: "HR Name", field: "hr_name" },
    { title: "Company", field: "company_name" },
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
  ];

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
              <i className="fa fa-plus" /> Add Relieving Letter
            </Button>
          </h4>
          <div>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={columns}
                data={relievingLetters}
                options={{
                  rowStyle: (rowData, index) =>
                    index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  headerStyle: {
                    backgroundColor: "#f8f9fa",
                    color: "#495057",
                    fontWeight: "bold",
                  },
                  actionsColumnIndex: -1,
                  actionsCellStyle: {
                    paddingRight: "8px",
                  },
                }}
                title="Relieving Letters"
              />
            </ThemeProvider>
          </div>
          {showModal.edit && (
            <RelievingLetterEditModal
              show={showModal.edit}
              onHide={closeModal}
              data={selectedRelievingLetter}
              onUpdateSuccess={fetchData}
            />
          )}
          {showModal.add && (
            <RelievingLetterAddModal
              show={showModal.add}
              onHide={closeModal}
              onAddSuccess={fetchData}
            />
          )}
          {showModal.preview && (
            <RelievingLetterPreviewModal
              show={showModal.preview}
              onHide={closeModal}
              data={selectedRelievingLetter}
            />
          )}
          {showModal.delete && (
            <RelievingLetterDeleteModal
              show={showModal.delete}
              onHide={closeModal}
              relievingLetterId={selectedRelievingLetter.id}
              onDeleteSuccess={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RelievingLetterList;
