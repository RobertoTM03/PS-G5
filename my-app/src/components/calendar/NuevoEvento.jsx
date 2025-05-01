import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './nuevoEvento.css';

export default function NuevoEvento({ start, end, onClose }) {
  const { id } = useParams(); // groupId
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
    if (start) setFechaInicio(formatLocalIso(start));
    if (end)   setFechaFin(formatLocalIso(end));
  }, [start, end]);

  const handleSubmit = async () => {
    if (!title || !fechaInicio || !fechaFin) {
      alert("Título, fecha inicio y fecha fin son obligatorios.");
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

      const response = await fetch(`http://localhost:3000/groups/${id}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al crear el evento');
      }

      window.location.reload(); 
    } catch (err) {
      console.error('Error al crear evento:', err.message || err);
      alert('Hubo un error al guardar el evento.');
    }
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
