import React, { useState } from 'react';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import {
  CButton,
  CContainer,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CToaster,
  CToast,
  CToastBody,
} from '@coreui/react';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const Correction = () => {
  const containerStyle = {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    width: '100%',
    height: '750px',
  };

  const [url, setUrl] = useState('');
  const [directions, setDirections] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDSTx_ulue6C_xCIUUsgGMcdgIEtQFh1GM', // Remplace par ta clé API
    libraries: ['places'],
  });

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const extractWaypointsFromUrl = (url) => {
    const regex = /\/dir\/([^?]+)/;
    const matches = url.match(regex);

    if (matches && matches[1]) {
      return matches[1].split('/').map((point) => decodeURIComponent(point.replace(/\+/g, ' ')));
    }
    return [];
  };

  const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(`Geocoding failed for address: ${address}`);
        }
      });
    });
  };

  const fetchDirections = async () => {
    try {
      const waypointsArray = extractWaypointsFromUrl(url);
      if (waypointsArray.length < 2) {
        setError("L'URL doit contenir au moins un point de départ et un point d'arrivée.");
        return;
      }

      const validatedWaypoints = [];
      for (let address of waypointsArray) {
        try {
          const location = await geocodeAddress(address);
          validatedWaypoints.push(location);
        } catch (e) {
          setError(`Erreur de géocodage pour l'adresse : ${address}`);
          console.error(e);
          return;
        }
      }

      setWaypoints(waypointsArray);
      setError('');

      const directionsService = new window.google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: validatedWaypoints[0],
        destination: validatedWaypoints[validatedWaypoints.length - 1],
        waypoints: validatedWaypoints.slice(1, -1).map((location) => ({ location, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirections(result);

      const totalDistance = result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000;
      const totalDuration = result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60;
      setDistance(totalDistance);
      setDuration(totalDuration);
    } catch (error) {
      console.error('Erreur lors de la récupération des directions :', error);
      setError("Erreur lors de la récupération des directions. Veuillez vérifier les adresses.");
    }
  };

  if (!isLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <CContainer style={containerStyle}>
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <Link to="/map/ramassage" style={{ textDecoration: 'none' }}>
            <CNavLink>
              Ramassage
            </CNavLink>
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/map/confondu" style={{ textDecoration: 'none' }}>
            <CNavLink>
              Tout Axe
            </CNavLink>
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/map/correction" style={{ textDecoration: 'none' }}>
            <CNavLink active>
              Correcteur de Parcours
            </CNavLink>
          </Link>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#" disabled>
            Navigation
          </CNavLink>
        </CNavItem>
      </CNav>

      <div>
        <h1>Visualisation des Points de l'Itinéraire</h1>
        <CFormInput
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Collez ici l'URL Google Maps"
          style={{ width: '80%', marginBottom: '20px' }}
        />
        <CButton color="primary" onClick={fetchDirections}>Afficher l'itinéraire</CButton>

        {error && (
          <CToaster position="top-right">
            <CToast autohide={true} visible={true} color="danger">
              <CToastBody>{error}</CToastBody>
            </CToast>
          </CToaster>
        )}

        <div style={{ marginTop: '20px' }}>
          {directions && (
            <GoogleMap mapContainerStyle={containerStyle} center={{ lat: -18.8792, lng: 47.5079 }} zoom={12}>
              <DirectionsRenderer directions={directions} />
            </GoogleMap>
          )}
        </div>

        {distance && duration && (
          <div>
            <p>Nombre de points : {waypoints.length}</p>
            <p>Distance totale : {distance} km</p>
            <p>Durée totale : {duration} minutes</p>
          </div>
        )}
      </div>
    </CContainer>
  );
};

export default Correction;
