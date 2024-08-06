// src/components/AttendanceList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../env";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL; // Set the base URL
        const response = await axios.get("/api/attendance", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(response.data,"datatatta")
        setAttendances(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendances();
  }, []);

  return (
    // <div>
    //   <h2>Attendance List</h2>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>ID</th>
    //         <th>User ID</th>
    //         <th>Date</th>
    //         <th>Status</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {attendances.map((attendance) => (
    //         <tr key={attendance.id}>
    //           <td>{attendance.id}</td>
    //           <td>{attendance.userId}</td>
    //           <td>{attendance.date}</td>
    //           <td>{attendance.status}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <div className="container table-container">
    <h2 className="my-4 text-center">Attendance List</h2>
    <table className="table table-striped table-bordered">
      <thead className="thead-dark">
        <tr>       
          <th>User ID</th>
         <th>Name</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {attendances.map((attendance) => (
          <tr key={attendance.id}>
             <td>{attendance.userId}</td>
            <td>{attendance.user.fullName}</td>
            <td>{new Date(attendance.date).toLocaleDateString()}</td>
            <td className={attendance.status === 'Present' ? 'attendance-status-present' : 'attendance-status-absent'}>
              {attendance.status}
            </td>   
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default AttendanceList;
