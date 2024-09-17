import React, { useState, useEffect, useCallback } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Date of Relieving</th>
                <th>HR Name</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {relievingLetters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.id}</td>
                  <td>{letter.date}</td>
                  <td>{letter.employee_name}</td>
                  <td>{letter.employee_id}</td>
                  <td>{letter.position}</td>
                  <td>{letter.department}</td>
                  <td>{letter.date_of_joining}</td>
                  <td>{letter.date_of_relieving}</td>
                  <td>{letter.hr_name}</td>
                  <td>{letter.company_name}</td>
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
          {/* {showModal.edit && (
            <RelievingLetterEditModal
              show={showModal.edit}
              onHide={closeModal}
              data={selectedRelievingLetter}
              onUpdateSuccess={fetchData}
            />
          )} */}
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
          {/* {showModal.delete && (
            <RelievingLetterDeleteModal
              show={showModal.delete}
              onHide={closeModal}
              relievingLetterId={selectedRelievingLetter.id}
              onDeleteSuccess={fetchData}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default RelievingLetterList;
