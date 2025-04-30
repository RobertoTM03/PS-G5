import React, { useEffect, useRef, useState } from 'react';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import NuevoEvento from './NuevoEvento.jsx';
import DisplayEvents from './displayEvents.jsx';
import EventDetailsPopup from './EventDetailsPopup.jsx';
import './calendar.css';

// -----------------------------
// 1. MODELO
// -----------------------------
class CalendarEvent {
  constructor({ id, title, location, description, start, end, isAllDay }) {
    Object.assign(this, { id, title, location, description, start, end, isAllDay });
  }
}

// Genera algunos eventos iniciales
function getInitialEvents() {
  const now = new Date();
  return [
    new CalendarEvent({
      id: '1',
      title: 'Reunión de equipo',
      location: 'Sala A',
      description: 'Revisión semanal de avances',
      start: now.toISOString(),
      end: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      isAllDay: false,
    }),
    new CalendarEvent({
      id: '2',
      title: 'Lunch con Juan',
      location: 'Cafetería',
      description: '',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString(),
      isAllDay: false,
    }),
    new CalendarEvent({
      id: '3',
      title: 'Workshop',
      location: 'Auditorio',
      description: 'Taller de React avanzado',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 30).toISOString(),
      isAllDay: false,
    }),
  ];
}

// -----------------------------
// 2. PÁGINA / VIEWMODEL
// -----------------------------
export default function CalendarPage() {
  const calendarRef = useRef(null);
  const [inst, setInst] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  // eventos en estado, para pasarlos a DisplayEvents
  const [events, setEvents] = useState(getInitialEvents());

  // para DisplayEvents
  const [showDisplay, setShowDisplay] = useState(false);
  const [displayDate, setDisplayDate] = useState(null);
  const [displayEvents, setDisplayEvents] = useState([]);

  // para NuevoEvento
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoData, setNuevoData] = useState({ start: null, end: null });

  // para EventDetailsPopup
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // formatea el título "YYYY.MM"
  const updateTitle = calendarInst => {
    const d = calendarInst.getDate();
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    setCurrentDate(`${yy}.${mm}`);
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
      calendars: [
        {
          id: '1',
          name: 'Eventos',
          color: '#ffffff',
          bgColor: '#047bfe',
          dragBgColor: '#047bfe',
          borderColor: '#047bfe',
        },
      ],
    });

    // 1) Pintamos los eventos iniciales
    c.createEvents(
      events.map(ev => ({
        id: ev.id,
        calendarId: '1',
        title: ev.title,
        category: ev.isAllDay ? 'allday' : 'time',
        start: ev.start,
        end: ev.end,
        location: ev.location,
        isAllDay: ev.isAllDay,
      }))
    );

    // 2) Al hacer clic en una celda (día) del mes, mostramos los eventos de ese día
    c.on('selectDateTime', info => {
      const clickedDate = info.start;
      const eventsForDay = events.filter(event => new Date(event.start).toDateString() === clickedDate.toDateString());
      
      setDisplayDate(clickedDate);
      setDisplayEvents(eventsForDay);
      setShowDisplay(true);
      c.clearGridSelections();
    });

    // 3) Al hacer clic en un evento específico, mostramos los detalles de ese evento
    c.on('clickEvent', (info) => {
      const clickedEvent = info.event;
      
      // Buscar el evento seleccionado por su ID
      const selectedEvent = events.find(event => event.id === clickedEvent.id);

      if (selectedEvent) {
        setSelectedEvent(selectedEvent);
        setShowEventDetails(true); 
      } else {
        console.error('Evento no encontrado');
      }
    });

    c.render();
    setInst(c);
    updateTitle(c);

    return () => c.destroy();
  }, [events]);

  // controles de navegación
  const goPrev = () => inst && (inst.prev(), inst.render(), updateTitle(inst));
  const goNext = () => inst && (inst.next(), inst.render(), updateTitle(inst));
  const goToday = () => inst && (inst.today(), inst.render(), updateTitle(inst));

  // cierra el popup de DisplayEvents
  const handleCloseDisplay = () => setShowDisplay(false);

  // crea un nuevo evento desde DisplayEvents
  const handleCreateFromDisplay = date => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    setNuevoData({ start, end });
    setShowDisplay(false);
    setShowNuevo(true);
  };

  // guardar el NuevoEvento
  const handleSaveNuevo = ({ title, location, description, start, end, isAllDay }) => {
    const id = String(Date.now());
    const newEv = new CalendarEvent({
      id, title, location, description,
      start: start.toISOString(),
      end: end.toISOString(),
      isAllDay
    });

    // 1) lo añadimos al estado de React
    setEvents(prev => [...prev, newEv]);

    // 2) y al calendario TUI
    if (inst) {
      inst.createEvents([{
        id,
        calendarId: '1',
        title,
        category: isAllDay ? 'allday' : 'time',
        start: newEv.start,
        end: newEv.end,
        location,
        isAllDay,
      }]);
    }

    setShowNuevo(false);
  };

  const handleCloseNuevo = () => setShowNuevo(false);
  const handleCloseEventDetails = () => setShowEventDetails(false);  // Cerrar el popup de detalles del evento

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
              onSave={handleSaveNuevo}
              onClose={handleCloseNuevo}
            />
          )}

          {showEventDetails && (
            <EventDetailsPopup
              event={selectedEvent}
              onClose={handleCloseEventDetails}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
