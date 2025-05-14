import React, { useEffect, useState } from 'react';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import './map.css';

export default function MapPage() {
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
    } else {
      const scriptLeafletCss = document.createElement('link');
      scriptLeafletCss.rel = 'stylesheet';
      scriptLeafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      scriptLeafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      scriptLeafletCss.crossOrigin = '';
      document.head.appendChild(scriptLeafletCss);

      const scriptLeafletJs = document.createElement('script');
      scriptLeafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      scriptLeafletJs.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      scriptLeafletJs.crossOrigin = '';
      scriptLeafletJs.onload = () => setLeafletLoaded(true);
      document.body.appendChild(scriptLeafletJs);
    }
  }, []);

  useEffect(() => {
    if (leafletLoaded && window.L) {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
    }
  }, [leafletLoaded]);

  return (
    <div className="page-container">
      <Header />
      <div className="main-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div className="map-container" style={{ width: '70%', height: '700px', marginRight: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div id="map" style={{ height: '100%', width: '100%' }}></div>
        </div>
        <div className="activity-table" style={{ width: '35%', backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h3>Puntos de interés</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', backgroundColor: '#007bff', color: 'white' }}>Actividad</th>
                <th style={{ padding: '12px', backgroundColor: '#007bff', color: 'white' }}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px' }}>Actividad 1</td>
                <td style={{ padding: '12px' }}>Descripción de la actividad 1</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Actividad 2</td>
                <td style={{ padding: '12px' }}>Descripción de la actividad 2</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Actividad 3</td>
                <td style={{ padding: '12px' }}>Descripción de la actividad 3</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Actividad 4</td>
                <td style={{ padding: '12px' }}>Descripción de la actividad 4</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Actividad 5</td>
                <td style={{ padding: '12px' }}>Descripción de la actividad 5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
