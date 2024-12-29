import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow,
  CPagination, CPaginationItem, CBadge, CFormInput, CFormLabel, CFormSelect,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,CInputGroupText,
  CInputGroup,CDropdownItem,CDropdownMenu,CDropdownToggle,CDropdown
  
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
  cilMagnifyingGlass
} from '@coreui/icons'

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

 
  const filteredUsagers = usagersList.filter((usager) => {
    const searchFilter = 
      (usager.matricule && usager.matricule.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.nom && usager.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.prenom && usager.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.axeRamassage && usager.axeRamassage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return searchFilter;
  });
  
  
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
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
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

              <CTable bordered borderColor="primary" className="mt-4">
            <CTableHead style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <CTableRow>
                <CTableHeaderCell className="text-center">Matricule</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nom et prénom</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Axe ramassage</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Axe dépôt</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Statut Ramassage</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Statut Dépôt</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Affectation</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedUsagers.map((usager, index) => (
                <CTableRow
                  key={usager.usagerId}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Matricule avec surbrillance au survol */}
                  <CTableDataCell
                    className="text-center"
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'darkblue')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                    onClick={() => handleUsagerClick(usager)}
                  >
                    {usager.matricule}
                  </CTableDataCell>

                  {/* Nom et Prénom */}
                  <CTableDataCell className="text-center">
                    {usager.nom} {usager.prenom}
                  </CTableDataCell>

                  {/* Axe Ramassage */}
                  <CTableDataCell className="text-center">{usager.axeRamassage || 'N/A'}</CTableDataCell>

                  {/* Axe Dépôt */}
                  <CTableDataCell className="text-center">{usager.axeDepot || 'N/A'}</CTableDataCell>

                  {/* Statut Ramassage avec Badge */}
                  <CTableDataCell className="text-center">
                    <CBadge color={usager.estActifRamassage ? 'success' : 'warning'}>
                      {usager.estActifRamassage ? 'Actif' : 'Inactif'}
                    </CBadge>
                  </CTableDataCell>

                  {/* Statut Dépôt avec Badge */}
                  <CTableDataCell className="text-center">
                    <CBadge color={usager.estActifDepot ? 'success' : 'warning'}>
                      {usager.estActifDepot ? 'Actif' : 'Inactif'}
                    </CBadge>
                  </CTableDataCell>

                  {/* Affectation */}
                  <CTableDataCell className="text-center">
                    <CDropdown>
                    {/* caret={false} // Désactive la flèche */}
                      <CDropdownToggle className="btn btn-outline-secondary" caret={false}>Affecter</CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem>
                          <Link
                            to={`/usagers/affecter_ramassage/${usager.usagerId}`}
                            style={{ textDecoration: 'none', color: '#212529' }}
                          >
                            Ramassage
                          </Link>
                        </CDropdownItem>
                        <CDropdownItem>
                          <Link
                            to={`/usagers/affecter_depot/${usager.usagerId}`}
                            style={{ textDecoration: 'none', color: '#212529' }}
                          >
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
              <CPagination aria-label="Pagination"  style={{ cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
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
              <CModalHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                <CModalTitle id="usagerDetailsLabel">
                  <i className="bi bi-person-fill me-2"></i>Détails de l'usager
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                {selectedUsager ? (
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
                        <strong>Matricule :</strong> {selectedUsager.matricule}
                      </li>
                      <li>
                        <i className="bi bi-person-fill"></i>
                        <strong>Nom :</strong> {selectedUsager.nom}
                      </li>
                      <li>
                        <i className="bi bi-person"></i>
                        <strong>Prénom :</strong> {selectedUsager.prenom}
                      </li>
                      <li>
                        <i className="bi bi-geo-alt"></i>
                        <strong>Adresse :</strong> {selectedUsager.adresse}
                      </li>
                      <li>
                        <i className="bi bi-envelope"></i>
                        <strong>Email :</strong> {selectedUsager.mail_ravinala}
                      </li>
                      <li>
                        <i className="bi bi-telephone"></i>
                        <strong>Contact :</strong> {selectedUsager.contact}
                      </li>
                      <li>
                        <i className="bi bi-gender-ambiguous"></i>
                        <strong>Genre :</strong> {selectedUsager.genre}
                      </li>
                      <li>
                        <i className="bi bi-briefcase-fill"></i>
                        <strong>Poste :</strong> {selectedUsager.poste}
                      </li>
                      <li>
                        <i className="bi bi-building"></i>
                        <strong>Direction :</strong> {selectedUsager.departement}
                      </li>
                    </ul>

                    <p>-------------------------------------</p>

                    <ul>
                      <li>
                        <i className="bi bi-truck"></i>
                        <strong>Axe Ramassage :</strong> {selectedUsager.axeRamassage}
                      </li>
                      <li>
                        <i className="bi bi-clock"></i>
                        <strong>Heure Ramassage:</strong> {selectedUsager.heureRamassage}
                      </li>
                      <li>
                        <i className="bi bi-geo-alt"></i>
                        <strong>Lieu Ramassage :</strong> {selectedUsager.lieuRamassage}
                      </li>
                      <li>
                        <i className="bi bi-map"></i>
                        <strong>District Ramassage:</strong> {selectedUsager.districtRamassage}
                      </li>
                      <li>
                        <i className="bi bi-signpost"></i>
                        <strong>Fokontany Ramassage:</strong> {selectedUsager.fokontanyRamassage}
                      </li>
                    </ul>

                    <p>-------------------------------------</p>

                    <ul>
                      <li>
                        <i className="bi bi-truck"></i>
                        <strong>Axe Dépôt :</strong> {selectedUsager.axeDepot}
                      </li>
                      <li>
                        <i className="bi bi-clock"></i>
                        <strong>Heure Dépôt :</strong> {selectedUsager.heureDepot}
                      </li>
                      <li>
                        <i className="bi bi-geo-alt"></i>
                        <strong>Lieu Dépôt :</strong> {selectedUsager.lieuDepot}
                      </li>
                      <li>
                        <i className="bi bi-map"></i>
                        <strong>District Dépôt :</strong> {selectedUsager.districtDepot}
                      </li>
                      <li>
                        <i className="bi bi-signpost"></i>
                        <strong>Fokontany Dépôt :</strong> {selectedUsager.fokontanyDepot}
                      </li>
                    </ul>
                  </div>
                ) : (
                  <p>Aucun détail disponible.</p>
                )}
              </CModalBody>
              <CModalFooter>
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

export default UsagersList;
