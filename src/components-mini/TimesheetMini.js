import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import LightweightStartWork from './LightweightStartWork';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from './../env';
import './../components/TimeSheet.css';
import ApplicationModal from '../components/ApplicationModal';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        const token = localStorage.getItem('token');

        // Fetch holidays and birthdays
        const [holidayResponse, userResponse] = await Promise.all([
          axios.get('/api/holiday', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const holidays = holidayResponse.data.map(holiday => ({
          title: holiday.name,
          date: holiday.date,
          backgroundColor: holiday.description === 'Optional' ? '#8adcd2' : '#a7a4a4',
          borderColor: holiday.description === 'Holiday' ? '#8adcd2' : '#a7a4a4',
        }));

        const birthdays = userResponse.data
          .map(user => {
            const birthDate = moment(user.user_personal_info?.dateOfBirth, 'YYYY-MM-DD');
            if (birthDate.isValid()) {
              return {
                title: `${user.fullName.split(' ')[0]}'s Birthday`,
                date: birthDate.format('YYYY-MM-DD'),
                backgroundColor: 'rgba(255, 223, 186, 0.5)',
                borderColor: 'rgba(255, 223, 186, 0.8)',
              };
            }
            return null;
          })
          .filter(event => event !== null);
        setEvents([...holidays, ...birthdays]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    const today = new Date();
    if (clickedDate.toDateString() === today.toDateString()) {
      setShowModal(true);
    } else {
      setClickedDate(clickedDate);
      setShowApplicationModal(true);
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          right: 'prev,next',
        }}
        dateClick={handleDateClick}
        height="auto"
        events={events}
        className="calendar-container"
      />
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Start Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LightweightStartWork />
        </Modal.Body>
      </Modal>
      <ApplicationModal
        show={showApplicationModal}
        onHide={() => setShowApplicationModal(false)}
        date={clickedDate}
      />
    </>
  );
}
