import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import HikeLetterAddModal from "./HikeLetterAddModal";
import HikeLetterEditModal from "./HikeLetterEditModal";
import HikeLetterDeleteModal from "./HikeLetterDeleteModal";
import API_BASE_URL from "../../env";

const HikeLetterList = () => {
  const [hikeLetters, setHikeLetters] = useState([]);
  const [selectedHikeLetter, setSelectedHikeLetter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleEdit = (letter) => {
    setSelectedHikeLetter(letter);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = (letter) => {
    setSelectedHikeLetter(letter);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
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

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            <Button
              variant="link"
              onClick={handleAdd}
              className="p-0"
              style={{ color: "blue", cursor: "pointer" }}
            >
              <i className="fa fa-plus" /> Add Hike Letter
            </Button>
          </h4>
          <Card className="main-card">
            <Card.Header>
              <strong>Hike Letter List</strong>
            </Card.Header>
            <Card.Body>
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
                        <Form className="row">
                          <div className="col pl-5">
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleEdit(rowData)}
                            >
                              <i className="fas fa-edit"></i> Edit
                            </Button>
                          </div>
                          <div className="col pr-5">
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(rowData)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </Button>
                          </div>
                        </Form>
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
            </Card.Body>
          </Card>
          {showEditModal && (
            <HikeLetterEditModal
              show={showEditModal}
              onHide={closeModal}
              data={selectedHikeLetter}
              onUpdateSuccess={fetchData} // Refetch data after update
            />
          )}
          {showAddModal && (
            <HikeLetterAddModal
              show={showAddModal}
              onHide={closeModal}
              onAddSuccess={fetchData} // Refetch data after addition
            />
          )}
          {showDeleteModal && (
            <HikeLetterDeleteModal
              show={showDeleteModal}
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
