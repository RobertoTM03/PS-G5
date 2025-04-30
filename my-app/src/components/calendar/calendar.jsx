// ---------------------------
// 1. MODELO (Model)
// ---------------------------
class CalendarEvent {
  constructor({ id, title, location, description, start, end, isAllDay, createdBy }) {
    Object.assign(this, { id, title, location, description, start, end, isAllDay, createdBy });
  }
}

function parseToLocalDate(isoString) {
  const [date, time] = isoString.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

// ---------------------------
// 2. VISTA / VIEWMODEL
// ---------------------------
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import NuevoEvento from './NuevoEvento.jsx';
import DisplayEvents from './displayEvents.jsx';
import EventDetailsPopup from './EventDetailsPopup.jsx';
import EditEvent from './editEvent.jsx';
import './calendar.css';

export default function CalendarPage() {
  const { id } = useParams();
  const calendarRef = useRef(null);
  const [inst, setInst] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [events, setEvents] = useState([]);

  const [showDisplay, setShowDisplay] = useState(false);
  const [displayDate, setDisplayDate] = useState(null);
  const [displayEvents, setDisplayEvents] = useState([]);

  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoData, setNuevoData] = useState({ start: null, end: null });

  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [editEventData, setEditEventData] = useState(null);

  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Leer userId y rol del token (JWT asumido)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.userId || payload.id);
        setIsAdmin(payload.role === 'admin' || payload.isAdmin);
      } catch (err) {
        console.warn('⚠️ Error leyendo token:', err);
      }
    }
  }, []);

  const updateTitle = (calendarInst) => {
    const d = calendarInst.getDate();
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    setCurrentDate(`${yy}.${mm}`);
  };

  const fetchMonthlyEvents = async () => {
    if (!inst) return;
    const date = inst.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0);
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/groups/${id}/activities/range?startDate=${start}&endDate=${end}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const fetchedEvents = data.map(ev => new CalendarEvent({
          id: String(ev.id),
          title: ev.title,
          location: ev.location,
          description: ev.description,
          start: parseToLocalDate(ev.startDate),
          end: parseToLocalDate(ev.endDate),
          isAllDay: false,
          createdBy: ev.createdBy || ev.userId // 👈 asegurar este campo
        }));

        if (inst) {
          inst.clear();
          inst.createEvents(fetchedEvents.map(ev => ({
            id: String(ev.id),
            calendarId: '1',
            title: ev.title,
            category: ev.isAllDay ? 'allday' : 'time',
            start: ev.start,
            end: ev.end,
            location: ev.location,
            isAllDay: ev.isAllDay,
            raw: {
              description: ev.description,
            }
          })));
        }

        setEvents(fetchedEvents);
      }
    } catch (err) {
      console.error('❌ Error al cargar eventos:', err);
    }
  };

  useEffect(() => {
    if (!calendarRef.current || !window.tui?.Calendar) return;

    const Calendar = window.tui.Calendar;
    const c = new Calendar(calendarRef.current, {
      defaultView: 'month',
      useCreationPopup: false,
      useDetailPopup: false,
      popupContainer: document.body,
      gridSelection: { enableClick: true },
      calendars: [{
        id: '1',
        name: 'Eventos',
        color: '#ffffff',
        bgColor: '#047bfe',
        dragBgColor: '#047bfe',
        borderColor: '#047bfe',
      }],
    });

    c.on('clickEvent', info => {
      const e = info.event;
      const eventObj = new CalendarEvent({
        id: String(e.id),
        title: e.title,
        location: e.location,
        description: e.raw?.description || '',
        start: new Date(e.start),
        end: new Date(e.end),
        isAllDay: e.isAllDay,
        createdBy: e.raw?.createdBy || null,
      });

      setSelectedEvent(eventObj);
      setShowEventDetails(true);
    });

    c.on('selectDateTime', async info => {
      const clickedDate = info.start.toLocaleDateString('en-CA');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/groups/${id}/activities/day/${clickedDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const daily = await response.json();
        if (response.ok) {
          const parsed = daily.map(ev => new CalendarEvent({
            id: String(ev.id),
            title: ev.title,
            location: ev.location,
            description: ev.description,
            start: parseToLocalDate(ev.startDate),
            end: parseToLocalDate(ev.endDate),
            isAllDay: false,
            createdBy: ev.createdBy || ev.userId
          }));
          setDisplayDate(new Date(clickedDate));
          setDisplayEvents(parsed);
          setShowDisplay(true);
        }
      } catch (err) {
        console.error('Error día:', err);
      }
      c.clearGridSelections();
    });

    c.render();
    setInst(c);
    fetchMonthlyEvents();
    updateTitle(c);
    return () => c.destroy();
  }, []);

  useEffect(() => {
    fetchMonthlyEvents();
  }, [inst]);

  const goPrev = () => inst && (inst.prev(), inst.render(), updateTitle(inst), fetchMonthlyEvents());
  const goNext = () => inst && (inst.next(), inst.render(), updateTitle(inst), fetchMonthlyEvents());
  const goToday = () => inst && (inst.today(), inst.render(), updateTitle(inst), fetchMonthlyEvents());

  const handleCloseDisplay = () => setShowDisplay(false);
  const handleCreateFromDisplay = date => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    setNuevoData({ start, end });
    setShowDisplay(false);
    setShowNuevo(true);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="calendar-page">
        <div className="calendar-wrapper">
          <div className="calendar-nav">
            <button onClick={goToday} className="today-btn">Today</button>
            <button onClick={goPrev} className="nav-btn">❮</button>
            <button onClick={goNext} className="nav-btn">❯</button>
            <span className="calendar-title">{currentDate}</span>
          </div>
          <div ref={calendarRef} className="calendar-body" />

          {showDisplay && (
            <DisplayEvents
              date={displayDate}
              events={displayEvents}
              onClose={handleCloseDisplay}
              onCreate={handleCreateFromDisplay}
            />
          )}

          {showNuevo && (
            <NuevoEvento
              start={nuevoData.start}
              end={nuevoData.end}
              onClose={() => {
                setShowNuevo(false);
                fetchMonthlyEvents();
              }}
            />
          )}

          {showEventDetails && selectedEvent && (
            <EventDetailsPopup
              event={selectedEvent}
              onClose={() => setShowEventDetails(false)}
              onEdit={(e) => {
                setShowEventDetails(false);
                setEditEventData(e);
                setShowEdit(true);
              }}
              currentUserId={userId}
              isAdmin={isAdmin}
            />
          )}

          {showEdit && editEventData && (
            <EditEvent
              event={editEventData}
              onClose={() => {
                setShowEdit(false);
                setEditEventData(null);
                fetchMonthlyEvents();
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
