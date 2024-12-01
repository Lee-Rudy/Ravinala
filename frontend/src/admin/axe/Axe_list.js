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
  CInputGroup,
  CNav,
  CNavItem,
  CNavLink
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass, cilPencil } from '@coreui/icons';
import { Link } from 'react-router-dom';


const Axe_list = () => {
  const [axes, setAxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAxes();
  }, []);

  const fetchAxes = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/axe/liste`);
      setAxes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des axes:', error);
    }
  };

  const filteredAxes = axes
    .filter((axe) =>
      axe.axe.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filterType === 'longestDistance') {
        return b.distance_km - a.distance_km;
      }
      if (filterType === 'longestDuration') {
        return b.duree_trajet - a.duree_trajet;
      }
      return 0;
    });

  const paginatedAxes = filteredAxes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          
        <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Liste des axes</strong>
          </CCardHeader>
          <CNav variant="tabs" className="mb-3">
            <CNavItem>
                <Link to="/axe" style={{ textDecoration: 'none' }}>
                <CNavLink active>Listes des cars</CNavLink>
                </Link>
            </CNavItem>
            
            <CNavItem>
                <Link to="/axe_conducteurs" style={{ textDecoration: 'none' }}>
                <CNavLink>Listes des attributions des cars pour un axe</CNavLink>
                </Link>
            </CNavItem>
        </CNav>
  
          <CCardBody>
            {/* Ligne de recherche et filtre */}
            <CRow className="align-items-end mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="search">Rechercher par nom d'axe</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilMagnifyingGlass} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    id="search"
                    placeholder="Rechercher par nom d'axe"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="filterType">Filtrer par type de trajet</CFormLabel>
                <CFormSelect
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Aucun filtre</option>
                  <option value="longestDistance">Trajet le plus long</option>
                  <option value="longestDuration">Durée la plus longue</option>
                </CFormSelect>
              </CCol>
              <CCol md={2} className="text-end">
                <Link to="/axe/add">
                  <CButton color="primary" className="mt-4">
                    + Ajouter un Axe
                  </CButton>
                </Link>
              </CCol>
            </CRow>

            {/* Tableau des axes */}
            <CTable bordered responsive borderColor="primary">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Nom de l'axe</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Distance (km)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Durée (minutes)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedAxes.map((axe) => (
                  <CTableRow key={axe.id}>
                    <CTableDataCell className="text-center">{axe.axe}</CTableDataCell>
                    <CTableDataCell className="text-center">{axe.distance_km}</CTableDataCell>
                    <CTableDataCell className="text-center">{axe.duree_trajet}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/axe/update/${axe.id}`}>
                        <CButton color="warning" size="sm">
                          <CIcon icon={cilPencil} />Modifier
                        </CButton>
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            <CPagination align="center" aria-label="Pagination" style={{ cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </CPaginationItem>
              {[...Array(Math.ceil(filteredAxes.length / itemsPerPage))].map((_, idx) => (
                <CPaginationItem
                  key={idx}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === Math.ceil(filteredAxes.length / itemsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Axe_list;
