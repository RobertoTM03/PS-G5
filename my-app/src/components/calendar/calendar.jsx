import React, { useEffect, useRef, useState } from 'react';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import NuevoEvento from './NuevoEvento.jsx';
import './calendar.css';

// -----------------------------
// 1. MODELO
// -----------------------------
class CalendarEvent {
  constructor({ id, calendarId, title, location, start, end, isAllDay }) {
    Object.assign(this, { id, calendarId, title, location, start, end, isAllDay });
  }
}

function fetchInitialEvents() {
  const now = new Date();
  return [
    new CalendarEvent({
      id: '1',
      calendarId: '1',
      title: 'Reunión de equipo',
      location: '',
      start: now.toISOString(),
      end: new Date(now.getTime() + 3600_000).toISOString(),
      isAllDay: false,
    }),
  ];
}

// -----------------------------
// 2. VIEWMODEL
// -----------------------------
function useCalendarViewModel() {
  const calendarRef = useRef(null);
  const [inst, setInst] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  // nuevo estado para controlar el popup propio
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoData, setNuevoData] = useState({ start: null, end: null });

  // formatea “YYYY.MM”
  const updateTitle = cal => {
    const d = cal.getDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    setCurrentDate(`${yyyy}.${mm}`);
  };

  useEffect(() => {
    if (!calendarRef.current || !window.tui?.Calendar) return;
    const Calendar = window.tui.Calendar;
    const c = new Calendar(calendarRef.current, {
      defaultView: 'month',
      // desactivamos popups nativos
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

    // 1) carga inicial
    c.createEvents(fetchInitialEvents());

    // 2) click en celda vacía → abrimos nuestro modal
    c.on('selectDateTime', info => {
      setNuevoData({ start: info.start, end: info.end });
      setShowNuevo(true);
      c.clearGridSelections();
    });

    // 3) click en evento existente → gratuito: podría abrir detalle propio
    // (omito para centrarnos en creación)

    c.render();
    setInst(c);
    updateTitle(c);

    return () => c.destroy();
  }, []);

  // llamadas de navegación
  const goPrev  = () => inst && (inst.prev(), inst.render(), updateTitle(inst));
  const goNext  = () => inst && (inst.next(), inst.render(), updateTitle(inst));
  const goToday = () => inst && (inst.today(), inst.render(), updateTitle(inst));

  // manejar guardado desde nuestro modal
  const handleSaveNuevo = ({ title, location, start, end, isAllDay }) => {
    const id = String(Date.now());
    inst.createEvents([{
      id,
      calendarId: '1',
      title,
      category: isAllDay ? 'allday' : 'time',
      start: start.toISOString(),
      end: end.toISOString(),
      location,
      isAllDay,
    }]);
    setShowNuevo(false);
  };

  const handleCloseNuevo = () => setShowNuevo(false);

  return {
    calendarRef,
    currentDate,
    goPrev,
    goNext,
    goToday,
    showNuevo,
    nuevoData,
    handleSaveNuevo,
    handleCloseNuevo,
  };
}

// -----------------------------
// 3. VISTA
// -----------------------------
function CalendarInner({
  calendarRef,
  currentDate,
  goPrev,
  goNext,
  goToday,
  showNuevo,
  nuevoData,
  handleSaveNuevo,
  handleCloseNuevo,
}) {
  return (
    <div className="calendar-wrapper">
      <div className="calendar-nav">
        <button onClick={goToday} className="today-btn">Today</button>
        <button onClick={goPrev} className="nav-btn">❮</button>
        <button onClick={goNext} className="nav-btn">❯</button>
        <span className="calendar-title">{currentDate}</span>
      </div>
      <div ref={calendarRef} className="calendar-body" />
      {showNuevo && (
        <NuevoEvento
          start={nuevoData.start}
          end={nuevoData.end}
          onSave={handleSaveNuevo}
          onClose={handleCloseNuevo}
        />
      )}
    </div>
  );
}

// -----------------------------
// 4. CONTAINER + LAYOUT
// -----------------------------
export default function CalendarPage() {
  const vm = useCalendarViewModel();
  return (
    <div className="page-container">
      <Header />
      <main className="calendar-page">
        <CalendarInner {...vm} />
      </main>
      <Footer />
    </div>
  );
}
