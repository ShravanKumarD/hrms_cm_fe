import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import HikeLetterAddModal from "./HikeLetterAddModal";
import HikeLetterEditModal from "./HikeLetterEditModal";
import HikeLetterDeleteModal from "./HikeLetterDeleteModal";
import HikeLetterPreviewModal from "./HikeLetterPreviewModal"; // Import the preview modal
import API_BASE_URL from "../env";

const HikeLetterList = () => {
  const [hikeLetters, setHikeLetters] = useState([]);
  const [selectedHikeLetter, setSelectedHikeLetter] = useState(null);
  const [showModal, setShowModal] = useState({
    edit: false,
    add: false,
    delete: false,
    preview: false,
  });

  const fetchData = useCallback(async () => {
    try {
      console.log("Fetching hike letters...");
      const response = await axios.get("/api/hikeLetters", {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const formattedLetters = response.data.map((letter) => ({
        ...letter,
        date: moment(letter.date).format("YYYY-MM-DD"),
        effective_date: moment(letter.effective_date).format("YYYY-MM-DD"),
      }));
      setHikeLetters(formattedLetters);
      console.log("Hike letters fetched successfully");
    } catch (error) {
      console.error("Failed to fetch hike letters:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalShow = (modalType, letter = null) => {
    setSelectedHikeLetter(letter);
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
              <i className="fa fa-plus" /> Add Hike Letter
            </Button>
          </h4>
          <div>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { title: "ID", field: "id" },
                  { title: "Date", field: "date" },
                  { title: "Name", field: "name" },
                  { title: "Place", field: "place" },
                  { title: "Effective Date", field: "effective_date" },
                  { title: "New Salary", field: "new_salary" },
                  { title: "Previous Salary", field: "previous_salary" },
                  { title: "HR Name", field: "hr_name" },
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
                data={hikeLetters}
                options={{
                  rowStyle: (rowData, index) =>
                    index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                  pageSize: 8,
                  pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                }}
                title="Hike Letters"
              />
            </ThemeProvider>
          </div>
          {showModal.edit && (
            <HikeLetterEditModal
              show={showModal.edit}
              onHide={closeModal}
              data={selectedHikeLetter}
              onUpdateSuccess={fetchData} // Refetch data after update
            />
          )}
          {showModal.add && (
            <HikeLetterAddModal
              show={showModal.add}
              onHide={closeModal}
              onAddSuccess={fetchData} // Refetch data after addition
            />
          )}
          {showModal.preview && (
            <HikeLetterPreviewModal
              show={showModal.preview}
              onHide={closeModal}
              data={selectedHikeLetter} // Pass selected hike letter data to the preview modal
            />
          )}
          {showModal.delete && (
            <HikeLetterDeleteModal
              show={showModal.delete}
              onHide={closeModal}
              hikeLetterId={selectedHikeLetter.id} // Pass hikeLetterId to the modal
              onDeleteSuccess={fetchData} // Refetch data after deletion
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HikeLetterList;
