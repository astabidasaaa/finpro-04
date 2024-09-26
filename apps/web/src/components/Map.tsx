
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DragEndEvent } from 'leaflet';
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

function LocationMarker({
  latestLocation,
  setLatestLocation,
}: {
  latestLocation: TLocation;
  setLatestLocation: React.Dispatch<React.SetStateAction<TLocation>>;
}) {
  useMapEvents({
    click(e) {
      setLatestLocation(e.latlng);
    },
  });

  const handleMarkerDragEnd = (e: DragEndEvent) => {
    const newLatLng = e.target.getLatLng();
    setLatestLocation({ lat: newLatLng.lat, lng: newLatLng.lng });
  };

  return (
    <>
      <Marker
        icon={customIcon}
        position={latestLocation}
        eventHandlers={{
          dragend: handleMarkerDragEnd,
        }}
        draggable
      />
    </>
  );
}

const Map = ({
  latestLocation,
  setLatestLocation,
}: {
  latestLocation: TLocation;
  setLatestLocation: React.Dispatch<React.SetStateAction<TLocation>>;
}) => {
  return (
    <MapContainer
      center={latestLocation}
      zoom={14}
      className="w-full h-80 lg:h-96"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker
        latestLocation={latestLocation}
        setLatestLocation={setLatestLocation}
      />
    </MapContainer>
  );
};

export default Map;
