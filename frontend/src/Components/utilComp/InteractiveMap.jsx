import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when center changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
}

// MapClickHandler component to handle map interactions
function MapClickHandler({ onLocationChange }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      });
    },
  });
  return null;
}

const InteractiveMap = ({ latitude, longitude, onLocationChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([
    latitude ? parseFloat(latitude) : 0,
    longitude ? parseFloat(longitude) : 0
  ]);
  const [markerPosition, setMarkerPosition] = useState([
    latitude ? parseFloat(latitude) : 0,
    longitude ? parseFloat(longitude) : 0
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const mapRef = useRef(null);

  // Update map when props change
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      setMapCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  const handleLocationChange = (coords) => {
    if (onLocationChange) {
      const newLat = parseFloat(coords.latitude);
      const newLng = parseFloat(coords.longitude);
      
      setMarkerPosition([newLat, newLng]);
      setMapCenter([newLat, newLng]);
      
      // Make sure to call the parent component's callback with the updated coordinates
      onLocationChange({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1
        }
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newCoords = {
          latitude: parseFloat(lat).toFixed(6),
          longitude: parseFloat(lon).toFixed(6)
        };
        
        handleLocationChange(newCoords);
        setSearchQuery('');
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Error searching for location');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingCurrentLocation(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          };
          
          handleLocationChange(newCoords);
          setIsGettingCurrentLocation(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Could not get your current location: ' + err.message);
          setIsGettingCurrentLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsGettingCurrentLocation(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <form onSubmit={handleSearch} className="flex flex-1 space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for location..."
            className="flex-1 border border-blue-300 rounded-md p-2 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <button
          onClick={getCurrentLocation}
          className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 flex items-center justify-center"
          disabled={isGettingCurrentLocation}
        >
          {isGettingCurrentLocation ? 'Getting Location...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Location
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg overflow-hidden h-64 border border-blue-300">
        <MapContainer
          center={mapCenter}
          zoom={13}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} />
          <MapClickHandler onLocationChange={handleLocationChange} />
          <MapUpdater center={mapCenter} zoom={13} />
        </MapContainer>
      </div>

      <div className="mt-2 text-sm text-blue-700">
        <p>Click on the map to update location, use the search box, or use the "My Location" button.</p>
        <p className="font-medium mt-1">
          Current coordinates: {latitude || '0'}, {longitude || '0'}
        </p>
      </div>
    </div>
  );
};

export default InteractiveMap;