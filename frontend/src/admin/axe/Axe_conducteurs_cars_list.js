import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CNav,
  CNavItem,
  CNavLink,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPencil } from '@coreui/icons';
import { Link } from 'react-router-dom';

const Axe_conducteurs_cars_list = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${baseURL}/api/axe_conducteurs/details`);
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  // Filtrer les données en fonction du champ de recherche unique
  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.nom_axe.toLowerCase().includes(term) ||
      item.nom_conducteur.toLowerCase().includes(term) ||
      item.nom_car.toLowerCase().includes(term)
    );
  });

  return (
    <CCard>
      <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
      <strong>Liste des Axes et Conducteurs Associés aux Cars (Assignation)</strong>
          </CCardHeader>
        <CNav variant="tabs" className="mb-3">
          <CNavItem>
            <Link to="/axe" style={{ textDecoration: 'none' }}>
              <CNavLink>Liste des cars</CNavLink>
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/axe_conducteurs" style={{ textDecoration: 'none' }}>
              <CNavLink active>Listes des assignations des cars pour un axe</CNavLink>
            </Link>
          </CNavItem>
        </CNav>
        
      <CCardBody>
        {/* Champ de recherche unique */}
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            placeholder="Rechercher par nom de l'axe, du conducteur ou de la voiture"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>

        {/* Tableau des résultats filtrés */}
        <CTable bordered responsive borderColor="primary">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Nom de l'Axe</CTableHeaderCell>
              <CTableHeaderCell>Nom du Conducteur</CTableHeaderCell>
              <CTableHeaderCell>Nom de la Voiture</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((item) => (
              <CTableRow key={`${item.axe_id}-${item.conducteur_id}-${item.car_id}`}>
                <CTableDataCell>{item.nom_axe}</CTableDataCell>
                <CTableDataCell>{item.nom_conducteur}</CTableDataCell>
                <CTableDataCell>{item.nom_car}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/conducteurs/assignation/${item.id}`}>
                    <CButton color="warning" variant="outline">
                      <CIcon icon={cilPencil} /> Modifier l'assignation
                    </CButton>
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default Axe_conducteurs_cars_list;
