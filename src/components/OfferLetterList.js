import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import API_BASE_URL from "../env";
import OfferLetterEditModal from "./OfferLetterEditModal";
import OfferLetterAddModal from "./OfferLetterAddModal";
import OfferLetterDeleteModal from "./OfferLetterDeleteModal";

const OfferLetterList = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOfferLetter, setSelectedOfferLetter] = useState(null);

  useEffect(() => {
    fetchOfferLetters();
  }, []);

  const fetchOfferLetters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/offerLetters/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOfferLetters(
        response.data.map((letter) => ({
          ...letter,
          start_date: moment(letter.start_date).format("YYYY-MM-DD"),
          end_date: letter.end_date
            ? moment(letter.end_date).format("YYYY-MM-DD")
            : null,
        }))
      );
    } catch (error) {
      console.error("Error fetching offer letters:", error);
    }
  };

  const handleEdit = (offerLetter) => {
    setSelectedOfferLetter(offerLetter);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = (offerLetter) => {
    setSelectedOfferLetter(offerLetter);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
    setSelectedOfferLetter(null);
    fetchOfferLetters();
  };

  const theme = createTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px 6px",
        },
      },
    },
  });

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            <a
              className="fa fa-plus mb-2 ml-2"
              onClick={handleAdd}
              style={{ color: "blue", cursor: "pointer" }}
            >
              Add Offer Letter
            </a>
          </h4>
          <Card className="main-card">
            <Card.Header>
              <div className="panel-title">
                <strong>Offer Letter List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "ID", field: "id" },
                    { title: "Full Name", field: "full_name" },
                    { title: "Role", field: "role" },
                    { title: "Department", field: "department" },
                    { title: "Start Date", field: "start_date" },
                    { title: "End Date", field: "end_date" },
                    {
                      title: "Status",
                      field: "end_date",
                      render: (rowData) => {
                        const today = new Date();
                        if (new Date(rowData.start_date) > today) {
                          return <Badge variant="warning">Future</Badge>;
                        }
                        if (
                          !rowData.end_date ||
                          new Date(rowData.end_date) >= today
                        ) {
                          return <Badge variant="success">Active</Badge>;
                        }
                        return <Badge variant="danger">Expired</Badge>;
                      },
                    },
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
                  data={offerLetters}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? "#f2f2f2" : "#ffffff",
                    }),
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                  }}
                  title="Offer Letter List"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
      <OfferLetterEditModal
        show={showEditModal}
        onHide={handleModalClose}
        offerLetter={selectedOfferLetter}
      />
      <OfferLetterAddModal show={showAddModal} onHide={handleModalClose} />
      <OfferLetterDeleteModal
        show={showDeleteModal}
        onHide={handleModalClose}
        offerLetter={selectedOfferLetter}
      />
    </div>
  );
};

export default OfferLetterList;
