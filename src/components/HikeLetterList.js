import React, { useState, useEffect, useCallback } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import HikeLetterAddModal from "./HikeLetterAddModal";
import HikeLetterEditModal from "./HikeLetterEditModal";
import HikeLetterDeleteModal from "./HikeLetterDeleteModal";
import HikeLetterPreviewModal from "./HikeLetterPreviewModal";
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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Name</th>
                <th>Place</th>
                <th>Effective Date</th>
                <th>New Salary</th>
                <th>Previous Salary</th>
                <th>HR Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hikeLetters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.id}</td>
                  <td>{letter.date}</td>
                  <td>{letter.name}</td>
                  <td>{letter.place}</td>
                  <td>{letter.effective_date}</td>
                  <td>{letter.new_salary}</td>
                  <td>{letter.previous_salary}</td>
                  <td>{letter.hr_name}</td>
                  <td className="text-center">
                    {/* <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleModalShow("edit", letter)}
                      className="mx-1 mb-1"
                    >
                      <i className="fas fa-edit" /> Edit
                    </Button> */}
                    <button
                     className="btn btn-light btn-sm"
                      onClick={() => handleModalShow("preview", letter)}
                    >
                      <i className="fas fa-eye" /> 
                    </button>
                    {/* <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleModalShow("delete", letter)}
                      className="mx-1 mb-1"
                    >
                      <i className="fas fa-trash" /> Delete
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {showModal.edit && selectedHikeLetter && (
        <HikeLetterEditModal
          show={showModal.edit}
          onHide={closeModal}
          data={selectedHikeLetter}
          onUpdateSuccess={fetchData}
        />
      )}
      {showModal.add && (
        <HikeLetterAddModal show={showModal.add} onHide={closeModal} onAddSuccess={fetchData} />
      )}
      {showModal.preview && selectedHikeLetter && (
        <HikeLetterPreviewModal
          show={showModal.preview}
          onHide={closeModal}
          data={selectedHikeLetter}
        />
      )}
      {showModal.delete && selectedHikeLetter && (
        <HikeLetterDeleteModal
          show={showModal.delete}
          onHide={closeModal}
          hikeLetterId={selectedHikeLetter.id}
          onDeleteSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default HikeLetterList;
