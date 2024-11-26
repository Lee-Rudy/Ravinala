import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import {
  cilEnvelopeClosed,
  cilPhone,
  cilUser,
  cilBriefcase,
  cilBuilding,
  cilMap,
  cilClock,
  cilLocationPin,
  cilTruck,
  cilArrowThickToBottom,
  cilArrowThickToTop,
  cilMagnifyingGlass,
  cilSearch
} from '@coreui/icons'

const ITEMS_PER_PAGE = 10;

const Planning = () => {
  const [activeTab, setActiveTab] = useState('ramassage');
  const [ramassageData, setRamassageData] = useState([]);
  const [depotData, setDepotData] = useState([]);
  const [searchTermRamassage, setSearchTermRamassage] = useState('');
  const [searchTermDepot, setSearchTermDepot] = useState('');
  const [selectedCarRamassage, setSelectedCarRamassage] = useState('');
  const [selectedAxeRamassage, setSelectedAxeRamassage] = useState('');
  const [selectedCarDepot, setSelectedCarDepot] = useState('');
  const [selectedAxeDepot, setSelectedAxeDepot] = useState('');
  const [carOptions, setCarOptions] = useState([]);
  const [axeOptions, setAxeOptions] = useState([]);
  const [currentPageRamassage, setCurrentPageRamassage] = useState(1);
  const [currentPageDepot, setCurrentPageDepot] = useState(1);

  // Fetch options for cars and axes
  useEffect(() => {
    const fetchOptions = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const carsResponse = await axios.get(`${baseURL}/api/cars/liste`);
        const axesResponse = await axios.get(`${baseURL}/api/axe/liste`);
        setCarOptions(carsResponse.data);
        setAxeOptions(axesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des options :', error);
      }
    };
    fetchOptions();
  }, []);

  // Fetch Ramassage Data
  useEffect(() => {
    const fetchRamassage = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${baseURL}/api/planning/liste_ramassage`);
        setRamassageData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de ramassage :', error);
      }
    };
    fetchRamassage();
  }, []);

  // Fetch Depot Data
  useEffect(() => {
    const fetchDepot = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${baseURL}/api/planning/liste_depot`);
        setDepotData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de dépôt :', error);
      }
    };
    fetchDepot();
  }, []);

  // Filter and paginate Ramassage Data
  const filteredRamassageData = ramassageData.filter(item => {
    const matchesSearch = `${item.nomUsager} ${item.matricule}`.toLowerCase().includes(searchTermRamassage.toLowerCase());
    const matchesCar = selectedCarRamassage ? item.nomVoiture === selectedCarRamassage : true;
    const matchesAxe = selectedAxeRamassage ? item.nomAxe === selectedAxeRamassage : true;
    return matchesSearch && matchesCar && matchesAxe;
  });

  const paginatedRamassageData = filteredRamassageData.slice(
    (currentPageRamassage - 1) * ITEMS_PER_PAGE,
    currentPageRamassage * ITEMS_PER_PAGE
  );

  // Filter and paginate Depot Data
  const filteredDepotData = depotData.filter(item => {
    const matchesSearch = `${item.nomUsager} ${item.matricule}`.toLowerCase().includes(searchTermDepot.toLowerCase());
    const matchesCar = selectedCarDepot ? item.nomVoiture === selectedCarDepot : true;
    const matchesAxe = selectedAxeDepot ? item.nomAxe === selectedAxeDepot : true;
    return matchesSearch && matchesCar && matchesAxe;
  });

  const paginatedDepotData = filteredDepotData.slice(
    (currentPageDepot - 1) * ITEMS_PER_PAGE,
    currentPageDepot * ITEMS_PER_PAGE
  );

  // Handle page change for ramassage and depot
  const handlePageChangeRamassage = (page) => setCurrentPageRamassage(page);
  const handlePageChangeDepot = (page) => setCurrentPageDepot(page);

  const totalPagesRamassage = Math.ceil(filteredRamassageData.length / ITEMS_PER_PAGE);
  const totalPagesDepot = Math.ceil(filteredDepotData.length / ITEMS_PER_PAGE);

  return (
    <CCard>
      <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Liste des usagers actifs</strong>
            </CCardHeader>
      <CCardHeader>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink active={activeTab === 'ramassage'} onClick={() => setActiveTab('ramassage')}>
              Ramassage
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 'depot'} onClick={() => setActiveTab('depot')}>
              Dépôt
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCardHeader>
      <CCardBody>
        {activeTab === 'ramassage' ? (
          <>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Rechercher par nom ou matricule"
                value={searchTermRamassage}
                onChange={(e) => setSearchTermRamassage(e.target.value)}
              />
              <CFormSelect
                aria-label="Filtrer par voiture"
                value={selectedCarRamassage}
                onChange={(e) => setSelectedCarRamassage(e.target.value)}
                className="ms-3"
              >
                <option value="">Toutes les voitures</option>
                {carOptions.map(car => (
                  <option key={car.id} value={car.nom_car}>{car.nom_car}</option>
                ))}
              </CFormSelect>
              <CFormSelect
                aria-label="Filtrer par axe"
                value={selectedAxeRamassage}
                onChange={(e) => setSelectedAxeRamassage(e.target.value)}
                className="ms-3"
              >
                <option value="">Tous les axes</option>
                {axeOptions.map(axe => (
                  <option key={axe.id} value={axe.axe}>{axe.axe}</option>
                ))}
              </CFormSelect>
            </CInputGroup>

            <CTable bordered borderColor="primary">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Matricule</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nom Usager</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Axe</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Voiture</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Fokontany</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Lieu</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Heure prévue</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedRamassageData.map((item, index) => (
                  <CTableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <CTableDataCell className="text-center">
                    <span style={{ fontWeight: 'bold', color: '#45B48E' }}>{item.matricule}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilUser} className="me-2 text-info" />
                    {item.nomUsager}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilMap} className="me-2 text-warning" />
                    {item.nomAxe}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    
                    {item.nomVoiture}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilLocationPin} className="me-2 text-danger" />
                    {item.fokontany}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilLocationPin} className="me-2 text-success" />
                    {item.lieu}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilClock} className="me-2 text-secondary" />
                    {item.heure}
                  </CTableDataCell>
                </CTableRow>
                
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" className="mt-3">
              <CPaginationItem
                disabled={currentPageRamassage === 1}
                onClick={() => handlePageChangeRamassage(currentPageRamassage - 1)}
              >
                Précédent
              </CPaginationItem>
              {[...Array(totalPagesRamassage).keys()].map(pageNumber => (
                <CPaginationItem
                  key={pageNumber}
                  active={currentPageRamassage === pageNumber + 1}
                  onClick={() => handlePageChangeRamassage(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPageRamassage === totalPagesRamassage}
                onClick={() => handlePageChangeRamassage(currentPageRamassage + 1)}
              >
                Suivant
              </CPaginationItem>
            </CPagination>
          </>
        ) : (
          <>
            {/* Similar structure for Depot with pagination */}
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Rechercher par nom ou matricule"
                value={searchTermDepot}
                onChange={(e) => setSearchTermDepot(e.target.value)}
              />
              <CFormSelect
                aria-label="Filtrer par voiture"
                value={selectedCarDepot}
                onChange={(e) => setSelectedCarDepot(e.target.value)}
                className="ms-3"
              >
                <option value="">Toutes les voitures</option>
                {carOptions.map(car => (
                  <option key={car.id} value={car.nom_car}>{car.nom_car}</option>
                ))}
              </CFormSelect>
              <CFormSelect
                aria-label="Filtrer par axe"
                value={selectedAxeDepot}
                onChange={(e) => setSelectedAxeDepot(e.target.value)}
                className="ms-3"
              >
                <option value="">Tous les axes</option>
                {axeOptions.map(axe => (
                  <option key={axe.id} value={axe.axe}>{axe.axe}</option>
                ))}
              </CFormSelect>
            </CInputGroup>

            <CTable  bordered borderColor="primary">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Matricule</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nom Usager</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Axe</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Voiture</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Fokontany</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Lieu</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Heure prévue</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedDepotData.map((item, index) => (
                  <CTableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <CTableDataCell className="text-center">
                    <span style={{ fontWeight: 'bold', color: '#45B48E' }}>{item.matricule}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilUser} className="me-2 text-info" />
                    {item.nomUsager}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilMap} className="me-2 text-warning" />
                    {item.nomAxe}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    
                    {item.nomVoiture}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilLocationPin} className="me-2 text-danger" />
                    {item.fokontany}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilLocationPin} className="me-2 text-success" />
                    {item.lieu}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon icon={cilClock} className="me-2 text-secondary" />
                    {item.heure}
                  </CTableDataCell>
                </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" className="mt-3">
              <CPaginationItem
                disabled={currentPageDepot === 1}
                onClick={() => handlePageChangeDepot(currentPageDepot - 1)}
              >
                Précédent
              </CPaginationItem>
              {[...Array(totalPagesDepot).keys()].map(pageNumber => (
                <CPaginationItem
                  key={pageNumber}
                  active={currentPageDepot === pageNumber + 1}
                  onClick={() => handlePageChangeDepot(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPageDepot === totalPagesDepot}
                onClick={() => handlePageChangeDepot(currentPageDepot + 1)}
              >
                Suivant
              </CPaginationItem>
            </CPagination>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default Planning;
