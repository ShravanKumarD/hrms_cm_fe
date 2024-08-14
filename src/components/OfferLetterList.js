import React, { useRef, useState, useEffect, useCallback } from "react";
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
import OfferLetterPreviewModal from "./OfferLetterPreviewModal";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OfferLetterList = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [modalState, setModalState] = useState({
    showEdit: false,
    showAdd: false,
    showDelete: false,
    showPreview: false,
    selectedOfferLetter: null,
  });
  const previewRef = useRef(null);

  const theme = createTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px 6px",
        },
      },
    },
  });

  const fetchOfferLetters = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchOfferLetters();
  }, [fetchOfferLetters]);

  const openModal = (modalType, offerLetter = null) => {
    setModalState({
      showEdit: modalType === "edit",
      showAdd: modalType === "add",
      showDelete: modalType === "delete",
      showPreview: modalType === "preview",
      selectedOfferLetter: offerLetter,
    });
  };

  const closeModal = () => {
    setModalState({
      showEdit: false,
      showAdd: false,
      showDelete: false,
      showPreview: false,
      selectedOfferLetter: null,
    });
    fetchOfferLetters(); // Refresh the list after any modal closes
  };

  const downloadPDF = () => {
    if (previewRef.current) {
      const offerLetterContent = previewRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(offerLetterContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("offer_letter.pdf");
    } else {
      console.error("Preview element is not found");
    }
  };

  const { showEdit, showAdd, showDelete, showPreview, selectedOfferLetter } =
    modalState;

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            <Button
              variant="link"
              className="p-0"
              onClick={() => openModal("add")}
              style={{ color: "blue", cursor: "pointer" }}
            >
              <i className="fa fa-plus" />
              Add Offer Letter
            </Button>
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
                        // <Form className="row">
                        //   <div className="col pl-5">
                        //     <Button
                        //       size="sm"
                        //       variant="info"
                        //       onClick={() => openModal("edit", rowData)}
                        //     >
                        //       <i className="fas fa-edit"></i> Edit
                        //     </Button>
                        //   </div>


                        //   <div className="col pr-5">
                        //     <Button
                        //       size="sm"
                        //       variant="danger"
                        //       onClick={() => openModal("delete", rowData)}
                        //     >
                        //       <i className="fas fa-trash"></i> Delete
                        //     </Button>
                        //   </div>
                        
                        //   <div className="col pr-5">
                        //     <Button
                        //       size="sm"
                        //       variant="secondary"
                        //       onClick={() => openModal("preview", rowData)}
                        //     >
                        //       <i className="fas fa-eye"></i> Preview
                        //     </Button>
                        //   </div>
                        // </Form>
                        <Form className="row">
  <div className="col d-flex justify-content-center">
    <Button
      size="sm"
      variant="info"
      onClick={() => openModal("edit", rowData)}
    >
      <i className="fas fa-edit"></i> Edit
    </Button>
  </div>

  <div className="col d-flex justify-content-center">
    <Button
      size="sm"
      variant="secondary"
      onClick={() => openModal("preview", rowData)}
    >
      <i className="fas fa-eye"></i> Preview
    </Button>
  </div>
  <div className="col d-flex justify-content-center">
    <Button
      size="sm"
      variant="danger"
      onClick={() => openModal("delete", rowData)}
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
      {showEdit && selectedOfferLetter && (
        <OfferLetterEditModal
          show={showEdit}
          onHide={closeModal}
          data={selectedOfferLetter}
          onSuccess={fetchOfferLetters}
        />
      )}
      {showAdd && (
        <OfferLetterAddModal
          show={showAdd}
          onSuccess={fetchOfferLetters}
          onHide={closeModal}
        />
      )}
      {showDelete && selectedOfferLetter && (
        <OfferLetterDeleteModal
          show={showDelete}
          onHide={closeModal}
          offerLetterId={selectedOfferLetter.id}
          onDeleteSuccess={fetchOfferLetters}
        />
      )}
      {showPreview && selectedOfferLetter && (
        <OfferLetterPreviewModal
          show={showPreview}
          onHide={closeModal}
          data={selectedOfferLetter}
          ref={previewRef}
          downloadPDF={downloadPDF}
        />
      )}
    </div>
  );
};

export default OfferLetterList;
