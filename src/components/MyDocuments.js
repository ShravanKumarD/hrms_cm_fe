import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDocuments = () => {
  const [documents, setDocuments] = useState({});
  const userId = 10; // Assuming this is dynamically set based on logged-in user

  useEffect(() => {
    // Fetch documents when component mounts
    axios
      .get(`http://localhost:80/api/uploadLetters/user/${userId}`)
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the documents!", error);
      });
  }, [userId]);

  const downloadFile = (filePath) => {
    axios({
      url: `http://localhost:80/api/uploadLetters/download`,
      method: "POST",
      responseType: "blob", // Important
      data: { filePath },
    })
      .then((response) => {
        // Create a link element and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filePath.split("/").pop()); // Extract filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("There was an error downloading the file!", error);
      });
  };

  return (
    <div>
      <h1>My Documents</h1>
      <table>
        <thead>
          <tr>
            <th>Document Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.offerLetter && (
            <tr>
              <td>Offer Letter</td>
              <td>
                <button onClick={() => downloadFile(documents.offerLetter)}>
                  Download
                </button>
              </td>
            </tr>
          )}
          {documents.salarySlips &&
            documents.salarySlips.split(",").map((path, index) => (
              <tr key={index}>
                <td>Salary Slip {index + 1}</td>
                <td>
                  <button onClick={() => downloadFile(path.trim())}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          {documents.hikeLetter && (
            <tr>
              <td>Hike Letter</td>
              <td>
                <button onClick={() => downloadFile(documents.hikeLetter)}>
                  Download
                </button>
              </td>
            </tr>
          )}
          {documents.relievingLetter && (
            <tr>
              <td>Relieving Letter</td>
              <td>
                <button onClick={() => downloadFile(documents.relievingLetter)}>
                  Download
                </button>
              </td>
            </tr>
          )}
          {documents.resignationLetter && (
            <tr>
              <td>Resignation Letter</td>
              <td>
                <button
                  onClick={() => downloadFile(documents.resignationLetter)}
                >
                  Download
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyDocuments;
