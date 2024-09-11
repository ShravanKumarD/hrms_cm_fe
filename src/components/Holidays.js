import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../env";
import moment from 'moment';
import './Holidays.css'; // Import CSS for styling

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const[optionalHolidays,setOptionalHolidays]=useState([]);
  const [error, setError] = useState(null);
  const [showHolidays, setShowHolidays] = useState(true);
  const [showOtherTable, setShowOtherTable] = useState(true); // State for toggling the second table


  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const token = localStorage.getItem("token");

        // Fetch data from API
        const response = await axios.get('/api/holiday', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

        if (!response.data) {
          throw new Error('No holiday data found.');
        }
       
        let optionalHolidays =response.data.filter(x=>x.description==="Optional")
        console.log(optionalHolidays,"optionalHolidays")
        setOptionalHolidays(optionalHolidays)

        setHolidays(response.data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching holiday data.');
      }
    };

    fetchHolidays();
  }, []);


  return (
    <div>
      <div className="header">
        <h3>General Holidays</h3>
        <button className="btn btn-info btn-sm" onClick={() => setShowHolidays(!showHolidays)}>
          {showHolidays ? 'Hide Holidays' : 'Show Holidays'}
        </button>
      </div>
      {showHolidays && (
        <div className="content">
          {error && <p className="error">{error}</p>}
          {holidays.length === 0 ? (
            <p>No holidays available.</p>
          ) : (
            <table className="holiday-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={index}>
                    <td>{holiday.name}</td>
                    <td>{moment(holiday.date).format('D MMMM')}</td>
                    <td>{holiday.description}</td>
                    <td>{holiday.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className="additional-holidays">
        <h3>Additional Holidays Information</h3>
        <button className="btn btn-info btn-sm" onClick={() => setShowOtherTable(!showOtherTable)}>
          {showOtherTable ? 'Hide Optional Holidays' : 'Show Optional Holidays'}
        </button>
      </div>
      {showOtherTable && (
        <div className="content">
          <table className="holiday-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {/* Example data, replace with actual data as needed */}
              {optionalHolidays.map((holiday, index) => (
                <tr key={index}>
                  <td>{holiday.name || 'Public'}</td>
                  <td>{moment(holiday.date).format('D MMMM')}</td>
                  <td>{holiday.description}</td>
                  <td>{holiday.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
