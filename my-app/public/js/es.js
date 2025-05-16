(function waitForCalendar(langData) {
    const tryApplyLanguage = () => {
      const Calendar = window.tui?.Calendar;
  
      if (Calendar && typeof Calendar.setMessages === 'function') {
        Calendar.setMessages('es', langData);
        console.log('✅ Idioma español cargado en TUI Calendar');
      } else {
        // Intentar de nuevo después de un pequeño retraso
        setTimeout(tryApplyLanguage, 100);
      }
    };
  
    tryApplyLanguage();
  })({
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    today: 'Hoy',
    weekTitle: 'Semana',
    task: 'Tarea',
    milestone: 'Hito',
    allday: 'Todo el día',
    time: 'Hora',
    event: 'Evento',
    showMore: function(more) {
      return '+' + more + ' más';
    }
  });
  