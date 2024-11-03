import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { GoogleMap, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { SketchPicker } from 'react-color';
import './Axe_confondu.css';

import { Link } from 'react-router-dom';


const Axe_confondu = () => {
    const containerStyle = {
        width: '100%',
        height: '750px',
    };

    const [axes, setAxes] = useState([]);
    const [selectedAxes, setSelectedAxes] = useState([]); // Les axes sélectionnés
    const [directionsResponses, setDirectionsResponses] = useState({}); // Les directions pour chaque axe
    const [axesColors, setAxesColors] = useState({}); // Stocker les couleurs pour chaque axe

    // Charger l'API Google Maps avec clé API
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDSTx_ulue6C_xCIUUsgGMcdgIEtQFh1GM',
        libraries: ['places'],
    });

    useEffect(() => {
        const fetchAxes = async () => {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await axios.get(`${baseURL}/api/axe/liste`);
                setAxes(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des axes :', error);
            }
        };
        fetchAxes();
    }, []);

    const fetchDirections = async (axeId) => {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await axios.get(`${baseURL}/api/map/liste_ramassage/${axeId}`);
            const details = response.data.details;

            const origin = `${details[0].district} ${details[0].fokontany} ${details[0].lieu}`;
            const destination = "Ivato Airport"; // Terminus de parcours

            // Ajoute tous les lieux intermédiaires comme étapes
            const waypoints = details.slice(1).map(location => ({
                location: `${location.district} ${location.fokontany} ${location.lieu}`,
                stopover: true
            }));

            // Convertir les adresses en coordonnées GPS avec DirectionsService
            const directionsService = new window.google.maps.DirectionsService();
            const result = await directionsService.route({
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            });

            setDirectionsResponses((prevState) => ({
                ...prevState,
                [axeId]: result.routes[0].overview_path.map(point => ({
                    lat: point.lat(),
                    lng: point.lng(),
                })),
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des directions :', error);
        }
    };

    const handleAxesChange = (selectedOptions) => {
        setSelectedAxes(selectedOptions);
        selectedOptions.forEach(option => {
            if (!directionsResponses[option.value]) {
                fetchDirections(option.value);
            }
        });
    };

    const handleColorChange = (axeId, color) => {
        setAxesColors((prevColors) => ({
            ...prevColors,
            [axeId]: color.hex,
        }));
    };

    if (loadError) {
        return <div>Erreur de chargement de la carte.</div>;
    }

    return isLoaded ? (
        <div>
            <Link to="/map/ramassage" style={{ textDecoration: 'none'}}>
                    précédent
                </Link>
        <div className="axe-confondu-container">
             
            <div className="axe-selection-panel">
                <Select
                    isMulti
                    value={selectedAxes}
                    onChange={handleAxesChange}
                    options={axes.map(axe => ({ value: axe.id, label: axe.axe }))}
                    placeholder="Sélectionner des axes"
                />
                
                <div className="color-picker-container">
                    {selectedAxes.map((axe) => (
                        <div key={axe.value} className="color-picker">
                            <h4>{axe.label}</h4>
                            <SketchPicker
                                color={axesColors[axe.value] || '#000000'} // Couleur par défaut noire
                                onChange={(color) => handleColorChange(axe.value, color)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="map-container">
                <GoogleMap mapContainerStyle={containerStyle} center={{ lat: -18.8792, lng: 47.5079 }} zoom={12}>
                    {selectedAxes.map((axe) => {
                        const path = directionsResponses[axe.value];
                        const color = axesColors[axe.value] || '#000000';

                        return (
                            path && (
                                <Polyline
                                    key={axe.value}
                                    path={path}
                                    options={{
                                        strokeColor: color,
                                        strokeOpacity: 1.0,
                                        strokeWeight: 4,
                                    }}
                                />
                            )
                        );
                    })}
                </GoogleMap>
            </div>
        </div>
        </div>

    ) : <div>Chargement...</div>;
};

export default Axe_confondu;
