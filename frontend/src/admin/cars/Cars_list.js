import React, { useState, useEffect } from 'react';
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
  CInputGroup
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

import { Link } from 'react-router-dom';


const Cars_list = () => {
  // Variables d'état
  const [carsList, setCarsList] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [types, setTypes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch cars and types of cars on component mount
  useEffect(() => {
    fetchCars();
    fetchTypes();
  }, []);

  // Filtrer les données à chaque changement des filtres ou du terme de recherche
  useEffect(() => {
    filterCars();
  }, [searchTerm, selectedType, sortOrder, carsList]);

  // Récupérer la liste des voitures
  const fetchCars = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/cars/liste_type_cars_prestataire`);
      setCarsList(response.data);
      setFilteredCars(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données des voitures.');
    }
  };

  // Récupérer la liste des types de voitures
  const fetchTypes = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/type_cars/liste`);
      setTypes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des types de voitures.');
    }
  };

  // Filtrer les voitures en fonction des critères sélectionnés
  const filterCars = () => {
    let filtered = carsList;

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

    // Trier par nombre de places
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.nombrePlace - b.nombrePlace;
      } else {
        return b.nombrePlace - a.nombrePlace;
      }
    });

    setFilteredCars(filtered);
  };

  // Pagination
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard>
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Liste des Cars</strong>
            </CCardHeader>
            <CCardBody>
              {/* Ajout bouton */}
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

              <CFormLabel htmlFor="typeSelect">Recherche de car ou immatriculation</CFormLabel>
            <CInputGroup className="mb-2">
            <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} />
            </CInputGroupText>
            <CFormInput
                type="text"
                placeholder="Rechercher par nom ou immatriculation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </CInputGroup>


              {/* Filtre par type de voiture */}
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

              {/* Filtre par nombre de places */}
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
                    <CTableHeaderCell className="text-center">Contrat Début</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Contrat Fin</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedCars.map((car) => (
                    <CTableRow key={car.id}>
                      <CTableDataCell className="text-center">{car.nomCar}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.typeCar}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.immatriculation}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.nombrePlace}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.prestataire}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.debutContrat ? car.debutContrat.slice(0,10) :  ''}</CTableDataCell>
                      <CTableDataCell className="text-center">{car.finContrat ? car.finContrat.slice(0,10): ''}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              <CPagination aria-label="Pagination">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Précédent
                </CPaginationItem>
                {[...Array(Math.ceil(filteredCars.length / itemsPerPage))].map((_, idx) => (
                  <CPaginationItem
                    key={idx}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(filteredCars.length / itemsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Cars_list;
