import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './nuevoEvento.css';

export default function EditEvent({ event, onClose }) {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);

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

  const toUTCISOStringPreservingLocalTime = datetimeStr => {
    const localDate = new Date(datetimeStr);
    const timezoneOffset = localDate.getTimezoneOffset();
    const correctedDate = new Date(localDate.getTime() - timezoneOffset * 60000);
    return correctedDate.toISOString();
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setLocation(event.location || '');
      setDescription(event.description || '');
      setIsAllDay(event.isAllDay || false);
      setFechaInicio(formatLocalIso(event.start));
      setFechaFin(formatLocalIso(event.end));
    }
  }, [event]);

  const handleSubmit = async () => {
    if (!title || !fechaInicio || !fechaFin) {
      alert("Título, fecha inicio y fecha fin son obligatorios.");
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin <= inicio) {
      alert("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }


    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        description,
        location,
        startDate: toUTCISOStringPreservingLocalTime(fechaInicio),
        endDate: toUTCISOStringPreservingLocalTime(fechaFin),
        isAllDay
      };

      const response = await fetch(`http://localhost:3000/groups/${id}/activities/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al editar el evento');
      }

      window.location.reload(); 
    } catch (err) {
      console.error('Error al editar evento:', err.message || err);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  return (
    <div className="ne-backdrop" onClick={onClose}>
      <div className="ne-modal" onClick={e => e.stopPropagation()}>
        <button className="ne-close" onClick={onClose}>×</button>

        <label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>

        <label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </label>

        <label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </label>

        <label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </label>

        <label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </label>

        <button className="ne-save" onClick={handleSubmit}>Guardar cambios</button>
      </div>
    </div>
  );
}
