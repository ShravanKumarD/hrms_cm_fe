import React, { useState, useEffect } from 'react';
import { Table, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import API_BASE_URL from '../env'; // Update the path as needed

const months = moment.months(); // Array of month names
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Array for days 1 to 31

const AttendanceListDetailed = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/attendance', {
          baseURL: API_BASE_URL,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Process and format the attendance data
        const formattedData = response.data.map((attendance) => {
          const date = moment(attendance.date).format('YYYY-MM-DD');
          return {
            ...attendance,
            formattedDate: date,
            day: moment(date).date(),
            month: moment(date).format('MMMM'),
            employeeName: attendance.user.fullName,
            status: attendance.status.toLowerCase() === 'present' ? '✔️' : '❌',
          };
        });

        setAttendanceData(formattedData);

        // Get unique employee names
        const employees = [...new Set(formattedData.map((att) => att.employeeName))];
        setEmployeeList(employees);

      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter the attendance data by the selected month
    const filteredData = attendanceData.filter(att => att.month === selectedMonth);
    setFilteredAttendanceData(filteredData);
  }, [selectedMonth, attendanceData]);

  // Create a map of employee names to their attendance data
  const employeeAttendanceMap = employeeList.reduce((map, employee) => {
    map[employee] = daysInMonth.reduce((acc, day) => {
      acc[day] = '❌'; // Default to Absent
      return acc;
    }, {});

    filteredAttendanceData
      .filter(att => att.employeeName === employee)
      .forEach(att => {
        map[employee][att.day] = att.status;
      });

    return map;
  }, {});

  return (
    <div className="container mt-4">
      <div>
        <div>
          <Card.Title>Detailed Attendance List</Card.Title>
          <p>&nbsp;</p>
          <Form.Group controlId="monthFilter">
            <Form.Label>Select Month</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </Form.Control>
          </Form.Group>
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Employee</th>
                {daysInMonth.map(day => (
                  <th key={day}>Day {day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employeeList.map(employee => (
                <tr key={employee}>
                  <td>{employee}</td>
                  {daysInMonth.map(day => (
                    <td key={day}>
                      {employeeAttendanceMap[employee][day]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceListDetailed;
