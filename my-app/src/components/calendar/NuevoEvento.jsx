// NuevoEvento.jsx
import React, { useState, useEffect } from 'react';
import './nuevoEvento.css';

export default function NuevoEvento({ start, end, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');  // <-- estado para descripción
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);

  // formatea un Date a "YYYY-MM-DDTHH:mm" en zona local
  const formatLocalIso = date => {
    const dt = new Date(date);
    const pad = n => String(n).padStart(2, '0');
    return (
      dt.getFullYear() +
      '-' + pad(dt.getMonth() + 1) +
      '-' + pad(dt.getDate()) +
      'T' + pad(dt.getHours()) +
      ':' + pad(dt.getMinutes())
    );
  };

  useEffect(() => {
    if (start) setFechaInicio(formatLocalIso(start));
    if (end)   setFechaFin  (formatLocalIso(end));
  }, [start, end]);

  const handleSubmit = () => {
    onSave({
      title,
      location,
      description,           // <-- añadimos descripción al payload
      start: new Date(fechaInicio),
      end:   new Date(fechaFin),
      isAllDay
    });
  };

  return (
    <div className="ne-backdrop" onClick={onClose}>
      <div className="ne-modal" onClick={e => e.stopPropagation()}>
        <button className="ne-close" onClick={onClose}>×</button>
        <h3>Nuevo Evento</h3>
        <label>
          Título*
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Escribe el asunto"
          />
        </label>
        <label>
          Ubicación (Opcional)
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Escribe la ubicación"
          />
        </label>
        <label>
          Descripción (Opcional)
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe el evento"
            rows={4}
          />
        </label>
        <label>
          Fecha inicio*
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Fecha fin*
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </label>
        <label className="ne-checkbox">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={e => setIsAllDay(e.target.checked)}
          />
          Día completo
        </label>
        <button className="ne-save" onClick={handleSubmit}>Guardar</button>
      </div>
    </div>
  );
}
