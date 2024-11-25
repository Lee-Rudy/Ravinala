import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CRow,
  CCol,
  CCardBody,
  CCard,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CSpinner,
  CFormCheck,
  CInputGroupText,
  CInputGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilMagnifyingGlass } from '@coreui/icons';

const ConsommationCar = () => {
  // États pour la liste des voitures
  const [allCars, setAllCars] = useState([]); // Tous les véhicules récupérés de l'API
  const [filteredCars, setFilteredCars] = useState([]); // Voitures filtrées selon le terme de recherche
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Nombre de voitures par page

  const [searchTerm, setSearchTerm] = useState('');

  // États pour la sélection des voitures
  const [selectedCars, setSelectedCars] = useState([]);

  // États pour les dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // États pour les résultats de consommation
  const [consumptionData, setConsumptionData] = useState(null);
  const [consumptionLoading, setConsumptionLoading] = useState(false);
  const [consumptionError, setConsumptionError] = useState(null);


  // Fonction pour récupérer la liste des voitures
  const fetchCars = async () => {
    setCarsLoading(true);
    setCarsError(null);

    // Définir la baseURL directement si les variables d'environnement posent problème
    const baseURL = import.meta.env.VITE_API_BASE_URL;


    try {
      const response = await axios.get(`${baseURL}/api/cars/liste`);

      // Vérifiez si la réponse est un tableau
      if (Array.isArray(response.data)) {
        setAllCars(response.data);
        setFilteredCars(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        throw new Error('Format de données inattendu de l\'API.');
      }
    } catch (error) {
      console.error(error);
      setCarsError('Erreur lors de la récupération des données des voitures.');
    } finally {
      setCarsLoading(false);
    }
  };

  

  // Effet pour charger les voitures au démarrage
  useEffect(() => {
    fetchCars();
  }, []);

  // Effet pour filtrer les voitures lorsque le terme de recherche change
  useEffect(() => {
    const filtered = allCars.filter(car =>
      car.nom_car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCars(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Réinitialiser la page lors d'un nouveau filtre
  }, [searchTerm, allCars]);

  // Calcul des voitures à afficher sur la page actuelle
  const displayedCars = filteredCars.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Gestion de la sélection des voitures
  const handleSelectCar = (carId) => {
    setSelectedCars((prevSelected) => {
      if (prevSelected.includes(carId)) {
        return prevSelected.filter((id) => id !== carId);
      } else {
        return [...prevSelected, carId];
      }
    });
  };

  // Fonction pour récupérer les données de consommation
  const fetchConsumption = async () => {
    // Validation des champs
    if (selectedCars.length === 0) {
      alert('Veuillez sélectionner au moins une voiture.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Veuillez sélectionner une plage de dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('La date de début doit être antérieure ou égale à la date de fin.');
      return;
    }
  
    setConsumptionLoading(true);
    setConsumptionError(null);
    setConsumptionData(null);
  
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5218';
  
    try {
      // Récupérer les noms des voitures sélectionnées
      const selectedCarNames = allCars
        .filter((car) => selectedCars.includes(car.id))
        .map((car) => car.nom_car);
  
      // Générer les paramètres de requête
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      selectedCarNames.forEach((car) => params.append('cars', car));
  
      // Effectuer la requête
      const response = await axios.get(`${baseURL}/api/stat/conso/ranking/totalcost?${params.toString()}`);
  
      console.log('Response from /totalcost:', response.data); // Log pour débogage
      setConsumptionData(response.data);
    } catch (error) {
      setConsumptionError('Erreur lors du chargement des données de consommation.');
      console.error(error);
    } finally {
      setConsumptionLoading(false);
    }
  };
  

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    // Le filtrage est déjà géré par l'effet useEffect
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            {/* Formulaire de recherche */}
            <CForm onSubmit={handleSearch}>
              <CRow className="mb-3">
                {/* Barre de recherche */}
                <CCol md={4}>
                  <CFormLabel htmlFor="search">Recherche par Nom ou Immatriculation</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilMagnifyingGlass} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="search"
                      placeholder="nom du voiture et immatrivulation"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                {/* Bouton de recherche */}
                {/* <CCol md={2} className="d-flex align-items-end">
                  <CButton color="primary" type="submit" className="w-100">
                    <CIcon icon={cilSearch} className="me-2" />
                    Rechercher
                  </CButton>
                </CCol> */}
              </CRow>
            </CForm>

            {/* Liste des voitures */}
            <CRow>
              <CCol>
                <h5>Liste des Voitures</h5>
                {carsLoading ? (
                  <div className="d-flex justify-content-center">
                    <CSpinner color="primary" />
                  </div>
                ) : carsError ? (
                  <div className="text-danger">{carsError}</div>
                ) : filteredCars.length === 0 ? (
                  <div>Aucune voiture trouvée.</div>
                ) : (
                  <>
                    <CTable bordered color="info">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">Sélection</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Nom de la Voiture</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Immatriculation</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {displayedCars.map((car) => (
                          <CTableRow key={car.id}>
                            <CTableDataCell>
                              <CFormCheck
                                type="checkbox"
                                checked={selectedCars.includes(car.id)}
                                onChange={() => handleSelectCar(car.id)}
                              />
                            </CTableDataCell>
                            <CTableDataCell>{car.nom_car}</CTableDataCell>
                            <CTableDataCell>{car.immatriculation}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>

                    {/* Pagination */}
                    <CPagination className="mt-3" aria-label="Pagination">
                      <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Précédent
                      </CPaginationItem>
                      {[...Array(Math.ceil(filteredCars.length / pageSize))].map((_, idx) => (
                        <CPaginationItem
                          key={idx}
                          active={currentPage === idx + 1}
                          onClick={() => handlePageChange(idx + 1)}
                        >
                          {idx + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem
                        disabled={currentPage === Math.ceil(filteredCars.length / pageSize)}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Suivant
                      </CPaginationItem>
                    </CPagination>
                  </>
                )}
              </CCol>
            </CRow>

            {/* Sélection des dates et bouton de calcul */}
            <CRow className="mt-4">
              <CCol md={3}>
                <CFormLabel htmlFor="startDate">Date de Début</CFormLabel>
                <CFormInput
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="endDate">Date de Fin</CFormLabel>
                <CFormInput
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </CCol>
              <CCol md={3} className="d-flex align-items-end">
                <CButton color="dark" onClick={fetchConsumption} className="w-100">
                  {consumptionLoading ? (
                    <>
                      <CSpinner size="sm" /> Calcul en cours...
                    </>
                  ) : (
                    'Calculer la Consommation'
                  )}
                </CButton>
              </CCol>
            </CRow>

            {/* Affichage des résultats */}
            <CRow className="mt-4">
              <CCol>
                {consumptionLoading && (
                  <div className="d-flex justify-content-center">
                    <CSpinner color="primary" />
                  </div>
                )}
                {consumptionError && <div className="text-danger">{consumptionError}</div>}
                {consumptionData && (
  <CCard>
    <CCardBody>
      <h5>Consommation des Voitures</h5>
      <p><strong>Période :</strong> {consumptionData.period}</p>
      <p><strong>Coût Total :</strong> {Number(consumptionData.totalCost).toFixed(2)} AR</p>
      <CTable color='warning'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Nom de la Voiture</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Kilomètres</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Prix (AR)</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Litres</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {consumptionData.costPerCar.map((car, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{car.nomVoiture}</CTableDataCell>
              <CTableDataCell>{Number(car.totalKm).toFixed(2)} km</CTableDataCell>
              <CTableDataCell>{Number(car.totalPrix).toFixed(2)} AR</CTableDataCell>
              <CTableDataCell>{Number(car.totalLitres).toFixed(2)} L</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CCardBody>
  </CCard>
)}

              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ConsommationCar;