import React, { useEffect, useState, useRef } from 'react';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import './calendar.css'; // Importa el archivo CSS aquí

// -----------------------------
// 1. MODELO
// -----------------------------
class CalendarEvent {
  constructor({ id, calendarId, title, category, start, end }) {
    this.id = id;
    this.calendarId = calendarId;
    this.title = title;
    this.category = category;
    this.start = start;
    this.end = end;
  }
}

function fetchInitialEvents() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  return [
    new CalendarEvent({
      id: '1',
      calendarId: '1',
      title: 'Reunión de equipo',
      category: 'time',
      start: now.toISOString(),
      end: oneHourLater.toISOString(),
    }),
  ];
}

// -----------------------------
// 2. VIEWMODEL
// -----------------------------
function useCalendarViewModel() {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const updateCurrentDate = (cal) => {
    const d = cal.getDate();
    const month = d.toLocaleString('es-ES', { month: 'long' });
    const year = d.getFullYear();
    setCurrentDate(`${capitalize(month)} ${year}`);
  };

  const initCalendar = (CalendarLib) => {
    const container = calendarRef.current;
    if (!container) return;

    const cal = new CalendarLib(container, {
      defaultView: 'month',
      useCreationPopup: true,
      useDetailPopup: true,
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

    cal.createEvents(fetchInitialEvents());
    cal.render();
    setCalendar(cal);
    updateCurrentDate(cal);
  };

  useEffect(() => {
    let isMounted = true;

    const loadCSS = () =>
      new Promise((resolve, reject) => {
        if (document.querySelector('link[href*="toastui-calendar.min.css"]')) {
          resolve();
          return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://uicdn.toast.com/calendar/latest/toastui-calendar.min.css';
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('No se pudo cargar CSS de Calendar'));
        document.head.appendChild(link);
      });

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="toastui-calendar.min.js"]')) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://uicdn.toast.com/calendar/latest/toastui-calendar.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar JS de Calendar'));
        document.body.appendChild(script);
      });

    loadCSS()
      .then(() => loadScript())
      .then(() => {
        const waitForLib = setInterval(() => {
          if (window.tui?.Calendar && isMounted) {
            clearInterval(waitForLib);
            initCalendar(window.tui.Calendar);
          }
        }, 100);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
      if (calendar) calendar.destroy();
      document.querySelectorAll('script[src*="toastui-calendar"]').forEach(s => s.remove());
      document.querySelectorAll('link[href*="toastui-calendar"]').forEach(l => l.remove());
    };
  }, [calendar]);

  const goToPrev = () => {
    if (!calendar) return;
    calendar.prev();
    calendar.render();
    updateCurrentDate(calendar);
  };

  const goToNext = () => {
    if (!calendar) return;
    calendar.next();
    calendar.render();
    updateCurrentDate(calendar);
  };

  const goToToday = () => {
    if (!calendar) return;
    calendar.today();
    updateCurrentDate(calendar);
  };

  return { calendarRef, currentDate, goToPrev, goToNext, goToToday };
}

// -----------------------------
// 3. VISTA
// -----------------------------
function CalendarView({ calendarRef, currentDate, goToPrev, goToNext, goToToday }) {
  return (
    <div className="calendar-wrapper">
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button onClick={goToPrev} className="button-style">❮</button>
          <strong style={{ margin: '0 1rem', fontSize: '1.2rem' }}>{currentDate}</strong>
          <button onClick={goToNext} className="button-style">❯</button>
          <button onClick={goToToday} className="button-style">Hoy</button>
        </div>

        <div
          id="calendar"
          ref={calendarRef}
          style={{
            height: '700px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '1px solid #ccc',
            overflow: 'hidden',
          }}
        />
      </div>
    </div>
  );
}

// -----------------------------
// 4. CONTENEDOR
// -----------------------------
export default function MyCalendar() {
  const vm = useCalendarViewModel();

  return (
    <>
      <Header />
      <CalendarView {...vm} />
      <Footer />
    </>
  );
}
