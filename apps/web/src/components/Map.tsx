import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Leaflet requires a default icon which you need to import separately
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import { TLocation } from '@/types/addressType';

// Fix for missing marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerIconShadow.src,
});
L.Marker.prototype.options.icon = DefaultIcon;

// const defaultPosition = { lat: 51.505, lng: -0.09 }; // Default to London

// A component to handle map clicks and update the marker position
function LocationMarker({ defaultPosition }: { defaultPosition: TLocation }) {
  const [position, setPosition] = useState(defaultPosition);

  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Update marker position when map is clicked
    },
  });

  return (
    <>
      <Marker position={position} draggable />
    </>
  );
}

const Map = ({ defaultPosition }: { defaultPosition: TLocation }) => {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker defaultPosition={defaultPosition} />
    </MapContainer>
  );
};

export default Map;
