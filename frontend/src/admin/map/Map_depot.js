import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton,
    CContainer,
    COffcanvasTitle,
    COffcanvas,
    COffcanvasBody,
    COffcanvasHeader,
    CCloseButton,
    CRow,
    CCol,
    CNav,
    CNavItem,
    CNavLink,
    CTable, 
    CTableHead, 
    CTableBody, 
    CTableRow, 
    CTableHeaderCell,
    CTableDataCell,
    CPopover,
    CTooltip,
} from '@coreui/react';
import Select from 'react-select';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

import { Link } from 'react-router-dom';



const Map_depot = () => {
    const containerStyle = {
        backgroundColor: '#FFFFFF',
        padding: '20px',
        width: '100%',
        height: '750px',
    };

    //style popover
    const customPopoverStyle = {
        '--cui-popover-max-width': '200px',
        '--cui-popover-border-color': 'var(--cui-primary)',
        '--cui-popover-header-bg': 'var(--cui-primary)',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
        }

    const [axes, setAxes] = useState([]);
    const [selectedAxe, setSelectedAxe] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [visibleToggle, setVisibleToggle] = useState(false);

    const [totalDistance, setTotalDistance] = useState('');
    const [totalDuration, setTotalDuration] = useState('');

    const [mapPoints, setMapPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const [nbrePassagers, setNbrePassagers] = useState(null);
    const [nbrePoints, setNbrePoints] = useState(null);

    const [matriculeUsagers, setMatriculeUsagers] = useState('');
    const [nomUsagers, setNomUsagers] = useState('');

    //consommation 
    const [litres, setLitres] = useState(14);
    const [kilometers, setKilometers] = useState(100);
    const [prixEssence, setPrixEssence] = useState(4900);
    const [consommation, setConsommation] = useState(0);
    const [prixTotal, setPrixTotal] = useState(0);

    const calculerConsommation = () => {
        // Vérifier que totalDistance est bien défini et est un nombre
        const distanceKm = parseFloat(totalDistance) / 1000; // Convertir la distance totale en kilomètres
    
        if (!isNaN(distanceKm) && distanceKm > 0 && litres > 0 && kilometers > 0 && prixEssence > 0) {
            // Calcul de l'essence pour le trajet
            const totalEssence = (distanceKm * litres) / kilometers;
    
            // Calcul du prix total
            const totalPrix = totalEssence * prixEssence;
    
            setConsommation(totalEssence.toFixed(2)); // Fixer à 2 décimales
            setPrixTotal(totalPrix.toFixed(2)); // Fixer à 2 décimales
        } else {
            setConsommation('0');
            setPrixTotal('0');
        }
    };
    
    
    // Recalculer automatiquement quand les valeurs changent
    useEffect(() => {
        calculerConsommation();
    }, [litres, kilometers, prixEssence, totalDistance]);

    // Charger l'API Google Maps avec clé API
    const { isLoaded } = useJsApiLoader({
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

    const handleAxeChange = (selectedOption) => {
        setSelectedAxe(selectedOption);
        fetchDirections(selectedOption.value);
    };


    const adjustMarkerPosition = (point, index) => {
        const offset = 0.1 * index; // Un décalage très léger pour les lei identiques
        return {
            latitude: parseFloat(point.latitude) + offset,
            longitude: parseFloat(point.longitude) + offset,
        };
    };


    const fetchDirections = async (axeId) => {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await axios.get(`${baseURL}/api/map/liste_depot/${axeId}`);
            const data = response.data;
            console.log("les points : "+ data);
    
            const nbrePassagers = data.numberOfUsagers;
            const nbrePoints = data.numberOfPoints;
    
            const valiny = response.data;
    
            const matriculeUsagers = valiny.matricule;
            const nomUsagers = valiny.nom;
    
            setNbrePassagers(nbrePassagers);
            setNbrePoints(nbrePoints);
    
            setMatriculeUsagers(matriculeUsagers);
            setNomUsagers(nomUsagers);
    
            let details = data.details;
            console.log(details);
    
            // Trier les points par heure_depot (ordre croissant)
            details = details.sort((a, b) => new Date(a.heure_depot) - new Date(b.heure_depot));
    
            console.log(`Nombre de détails: ${details.length}`);

            const origin = "Ivato Airport"; // début de parcours
            const destination = `${details[0].district} ${details[0].fokontany} ${details[0].lieu}`; // terminus


            // Ajoute tous les lieux intermédiaires comme étapes
            const waypoints = details.slice(1).map(location => ({
                location: `${location.district} ${location.fokontany} ${location.lieu}`,
                stopover: true
            }));
                
            setMapPoints([details[0], ...details.slice(1, -1), details[details.length - 1]]);
            console.log(mapPoints); // Vérifier les points à afficher
    
            setDirectionsResponse({ origin, destination, waypoints });
        } catch (error) {
            console.error('Erreur lors de la récupération des directions :', error);
        }
    };
    

    

    return isLoaded ? (
        <CContainer style={containerStyle}>
            <CNav variant="tabs" className="mb-3">
                <CNavItem>
                    <CNavLink href="#" active>
                        Actif
                    </CNavLink>
                </CNavItem>
                <CNavItem>

                <Link to="/map/confondu" style={{ textDecoration: 'none' }}>
                    <CNavLink>
                   tout axe
                    </CNavLink>
                </Link>

                </CNavItem>
                {/* <CNavItem>
                <Link to="/map/correction" style={{ textDecoration: 'none' }}>
                    <CNavLink>
                   correcteur de parcours
                    </CNavLink>
                </Link>
                </CNavItem> */}
                <CNavItem>
                    <CNavLink href="#" disabled>
                        Navigation
                    </CNavLink>
                </CNavItem>
            </CNav>

            <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                    <CButton color="primary" onClick={() => setVisibleToggle(true)}>
                        Voir les informations de l'axe
                    </CButton>
                    <COffcanvas placement="end" visible={visibleToggle} onHide={() => setVisibleToggle(false)}>
                    <COffcanvasHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                        <COffcanvasTitle>
                        <i className="bi bi-info-circle-fill me-2"></i>Informations sur l'Axe
                        </COffcanvasTitle>
                        <CCloseButton
                        className="text-reset"
                        onClick={() => setVisibleToggle(false)}
                        style={{ color: 'white' }}
                        />
                    </COffcanvasHeader>
                    <COffcanvasBody>
                        <p>
                        <strong>Axe sélectionné :</strong>{' '}
                        <span className="badge bg-primary">
                            {selectedAxe ? selectedAxe.label : 'Aucun axe sélectionné'}
                        </span>
                        </p>

                        {nbrePoints !== null && nbrePassagers !== null && (
                        <div className="mb-3">
                            <p>
                            <i className="bi bi-geo-alt-fill text-success me-2"></i>
                            <strong>Nombre de points :</strong>{' '}
                            <span className="badge bg-warning">{nbrePoints}</span>
                            </p>
                            <p>
                            <i className="bi bi-people-fill text-warning me-2"></i>
                            <strong>Nombre de passagers :</strong>{' '}
                            <span className="badge bg-warning">{nbrePassagers}</span>
                            </p>
                        </div>
                        )}

                        {totalDistance && (
                        <div className="mb-3">
                            <p>
                            <i className="bi bi-signpost-split-fill text-primary me-2"></i>
                            <strong>Distance totale :</strong>{' '}
                            <span className="badge bg-primary">{totalDistance}</span>
                            </p>
                            <p>
                            <i className="bi bi-clock-fill text-info me-2"></i>
                            <strong>Durée estimée en véhicule :</strong>{' '}
                            <span className="badge bg-dark">{totalDuration}</span>
                            </p>
                            <p>
                            <i className="bi bi-fuel-pump-fill text-danger me-2"></i>
                            <strong>Consommation Total estimée :</strong>{' '}
                            <span className="badge bg-danger">{consommation} litres</span>
                            </p>
                            <p>
                            <i className="bi bi-currency-exchange text-success me-2"></i>
                            <strong>Prix total :</strong>{' '}
                            <span className="badge bg-success">{Math.round(prixTotal).toLocaleString()} Ar</span>
                            </p>
                            <p>
                            <i className="bi bi-calendar-check-fill text-secondary me-2"></i>
                            <strong>Départ :</strong> Ivato à 15h30
                            </p>
                        </div>
                        )}

                        {mapPoints.length > 0 && (
                        <CTable striped hover responsive className="table-bordered">
                            <CTableHead style={{ backgroundColor: '#45B48E', color: 'white' }}>
                            <CTableRow>
                                <CTableHeaderCell scope="col" className="text-center">Ordre</CTableHeaderCell>
                                <CTableHeaderCell scope="col" className="text-center">Lieu</CTableHeaderCell>
                                <CTableHeaderCell scope="col" className="text-center">Heure</CTableHeaderCell>
                            </CTableRow>
                            </CTableHead>
                            <CTableBody>
                            {mapPoints.map((point, index) => {
                                const orderLetter = String.fromCharCode(65 + index);
                                return (
                                <CTableRow key={index}>
                                    <CTableDataCell className="text-center">
                                    <span className="badge bg-dark">{orderLetter}</span>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                    <CTooltip
                                        content={`Nom: ${point.nom} | Matricule: ${point.matricule}`}
                                        placement="right"
                                    >
                                        <span
                                        style={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            color: '#0d6efd',
                                        }}
                                        >
                                        {point.lieu}
                                        </span>
                                    </CTooltip>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                    {point.heure_depot
                                        ? new Date(`1970-01-01T${point.heure_depot}`).toLocaleTimeString()
                                        : 'Heure non valide'}
                                    </CTableDataCell>
                                </CTableRow>
                                );
                            })}
                            </CTableBody>
                        </CTable>
                        )}
                    </COffcanvasBody>
                    </COffcanvas>

                </div>
            </div>

            <CRow className="mb-4">
                <CCol md={4}>
                    <label>Sélectionner l'axe :</label>
                    <Select
                        value={selectedAxe}
                        onChange={handleAxeChange}
                        options={axes.map(axe => ({ value: axe.id, label: axe.axe }))}
                        placeholder="Rechercher ou sélectionner l'axe"
                    />
                </CCol>
                <CCol md={8}>
                    <CRow>
                        <CCol md={4}>
                            <label>consommation litre (100 km) :</label>
                            <input
                                type="number"
                                value={litres}
                                onChange={(e) => setLitres(e.target.value)}
                                className="form-control"
                            />
                        </CCol>
                        <CCol md={4}>
                            <label>Kilomètres parcourus :</label>
                            <input
                                type="number"
                                value={kilometers}
                                onChange={(e) => setKilometers(e.target.value)}
                                className="form-control"
                            />
                        </CCol>
                        <CCol md={4}>
                            <label>Prix de l'essence (AR) :</label>
                            <input
                                type="number"
                                value={prixEssence}
                                onChange={(e) => setPrixEssence(e.target.value)}
                                className="form-control"
                            />
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>


            <CRow>
                <CCol>
                    <h3>Circuit de dépôt</h3>
                    <GoogleMap
                        mapContainerStyle={{ height: '450px', width: '100%' }}
                        center={{ lat: -18.8792, lng: 47.5079 }}
                        zoom={10}
                    >
                        {directionsResponse && (
                            <>
                                <DirectionsService
                                    options={{
                                        origin: directionsResponse.origin,
                                        destination: directionsResponse.destination,
                                        waypoints: directionsResponse.waypoints,
                                        travelMode: 'DRIVING',
                                    }}
                                    callback={(result, status) => {
                                        if (status === 'OK') {
                                            setDirectionsResponse(result);
        
                                            const legs = result.routes[0].legs;
                                            let distance = 0;
                                            let duration = 0;

                                            legs.forEach(leg => {
                                                distance += leg.distance.value; // distance en mètres
                                                duration += leg.duration.value; // durée en secondes
                                            });

                                            //setTotalDistance(distance + 'mètres'); // mettre à jour la distance totale
                                            const distanceInMeters = distance; // votre distance actuelle en mètres

                                            // Convertir en kilomètres
                                            const distanceInKilometers = (distanceInMeters / 1000).toFixed(2); // Limiter à 2 décimales

                                            // Afficher la distance en mètres et en kilomètres
                                            setTotalDistance(`${distanceInMeters} mètres / ${distanceInKilometers} km`);
                                            
                                            setTotalDuration(Math.floor(duration / 60) + ' minutes');
                                        } else {
                                            console.error('Erreur lors de l\'obtention de l\'itinéraire', result);
                                        }
                                    }}
                                />
                                <DirectionsRenderer directions={directionsResponse} />
                                {mapPoints.map((point, index) => {
                                const adjustedPosition = adjustMarkerPosition(point, index);
                                    return (
                                        <Marker
                                            key={index}
                                            position={{
                                                lat: adjustedPosition.latitude,
                                                lng: adjustedPosition.longitude,
                                            }}
                                            label={`${String.fromCharCode(65 + index)}`} // A, B, C...
                                            onClick={() => {
                                                console.log(point);
                                                setSelectedPoint(point);
                                            }}
                                        />
                                    );
                                })}
                                {selectedPoint && (
                                    <InfoWindow
                                        position={{
                                            lat: parseFloat(selectedPoint.latitude),
                                            lng: parseFloat(selectedPoint.longitude),
                                        }}
                                        onCloseClick={() => setSelectedPoint(null)}
                                    >
                                        <div>
                                            <h4>Nom : {nomUsagers}</h4>
                                            <p><strong>Matricule :</strong> {matriculeUsagers}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </>
                        )}
                    </GoogleMap>
                </CCol>
            </CRow>
        </CContainer>
    ) : (
        <div>Chargement de la carte...</div>
    );
};

export default Map_depot;
