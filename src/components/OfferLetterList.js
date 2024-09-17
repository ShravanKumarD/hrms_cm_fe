import React, { useRef, useState, useEffect, useCallback } from "react";
import { Card, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../env";
import OfferLetterEditModal from "./OfferLetterEditModal";
import OfferLetterAddModal from "./OfferLetterAddModal";
import OfferLetterDeleteModal from "./OfferLetterDeleteModal";
import OfferLetterPreviewModal from "./OfferLetterPreviewModal";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import OfferLetterTemplate from "./OfferLetterTemplate";

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

  // Fetch offer letters
  const fetchOfferLetters = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/offerLetters/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(  response.data)
      setOfferLetters(
        response.data.map((letter) => ({
          ...letter,
          start_date: moment(letter.start_date).format("Do MMM YYYY"),
          end_date: letter.end_date
            ? moment(letter.end_date).format("Do MMM YYYY")
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

  // Modal handlers
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
    fetchOfferLetters(); // Refresh the list after modal closes
  };

  // Download offer letter as PDF
  const downloadPDF = () => {
    if (previewRef.current) {
      const offerLetterContent = previewRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(offerLetterContent);
      const documentDefinition = { content: pdfContent };
      pdfMake.createPdf(documentDefinition).download("offer_letter.pdf");
    } else {
      console.error("Preview element not found");
    }
  };

  const { showEdit, showAdd, showDelete, showPreview, selectedOfferLetter } = modalState;

  return (
    <div className="container-fluid pt-2">
      <>
        <Card.Header>
          <h4>Offer Letters</h4>
          <button
            onClick={() => openModal("add")}
        className="dashboard-icons"
          >
            <i className="fa fa-plus" /> Add Offer Letter
          </button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offerLetters.length > 0 ? (
                offerLetters.map((offerLetter) => (
                  <tr key={offerLetter.id}>
                    <td>{offerLetter.full_name}</td>
                    <td>{offerLetter.role}</td>
                    <td>{offerLetter.start_date}</td>
                    <td>{offerLetter.department}</td>
                    <td>
                      <button
                        className="dashboard-icons"
                        onClick={() => openModal("preview", offerLetter)}
                      >
                        Preview
                      </button>
                      {/* <Button
                     className="btn btn-light btn-sm"
                        onClick={() => openModal("edit", offerLetter)}
                      >
                        Edit
                      </Button> */}
                      {/* <Button
                     className="btn btn-light btn-sm"
                        onClick={() => openModal("delete", offerLetter)}
                      >
                        Delete
                      </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No offer letters found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </>

      {/* Modals for Edit, Add, Delete, and Preview */}
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
          onHide={closeModal}
          onSuccess={fetchOfferLetters}
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
