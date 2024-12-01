import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPaginationItem,
  CPagination,
  CInputGroupText,
  CInputGroup,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSwitch
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

import { Link } from 'react-router-dom';
// import { color } from 'html2canvas/dist/types/css/types/color';

const Cars_list = () => {
  // Variables d'état
  const [carsList, setCarsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [types, setTypes] = useState([]);
  const [prestataire, setPrestataire] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCarsData, setEditCarsData] = useState({
    nom_car: '',
    immatriculation: '',
    nombre_place: 0,
    type_cars_id: '',
    prestataire_id: '',
    litre_consommation: 0,
    km_consommation: 0,
    prix_consommation: 0,
    type_carburant: '',
    est_actif: false // Nouveau champ
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch cars, types, and prestataires on component mount
  useEffect(() => {
    fetchCars();
    fetchTypes();
    fetchPrestataires();
  }, []);

  // Récupérer la liste des voitures
  const fetchCars = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/cars/liste_type_cars_prestataire`);
      console.log('Cars List:', response.data); // Pour débogage
      setCarsList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données des voitures.', error);
    }
  };

  // Récupérer la liste des types de voitures
  const fetchTypes = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/type_cars/liste`);
      setTypes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des types de voitures.', error);
    }
  };

  // Récupérer la liste des prestataires
  const fetchPrestataires = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/prestataire/liste`);
      setPrestataire(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des prestataires.', error);
    }
  };

  // Utiliser useMemo pour mémoriser les voitures filtrées et triées
  const sortedFilteredCars = useMemo(() => {
    let filtered = [...carsList];

    // Filtrer par nom ou immatriculation
    if (searchTerm) {
      filtered = filtered.filter((car) =>
        car.nomCar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par type de voiture
    if (selectedType) {
      filtered = filtered.filter((car) => car.typeCar === selectedType);
    }

    // Trier par nombre de places avec un critère secondaire (id)
    filtered.sort((a, b) => {
      if (a.nombrePlace === b.nombrePlace) {
        return a.id - b.id; // Tri secondaire par ID croissant
      }
      if (sortOrder === 'asc') {
        return a.nombrePlace - b.nombrePlace;
      } else {
        return b.nombrePlace - a.nombrePlace;
      }
    });

    return filtered;
  }, [carsList, searchTerm, selectedType, sortOrder]);

  // Pagination basée sur sortedFilteredCars
  const paginatedCars = useMemo(() => {
    return sortedFilteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [sortedFilteredCars, currentPage, itemsPerPage]);

  // Handle click on a car to view details
  const handleUsagerClick = (car) => {
    setSelectedCar(car);
    setIsEditMode(false);
    setModalVisible(true);
  };

  // Handle click on edit button
  const handleEditClick = (car) => {
    setSelectedCar(car);
    setIsEditMode(true);
    setEditCarsData({
      nom_car: car.nomCar || '',
      immatriculation: car.immatriculation || '',
      nombre_place: car.nombrePlace || 0,
      type_cars_id: getTypeCarsId(car.typeCar),
      prestataire_id: getPrestataireId(car.prestataire),
      litre_consommation: car.litre_consommation || 0,
      km_consommation: car.km_consommation || 0,
      prix_consommation: car.prix_consommation || 0,
      type_carburant: car.type_carburant || '',
      est_actif: car.est_actif || false // Initialiser le statut
    });
    setFormErrors({});
    setError('');
    setModalVisible(true);
  };

  // Helper functions to get IDs from names
  const getTypeCarsId = (typeCarName) => {
    const typeCar = types.find(t => t.type_cars === typeCarName);
    return typeCar ? typeCar.id : '';
  };

  const getPrestataireId = (prestataireName) => {
    const prest = prestataire.find(p => p.prestataire === prestataireName);
    return prest ? prest.id : '';
  };

  // Handle input change in the edit form
  const handleEditInputChange = (event) => {
    const { id, value, checked, type } = event.target;
    if (id === 'est_actif') {
      setEditCarsData({
        ...editCarsData,
        est_actif: checked
      });
    } else {
      setEditCarsData({
        ...editCarsData,
        [id]: id === 'type_cars_id' || id === 'prestataire_id' ? parseInt(value, 10) : value,
      });
    }
  };

  // Handle form submission for update
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const formErrors = validateEditForm();
    setFormErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const requestData = {
          CarsDto: {
            nom_car: editCarsData.nom_car,
            immatriculation: editCarsData.immatriculation,
            nombre_place: editCarsData.nombre_place,
            litre_consommation: editCarsData.litre_consommation,
            km_consommation: editCarsData.km_consommation,
            prix_consommation: editCarsData.prix_consommation,
            type_carburant: editCarsData.type_carburant,
            est_actif: editCarsData.est_actif, // Inclure le statut
          },
          Type_carsDto: {
            id: editCarsData.type_cars_id
          },
          Prestaitairedto: { // Assurez-vous que le nom correspond au back-end
            id: editCarsData.prestataire_id
          }
        };
        await axios.put(`${baseURL}/api/cars/update/${selectedCar.id}`, requestData);
        alert('Véhicule mis à jour avec succès');
        fetchCars(); // Rafraîchir la liste des véhicules
        setModalVisible(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Form validation for edit
  const validateEditForm = () => {
    const errors = {};
    if (!editCarsData.nom_car) errors.nom_car = 'Le nom du car est obligatoire.*';
    if (!editCarsData.immatriculation) errors.immatriculation = 'L\'immatriculation est obligatoire.*';
    if (!editCarsData.nombre_place) errors.nombre_place = 'Le nombre de places est obligatoire.*';
    if (!editCarsData.prestataire_id) errors.prestataire_id = 'Choix de prestataire obligatoire.*';
    if (!editCarsData.type_cars_id) errors.type_cars_id = 'Choix de type du car obligatoire.*';
    if (!editCarsData.type_carburant) errors.type_carburant = 'Le type de carburant est obligatoire.*';
    return errors;
  };

  const handleError = (err) => {
    setError(err.response ? err.response.data.errors : 'Erreur du serveur !');
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Liste des Cars</strong>
            </CCardHeader>
            <CCardBody>
              {/* Bouton d'ajout */}
              <div className="d-flex justify-content-between mb-2">
                <div className="ms-auto">
                  <Link to="/cars">
                    <CButton color="primary">
                      + Ajouter un car
                    </CButton>
                  </Link>
                </div>
              </div>

              {/* Barre de recherche */}
              <CFormLabel htmlFor="searchInput">Recherche de car ou immatriculation</CFormLabel>
              <CInputGroup className="mb-2">
                <CInputGroupText>
                  <CIcon icon={cilMagnifyingGlass} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  id="searchInput"
                  placeholder="Rechercher par nom ou immatriculation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>

              {/* Filtre par type de voiture et tri par nombre de places */}
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel htmlFor="typeSelect">Catégories</CFormLabel>
                  <CFormSelect
                    id="typeSelect"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mb-3"
                  >
                    <option value="">Tous les types</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.type_cars}>
                        {type.type_cars}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol>
                  <CFormLabel htmlFor="sortOrderSelect">Trier par nombre de places</CFormLabel>
                  <CFormSelect
                    id="sortOrderSelect"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="mb-3"
                  >
                    <option value="asc">Croissant</option>
                    <option value="desc">Décroissant</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Tableau des résultats filtrés */}
              <CTable bordered borderColor="primary">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Nom du Car</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Catégorie</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Immatriculation</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nombre de places</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Prestataire</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Litre de consommation</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Km de consommation</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Prix consommation</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Statuts</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell> {/* Nouvelle colonne */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedCars.map((car) => (
                    <CTableRow key={car.id}>
                      <CTableDataCell
                        className="text-center"
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'darkblue')}
                        onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                        onClick={() => handleUsagerClick(car)}
                      >
                        {car.nomCar}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{car.typeCar}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.immatriculation}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.nombrePlace}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.prestataire}</CTableDataCell>
                      <CTableDataCell className="text-center">{Number(car.litre_consommation).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} L</CTableDataCell>
                      <CTableDataCell className="text-center">{Number(car.km_consommation).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} KM </CTableDataCell>
                      <CTableDataCell className="text-center">{Number(car.prix_consommation).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} AR</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={car.est_actif ? 'success' : 'warning'}>
                          {car.est_actif ? 'Actif' : 'Inactif'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="warning" size="sm" onClick={() => handleEditClick(car)}>
                          Modifier
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              <CPagination aria-label="Pagination" style={{ cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Précédent
                </CPaginationItem>
                {[...Array(Math.ceil(sortedFilteredCars.length / itemsPerPage))].map((_, idx) => (
                  <CPaginationItem
                    key={idx}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(sortedFilteredCars.length / itemsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </CPaginationItem>
              </CPagination>

              {/* Modal pour afficher les informations et l'édition */}
              <CModal
                visible={modalVisible}
                onClose={() => {
                  setModalVisible(false);
                  setIsEditMode(false);
                  setSelectedCar(null);
                }}
                aria-labelledby="carsDetailsLabel"
              >
                <CModalHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                  <CModalTitle id="carsDetailsLabel">
                    {isEditMode ? 'Modifier le véhicule : ' : 'Contrat du : '}
                    {selectedCar ? selectedCar.nomCar : ''}
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {isEditMode ? (
                    <CForm onSubmit={handleUpdateSubmit}>
                      {/* Champs du formulaire d'édition */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="nom_car">Nom du car</CFormLabel>
                        <CFormInput
                          type="text"
                          id="nom_car"
                          value={editCarsData.nom_car}
                          onChange={handleEditInputChange}
                          placeholder="Entrer le nom du véhicule"
                          invalid={!!formErrors.nom_car}
                        />
                        {formErrors.nom_car && <div className="invalid-feedback">{formErrors.nom_car}</div>}
                      </div>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel htmlFor="immatriculation">Immatriculation</CFormLabel>
                          <CFormInput
                            type="text"
                            id="immatriculation"
                            value={editCarsData.immatriculation}
                            onChange={handleEditInputChange}
                            placeholder="Saisir l'immatriculation"
                            invalid={!!formErrors.immatriculation}
                          />
                          {formErrors.immatriculation && <div className="invalid-feedback">{formErrors.immatriculation}</div>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="nombre_place">Nombre de places</CFormLabel>
                          <CFormInput
                            type="number"
                            id="nombre_place"
                            value={editCarsData.nombre_place}
                            onChange={handleEditInputChange}
                            placeholder="Nombre de places"
                            invalid={!!formErrors.nombre_place}
                          />
                          {formErrors.nombre_place && <div className="invalid-feedback">{formErrors.nombre_place}</div>}
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel htmlFor="type_cars_id">Type de car</CFormLabel>
                          <CFormSelect
                            id="type_cars_id"
                            value={editCarsData.type_cars_id}
                            onChange={handleEditInputChange}
                            invalid={!!formErrors.type_cars_id}
                          >
                            <option value="">Sélectionner le type du véhicule</option>
                            {types.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.type_cars}
                              </option>
                            ))}
                          </CFormSelect>
                          {formErrors.type_cars_id && <div className="invalid-feedback">{formErrors.type_cars_id}</div>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="prestataire_id">Prestataire</CFormLabel>
                          <CFormSelect
                            id="prestataire_id"
                            value={editCarsData.prestataire_id}
                            onChange={handleEditInputChange}
                            invalid={!!formErrors.prestataire_id}
                          >
                            <option value="">Sélectionner un prestataire</option>
                            {prestataire.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.prestataire}
                              </option>
                            ))}
                          </CFormSelect>
                          {formErrors.prestataire_id && <div className="invalid-feedback">{formErrors.prestataire_id}</div>}
                        </CCol>
                      </CRow>

                      {/* Toggle Switch pour est_actif */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="est_actif">Statut Actif</CFormLabel>
                        <CFormSwitch
                          id="est_actif"
                          checked={editCarsData.est_actif}
                          onChange={handleEditInputChange}
                          label={editCarsData.est_actif ? 'Actif' : 'Inactif'}
                        />
                      </div>

                      <div className="mb-3">
                        <CFormLabel htmlFor="type_carburant">Type de consommation</CFormLabel>
                        <CFormSelect
                          id="type_carburant"
                          value={editCarsData.type_carburant}
                          onChange={handleEditInputChange}
                          invalid={!!formErrors.type_carburant}
                        >
                          <option value="">Sélectionner le type de carburant</option>
                          <option value="essence">Essence</option>
                          <option value="gasoil">Gasoil</option>
                        </CFormSelect>
                        {formErrors.type_carburant && <div className="invalid-feedback">{formErrors.type_carburant}</div>}
                      </div>

                      <CRow className="mb-3">
                        <CCol md={4}>
                          <CFormLabel htmlFor="litre_consommation">Consommation (L)</CFormLabel>
                          <CFormInput
                            type="number"
                            id="litre_consommation"
                            value={editCarsData.litre_consommation}
                            onChange={handleEditInputChange}
                            placeholder="Litre"
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="km_consommation">Km par Litre</CFormLabel>
                          <CFormInput
                            type="number"
                            id="km_consommation"
                            value={editCarsData.km_consommation}
                            onChange={handleEditInputChange}
                            placeholder="Km par litre"
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel htmlFor="prix_consommation">Prix par Litre</CFormLabel>
                          <CFormInput
                            type="number"
                            id="prix_consommation"
                            value={editCarsData.prix_consommation}
                            onChange={handleEditInputChange}
                            placeholder="Prix en Ariary"
                          />
                        </CCol>
                      </CRow>

                      {/* Messages d'erreur */}
                      {error && <div className="alert alert-danger">{error}</div>}

                      <CButton type="submit" color="primary">Mettre à jour</CButton>
                      <CButton color="secondary" onClick={() => setModalVisible(false)} className="ms-2">Annuler</CButton>
                    </CForm>
                  ) : (
                    // Mode de visualisation existant
                    selectedCar ? (
                      <div className="usager-details">
                        <style>
                          {`
                            .usager-details {
                              background-color: #f8f9fa;
                              padding: 20px;
                              border-radius: 5px;
                            }

                            .usager-details ul {
                              padding: 0;
                              margin: 0;
                              list-style: none;
                            }

                            .usager-details li {
                              padding: 8px 0;
                              display: flex;
                              align-items: center;
                              border-bottom: 1px solid #e9ecef;
                            }

                            .usager-details li:last-child {
                              border-bottom: none;
                            }

                            .usager-details strong {
                              width: 150px;
                              display: inline-block;
                              font-weight: bold;
                              color: #495057;
                            }

                            .usager-details li i {
                              margin-right: 10px;
                              color: #45B48E;
                            }

                            .usager-details p {
                              color: #6c757d;
                              text-align: center;
                              font-size: 14px;
                              margin: 15px 0;
                            }
                          `}
                        </style>
                        <ul>
                          <li>
                            <i className="bi bi-hash"></i>
                            <strong>Debut contrat :</strong> {selectedCar.debutContrat ? selectedCar.debutContrat.slice(0, 10) : ''}
                          </li>
                          <li>
                            <i className="bi bi-person-fill"></i>
                            <strong>Fin contrat :</strong> {selectedCar.finContrat ? selectedCar.finContrat.slice(0, 10) : ''}
                          </li>
                          <li>
                            <i className="bi bi-person-fill"></i>
                            <strong>Carburant :</strong> {selectedCar.type_carburant ? selectedCar.type_carburant.slice(0, 10) : ''}
                          </li>
                          {/* Ajoutez d'autres détails si nécessaire */}
                        </ul>
                      </div>
                    ) : (
                      <p>Aucun détail disponible.</p>
                    )
                  )}
                </CModalBody>
                <CModalFooter>
                  {!isEditMode && (
                    <CButton color="warning" onClick={() => setIsEditMode(true)}>
                      Modifier
                    </CButton>
                  )}
                  <CButton color="secondary" onClick={() => setModalVisible(false)}>
                    Fermer
                  </CButton>
                </CModalFooter>
              </CModal>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Cars_list;