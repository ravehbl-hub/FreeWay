// LocationsMap: a real map (Leaflet + OpenStreetMap tiles) with a marker for every pickup location.
// The selected location is drawn bigger and the map flies to it.
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PICKUP_PLACES } from '../../utils/pickupLocations.js';

const GREEN = '#1e8e5a';

export default function LocationsMap({ selected, onSelect }) {
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Create the map once
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(boxRef.current, { scrollWheelZoom: false }).setView([31.9, 34.9], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    PICKUP_PLACES.forEach((place) => {
      const marker = L.circleMarker([place.lat, place.lng], {
        radius: 8, color: '#ffffff', weight: 2, fillColor: GREEN, fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(place.name);
      marker.on('click', () => onSelect(place.name));
      markersRef.current[place.name] = marker;
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Highlight the selected location
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.keys(markersRef.current).forEach((name) => {
      markersRef.current[name].setStyle({ radius: name === selected ? 12 : 8 });
    });
    const place = PICKUP_PLACES.find((p) => p.name === selected);
    if (place) map.flyTo([place.lat, place.lng], 11, { duration: 0.8 });
  }, [selected]);

  return <div ref={boxRef} className="locations-map" />;
}
