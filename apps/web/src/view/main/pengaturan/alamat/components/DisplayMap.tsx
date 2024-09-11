import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import { TLocation } from '@/types/addressType';

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerIconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ latestLocation }: { latestLocation: TLocation }) {
  return (
    <>
      <Marker icon={customIcon} position={latestLocation} />
    </>
  );
}

const DisplayMap = ({ latestLocation }: { latestLocation: TLocation }) => {
  return (
    <MapContainer
      center={latestLocation}
      zoom={14}
      scrollWheelZoom={false}
      dragging={false}
      className="relative w-full h-24 lg:h-32 !z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker latestLocation={latestLocation} />
    </MapContainer>
  );
};

export default DisplayMap;
