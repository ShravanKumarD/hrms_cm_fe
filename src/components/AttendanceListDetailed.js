import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Array for days 1 to 31

const employees = [
  'John Doe',
  'Jane Smith',
  'Emily Johnson',
  'Michael Brown',
  // Add more employees as needed
];

const attendanceData = (employeeName, day) => {
  // Placeholder logic for attendance data
  // Replace with actual data fetching logic
  return Math.random() > 0.5 ? 'Present' : 'Absent';
};

const renderTick = (status) => {
  return status === 'Present' ? '✔️' : '❌';
};

const AttendanceListDetailed = () => {
  return (
    <div className="container mt-4">
      <h2>Detailed Attendance List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Employee</th>
            {daysInMonth.map(day => (
              <th key={day}>Day {day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee}>
              <td>{employee}</td>
              {daysInMonth.map(day => (
                <td key={day}>
                  {renderTick(attendanceData(employee, day))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AttendanceListDetailed;
