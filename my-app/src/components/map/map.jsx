import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import './map.css';

export default function MapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [geocoderLoaded, setGeocoderLoaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
    } else {
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);

      const leafletJs = document.createElement('script');
      leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJs.onload = () => setLeafletLoaded(true);
      document.body.appendChild(leafletJs);
    }
  }, []);

  useEffect(() => {
    if (leafletLoaded && !geocoderLoaded) {
      const geocoderCss = document.createElement('link');
      geocoderCss.rel = 'stylesheet';
      geocoderCss.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
      document.head.appendChild(geocoderCss);

      const geocoderJs = document.createElement('script');
      geocoderJs.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
      geocoderJs.onload = () => setGeocoderLoaded(true);
      document.body.appendChild(geocoderJs);
    }
  }, [leafletLoaded, geocoderLoaded]);

  const focusOnLocation = (locationId) => {
    const marker = markersRef.current.find(
      (m) => String(m.locationId) === String(locationId)
    );
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), 14);
      marker.openPopup();
    }
  };

  useEffect(() => {
    if (!token) return;

    if (leafletLoaded && geocoderLoaded && window.L && window.L.Control && window.L.Control.Geocoder) {
      const L = window.L;

      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([41, -3], 4);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);
      }

      const fetchLocations = () => {
        fetch(`http://localhost:3000/groups/${id}/map`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(async (res) => {
            if (!res.ok) {
              if (res.status === 404) {
                setLocations([]);
                return;
              }
              let errorMsg = `Error HTTP ${res.status}: ${res.statusText}`;
              try {
                const errorData = await res.json();
                if (errorData.message) errorMsg += ` - ${errorData.message}`;
              } catch {}
              throw new Error(errorMsg);
            }
            return res.json();
          })
          .then((data) => {
            const validLocations = (data || []).filter(
              (loc) => typeof loc.latitude === 'number' && typeof loc.longitude === 'number'
            );

            setLocations(validLocations);

            markersRef.current.forEach((m) => mapRef.current.removeLayer(m));
            markersRef.current = [];

            validLocations.forEach((loc) => {
              const latlng = [loc.latitude, loc.longitude];
              const marker = L.marker(latlng).addTo(mapRef.current);
              marker.bindPopup(`
                <div class="simple-popup">
                  📍 ${loc.title}
                </div>
              `);
              marker.locationId = String(loc.id);
              markersRef.current.push(marker);
            });
          })
          .catch((error) => {
            console.error('Fetch GET error:', error);
            alert('Error cargando ubicaciones: ' + error.message);
          });
      };

      fetchLocations();

      const control = L.Control.geocoder({
        defaultMarkGeocode: false,
      }).addTo(mapRef.current);

      setTimeout(() => {
        const mapContainer = document.querySelector('.map-container');
        const geocoderEl = document.querySelector('.leaflet-control-geocoder');

        if (mapContainer && geocoderEl) {
          mapContainer.appendChild(geocoderEl);
          geocoderEl.classList.add('custom-geocoder');
        }
      }, 500);

      control.on('markgeocode', function (e) {
        if (!e.geocode) {
          alert('Error: no se recibió información de geocodificación');
          return;
        }

        const center = e.geocode.center;
        const name = e.geocode.name || 'Ubicación encontrada';
        const description = e.geocode.html || '';

        const marker = L.marker(center).addTo(mapRef.current);

        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div class="custom-popup-content">
            <div class="location-name">${name}</div>
            <div class="location-address">${description}</div>
            <label>Nombre del sitio:</label>
            <input id="siteNameInput" type="text" value="${name}" placeholder="Escribe un nombre"/>
            <button id="saveSiteBtn">Guardar</button>
            <div id="saveMsg"></div>
          </div>
        `;

        marker.bindPopup(popupContent).openPopup();

        popupContent.querySelector('#saveSiteBtn').onclick = () => {
          const title = popupContent.querySelector('#siteNameInput').value.trim();
          const saveMsg = popupContent.querySelector('#saveMsg');

          if (!title) {
            saveMsg.textContent = 'Por favor escribe un nombre.';
            saveMsg.style.color = 'red';
            return;
          }

          saveMsg.textContent = 'Guardando...';
          saveMsg.style.color = 'black';

          fetch(`http://localhost:3000/groups/${id}/map`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              location: [center.lat, center.lng],
            }),
          })
            .then(async (res) => {
              if (!res.ok) {
                let errorMsg = `Error HTTP ${res.status}: ${res.statusText}`;
                try {
                  const errorData = await res.json();
                  if (errorData.message) errorMsg += ` - ${errorData.message}`;
                } catch {}
                throw new Error(errorMsg);
              }
              return res.json();
            })
            .then(() => {
              saveMsg.textContent = 'Guardado correctamente.';
              saveMsg.style.color = 'green';
              marker.closePopup();
              marker.remove();
              fetchLocations();
            })
            .catch((error) => {
              console.error('Fetch POST error:', error);
              saveMsg.textContent = 'Error al guardar. Intenta de nuevo.';
              saveMsg.style.color = 'red';
              alert('Error guardando ubicación: ' + error.message);
            });
        };
      });
    }
  }, [leafletLoaded, geocoderLoaded, id, token]);

  const deleteLocation = (locationId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) return;

    fetch(`http://localhost:3000/groups/${id}/map/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          let errorMsg = `Error HTTP ${res.status}: ${res.statusText}`;
          try {
            const errorData = await res.json();
            if (errorData.message) errorMsg += ` - ${errorData.message}`;
          } catch {}
          throw new Error(errorMsg);
        }
        return res.json();
      })
      .then(() => {
        setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
        window.location.reload();
      })
      .catch((error) => {
        console.error('Fetch DELETE error:', error);
        alert('Error eliminando la ubicación: ' + error.message);
      });
  };

  return (
    <div className="page-container">
      <Header />
      <div className="map-header-bar">
        <div className="arrow" onClick={() => navigate(`/GroupAdminView/${id}`)}>←</div>
        <h2 className="map-title-text">Mapa</h2>
      </div>
      <div className="main-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div
          className="map-container"
          style={{
            width: '90%',
            height: '450px',
            marginRight: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <div id="map" style={{ height: '100%', width: '100%' }}></div>
        </div>
        <div
          className="activity-table"
          style={{
            width: '35%',
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            maxHeight: '700px',
          }}
        >
          <h3>Puntos de interés</h3>
          {locations.length === 0 ? (
            <p className="empty-message">No hay ubicaciones guardadas</p>
          ) : (
            <ul className="location-list">
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  className="location-item"
                  onClick={() => focusOnLocation(loc.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="location-title">{loc.title}</span>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLocation(loc.id);
                    }}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
