import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow,
  CPagination, CPaginationItem, CBadge, CFormInput, CFormLabel, CFormSelect,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,CInputGroupText,
  CInputGroup,CDropdownItem,CDropdownMenu,CDropdownToggle,CDropdown
  
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

import { Link } from 'react-router-dom';



const UsagersList = () => {
  const [error, setError] = useState('');
  const [usagersList, setUsagersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRamassage, setFilterRamassage] = useState('');
  const [filterDepot, setFilterDepot] = useState('');
  const [selectedUsager, setSelectedUsager] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Limite de la pagination
  const itemsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    fetchUsagers();
  }, []);

  const fetchUsagers = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/usagers/liste_usagers_ramassage_depot`);
      console.log(response.data);
      setUsagersList(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des données.');
    }
  };

  // Filtrage par recherche
  const filteredUsagers = usagersList.filter((usager) => {
    const searchFilter = 
      (usager.matricule && usager.matricule.includes(searchTerm)) ||
      (usager.nom && usager.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.prenom && usager.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.axeRamassage && usager.axeRamassage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return searchFilter;
  });
  
  // Appliquer les filtres de statut sur la liste déjà filtrée
  const finalFilteredUsagers = filteredUsagers.filter((usager) => {
    const ramassageFilter = filterRamassage ? usager.estActifRamassage === (filterRamassage === 'Actif') : true;
    const depotFilter = filterDepot ? usager.estActifDepot === (filterDepot === 'Actif') : true;
    
    return ramassageFilter && depotFilter;
  });

  // Pagination
  const paginatedUsagers = finalFilteredUsagers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleUsagerClick = (usager) => {
    setSelectedUsager(usager);
    setModalVisible(true);
  };
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>Liste des Usagers</strong>
            </CCardHeader>
            <CCardBody>
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Barre de recherche */}
              <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
              <div className="ms-auto">
              <Link to="/usagers/add">
              <CButton color="primary">
                + Ajouter un usager
              </CButton>
            </Link>
              </div>
            </div>
                <CFormLabel htmlFor="search">Rechercher : matricule | nom & prénom | axe</CFormLabel>
                <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilMagnifyingGlass} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  id="search"
                  placeholder="Rechercher par matricule, nom, prénom ou axe"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
              </div>

              {/* Filtres par statut */}
              <CRow className="mb-3">
                <CCol>
                  <div className="mb-3">
                    <CFormLabel htmlFor="filterRamassage">Filtrer par statut ramassage</CFormLabel>
                    <CFormSelect
                      id="filterRamassage"
                      value={filterRamassage}
                      onChange={(e) => setFilterRamassage(e.target.value)}
                    >
                      <option value="">Filtrer par statut ramassage</option>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol>
                  <div className="mb-3">
                    <CFormLabel htmlFor="filterDepot">Filtrer par statut dépôt</CFormLabel>
                    <CFormSelect
                      id="filterDepot"
                      value={filterDepot}
                      onChange={(e) => setFilterDepot(e.target.value)}
                    >
                      <option value="">Filtrer par statut dépôt</option>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CTable bordered borderColor="primary">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom et prénom</CTableHeaderCell>
                    <CTableHeaderCell>Axe ramassage</CTableHeaderCell>
                    <CTableHeaderCell>Axe dépôt</CTableHeaderCell>
                    <CTableHeaderCell>Statut Ramassage</CTableHeaderCell>
                    <CTableHeaderCell>Statut Dépôt</CTableHeaderCell>
                    <CTableHeaderCell>Affectation</CTableHeaderCell>

                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {paginatedUsagers.map((usager) => (
                    <CTableRow key={usager.usagerId}>
                      <CTableDataCell
                      onClick={() => handleUsagerClick(usager)}
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // surligneure
                      onMouseOver={(e) => e.currentTarget.style.color = 'darkblue'} // survol color 
                      onMouseOut={(e) => e.currentTarget.style.color = 'blue'}
                      >
                        {usager.matricule}
                      </CTableDataCell>
                      <CTableDataCell>{usager.nom} {usager.prenom}</CTableDataCell>
                      <CTableDataCell>{usager.axeRamassage || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{usager.axeDepot || 'N/A'}</CTableDataCell>


                      {/* Statut Ramassage avec badge */}
                      <CTableDataCell>
                        <CBadge color={usager.estActifRamassage ? 'success' : 'warning'}>
                          {usager.estActifRamassage ? 'Actif' : 'Inactif'}
                        </CBadge>
                      </CTableDataCell>

                      {/* Statut Dépôt avec badge */}
                      <CTableDataCell>
                        <CBadge color={usager.estActifDepot ? 'success' : 'warning'}>
                          {usager.estActifDepot ? 'Actif' : 'Inactif'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                      <CDropdown>
                        <CDropdownToggle className="btn btn-outline-secondary">Affecter</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem>
                            
                          <Link 
                          to={`/usagers/affecter_ramassage/${usager.usagerId}`} 
                          style={{ textDecoration: 'none' }}>
                          Ramassage
                        </Link>
                          </CDropdownItem>
                          <CDropdownItem>
                          
                          <Link 
                          to={`/usagers/affecter_depot/${usager.usagerId}`} 
                          style={{ textDecoration: 'none' }}>
                          Dépôt
                        </Link>
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>



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
                {[...Array(Math.ceil(finalFilteredUsagers.length / itemsPerPage))].map((_, idx) => (
                  <CPaginationItem
                    key={idx}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(finalFilteredUsagers.length / itemsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </CPaginationItem>
              </CPagination>

              {/* Modal pour afficher les informations de l'usager */}
              <CModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                aria-labelledby="usagerDetailsLabel"
              >
                <CModalHeader>
                  <CModalTitle id="usagerDetailsLabel">Détails de l'usager</CModalTitle>
                </CModalHeader>
                <CModalBody>
                {selectedUsager ? (
                  <div className="usager-details">
                    <style>
                      {`
                        .usager-details {
                          margin: 10px 0;
                        }

                        .usager-details h5 {
                          font-weight: bold;
                          margin-bottom: 15px;
                        }

                        .usager-details li {
                          padding: 5px 0;
                          border-bottom: 1px solid #e9ecef; /* Ligne de séparation */
                        }

                        .usager-details li:last-child {
                          border-bottom: none; /* Enlever la ligne de séparation pour le dernier élément */
                        }
                      `}
                    </style>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Matricule :</strong> {selectedUsager.matricule}
                      </li>
                      <li>
                        <strong>Nom :</strong> {selectedUsager.nom}
                      </li>
                      <li>
                        <strong>Prénom :</strong> {selectedUsager.prenom}
                      </li>
                      <li>
                        <strong>Adresse :</strong> {selectedUsager.adresse}
                      </li>
                      <li>
                        <strong>Email :</strong> {selectedUsager.mail_ravinala}
                      </li>
                      <li>
                        <strong>Contact :</strong> {selectedUsager.contact}
                      </li>

                      <li>
                        <strong>Genre :</strong> {selectedUsager.genre}
                      </li>
                      <li>
                        <strong>Poste :</strong> {selectedUsager.poste}
                      </li>
                      <li>
                        <strong>Direction :</strong> {selectedUsager.departement}
                      </li>

                      <br></br>

                      <p>-------------------------------------------------------------</p>
                      <li>
                        <strong>Axe Ramassage :</strong> {selectedUsager.axeRamassage}
                      </li>
                      <li>
                        <strong>Heure Ramassage :</strong> {selectedUsager.heureRamassage}
                      </li>
                      <li>
                        <strong>Lieu Ramassage :</strong> {selectedUsager.lieuRamassage}
                      </li>
                      <li>
                        <strong>District Ramassage :</strong> {selectedUsager.districtRamassage}
                      </li>
                      <li>
                        <strong>Fokontany Ramassage :</strong> {selectedUsager.fokontanyRamassage}
                      </li>

                      <br></br>

                      <p>-------------------------------------------------------------</p>
                      <li>
                        <strong>Axe Dépôt :</strong> {selectedUsager.axeDepot}
                      </li>
                      <li>
                        <strong>Heure Dépôt :</strong> {selectedUsager.heureDepot}
                      </li>
                      <li>
                        <strong>Lieu Dépôt :</strong> {selectedUsager.lieuDepot}
                      </li>
                      <li>
                        <strong>District Dépôt :</strong> {selectedUsager.districtDepot}
                      </li>
                      <li>
                        <strong>Fokontany Dépôt :</strong> {selectedUsager.fokontanyDepot}
                      </li>
                    </ul>
                  </div>
                ) : (
                  <p>Aucun détail disponible.</p>
                )}
              </CModalBody>


                <CModalFooter>
                  <CButton color="secondary" onClick={() => setModalVisible(false)}>Fermer</CButton>

                </CModalFooter>
              </CModal>

              

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default UsagersList;
