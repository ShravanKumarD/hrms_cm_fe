import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../env";
// import 'react-calendar/dist/Calendar.css';
import './TimeSheet.css'; // Custom styles for calendar and holidays

const TimeSheet = () => {
  const [popupContent, setPopupContent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  // const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState(null);


  // useEffect(() => {
  //   const fetchHolidays = async () => {
  //     try {
      
  //       const API_BASE_URL = 'http://localhost:3000/api';
  //       axios.defaults.baseURL = API_BASE_URL;
  //       const token = localStorage.getItem("token");
  //       // Fetch data from API
  //       const response = await axios.get('/holiday', {
  //           headers: {
  //              Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         });

  //       if (!response.data) {
  //         throw new Error('No holiday data found.');
  //       }
  //      console.log(response.data)
  //       setHolidays(response.data);
  //     } catch (error) {
  //       setError(error.message || 'An error occurred while fetching holiday data.');
  //     }
  //   };

  //   fetchHolidays();
  // }, []);


  // const holidays = [
  //   { date: '2024-09-07', label: 'Hartalika Teej', details: 'Festival celebrated by women for marital bliss.' },
  //   { date: '2024-09-07', label: 'Ganesh Chaturthi', details: 'Festival celebrating the birth of Lord Ganesha.' },
  //   { date: '2024-09-17', label: 'Anant Chaturdashi', details: 'Last day of the Ganesh Chaturthi festival.' },
  //   { date: '2024-09-17', label: 'Vishwakarma Puja', details: 'Festival honoring the divine architect Vishwakarma.' },
  //   { date: '2024-09-29', label: 'Pitru Paksha Ends', details: 'Fortnight dedicated to paying homage to ancestors.' },
  //   { date: '2024-09-23', label: 'September Equinox', details: 'Astronomical event marking the start of autumn in the Northern Hemisphere.' },
  //   { date: '2024-09-16', label: 'Prophet Muhammad\'s Birthday', details: 'Islamic observance of the birthday of the Prophet Muhammad.' },
  //   { date: '2024-09-30', label: 'Mahalaya', details: 'Marks the beginning of Durga Puja festivities.' },
  //   { date: '2024-10-02', label: 'Mahatma Gandhi Jayanti', details: 'National holiday marking the birthday of Mahatma Gandhi.' },
  //   { date: '2024-10-03', label: 'First Day of Sharad Navaratri', details: 'Festival dedicated to the worship of the Hindu deity Durga.' },
  //   { date: '2024-10-09', label: 'First Day of Durga Puja', details: 'Celebration in honor of the goddess Durga.' },
  //   { date: '2024-10-10', label: 'Maha Saptami', details: 'Seventh day of Durga Puja festivities.' },
  //   { date: '2024-10-11', label: 'Maha Ashtami', details: 'Eighth day of Durga Puja.' },
  //   { date: '2024-10-12', label: 'Maha Navami', details: 'Ninth day of Durga Puja.' },
  //   { date: '2024-10-13', label: 'Dussehra', details: 'Victory of good over evil, marked by burning effigies.' },
  //   { date: '2024-10-17', label: 'Maharishi Valmiki Jayanti', details: 'Celebration of the birth of the sage Valmiki, author of the Ramayana.' },
  //   { date: '2024-10-20', label: 'Karaka Chaturthi (Karva Chauth)', details: 'Festival observed by married Hindu women for the well-being of their husbands.' },
  //   { date: '2024-10-31', label: 'Naraka Chaturdasi', details: 'Day preceding Diwali, celebrating the defeat of demon Narakasura by Krishna.' },
  //   { date: '2024-11-01', label: 'Diwali/Deepavali', details: 'Festival of lights, celebrating the victory of light over darkness.' },
  // ];
  const holidays = [
    { date: '2024-01-26', label: 'Republic Day', details: 'National holiday celebrating the adoption of the Constitution of India.' },
    { date: '2024-03-08', label: 'Mahashivratri', details: 'Hindu festival honoring Lord Shiva. Optional holiday in some regions.' },
    { date: '2024-03-25', label: 'Holi', details: 'Hindu spring festival known for its colorful celebrations.' },
    { date: '2024-04-11', label: 'Id-Ul-Fitr (Ramzan Id)', details: 'Islamic holiday marking the end of Ramadan, the month of fasting.' },
    { date: '2024-06-17', label: 'Bakri Id', details: 'Islamic festival of sacrifice. Optional holiday in some regions.' },
    { date: '2024-08-15', label: 'Independence Day', details: 'National holiday commemorating India\'s independence from British rule.' },
    { date: '2024-09-07', label: 'Vinayak Chaturthi', details: 'Hindu festival celebrating the birth of Lord Ganesha.' },
    { date: '2024-10-02', label: 'Mahatma Gandhi Jayanti', details: 'National holiday honoring the birthday of Mahatma Gandhi.' },
    { date: '2024-10-09', label: 'Bathukamma', details: 'Floral festival celebrated in Telangana. Holiday in some regions, optional in others.' },
    { date: '2024-10-12', label: 'Vijayadashami', details: 'Hindu festival marking the victory of good over evil.' },
    { date: '2024-11-01', label: 'Diwali * Laxmi Pujan', details: 'Festival of lights, one of the major Hindu celebrations.' },
    { date: '2024-12-25', label: 'Christmas', details: 'Christian holiday celebrating the birth of Jesus Christ.' },
  ];
  
  const formatDate = (date) => date.toISOString().split('T')[0];

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      const holiday = holidays.find(holiday =>
        holiday.date === formattedDate
      );
      return holiday ? (
        <div
          className="holiday-label"
          onMouseEnter={(e) => {
            const rect = e.target.getBoundingClientRect();
            setPopupContent(holiday);
            setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
          }}
          onMouseLeave={() => {
            setPopupContent(null);
          }}
        >
          {holiday.label}
        </div>
      ) : null;
    }
  };

  // Get current month and year for the heading
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="timesheet-container">
      <h3 className="timesheet-title">{currentMonthYear}</h3>
      <div className="calendar-container">
        {/* <Calendar
          value={new Date(2024, 8,10 )} 
          tileContent={tileContent}
          className="custom-calendar"
        /> */}
        {popupContent && (
          <div
            className="popup-content"
            style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
          >
            <strong>{popupContent.label}</strong>
            <p>{popupContent.details}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSheet;
