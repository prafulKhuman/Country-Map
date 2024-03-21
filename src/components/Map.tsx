import "leaflet/dist/leaflet.css";
import type { Place } from "../api/Place";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef , useState} from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

interface MapProps {
  place: Place | null;
}

export default function Map({ place }: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
            }
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (mapRef.current && place) {
      mapRef.current.flyTo([place.latitude, place.longitude]);
    }
  }, [place]);

  return (
    <MapContainer
      ref={mapRef}
      center={[latitude , longitude ]}
      zoom={12}
      scrollWheelZoom
      className="h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {place && <Marker position={[place.latitude, place.longitude]} />}
    </MapContainer>
  );
}
