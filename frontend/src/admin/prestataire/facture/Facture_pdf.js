// src/components/Facture_pdf.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CAlert,
  CSpinner,
  CFormInput,
  CFormLabel,
  CForm,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilSearch,
  cilArrowLeft,
  cilArrowRight,
  cilCloudDownload,
  cilPlus,
  cilFolderOpen,
  cilTrash,
  cilEnvelopeOpen,
} from '@coreui/icons';
import { useNavigate, Link } from 'react-router-dom';

const Facture_pdf = () => {
  const [factures, setFactures] = useState([]);
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [viewPdf, setViewPdf] = useState(null); // pour la visualisation du PDF

  // États pour la recherche
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Vous pouvez ajuster le nombre d'éléments par page

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fonction pour récupérer la liste des factures
  const fetchFactures = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/facturations/liste/pdf`);
      setFactures(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des factures.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  // Fonction pour gérer la sélection des factures
  const handleSelectFacture = (numero_facture) => {
    if (selectedFactures.includes(numero_facture)) {
      setSelectedFactures(selectedFactures.filter((nf) => nf !== numero_facture));
    } else {
      setSelectedFactures([...selectedFactures, numero_facture]);
    }
  };

  // Fonction pour sélectionner/désélectionner toutes les factures
  const handleSelectAll = () => {
    if (selectedFactures.length === filteredFactures.length) {
      setSelectedFactures([]);
    } else {
      const allFactures = filteredFactures.map((facture) => facture.numero_facture);
      setSelectedFactures(allFactures);
    }
  };

  // Fonction pour supprimer les factures sélectionnées
  const deleteFactures = async () => {
    try {
      await axios.delete(`${baseURL}/api/facturations/supprimer_par_numero_facture`, {
        params: { numeroFactures: selectedFactures },
      });
      setSuccessMessage('Factures supprimées avec succès.');
      setSelectedFactures([]);
      fetchFactures();
    } catch (err) {
      setError('Erreur lors de la suppression des factures.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Fonction pour visualiser le PDF
  const viewPdfHandler = (importPdf) => {
    if (!importPdf) {
      setError('PDF non disponible.');
      return;
    }
    // Supposons que importPdf est une chaîne encodée en base64
    const byteCharacters = atob(importPdf);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    setViewPdf(blobUrl);
  };

  // Fonction pour télécharger le PDF
  const downloadPdfHandler = (numero_facture, importPdf) => {
    if (!importPdf) {
      setError('PDF non disponible.');
      return;
    }
    const byteCharacters = atob(importPdf);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${numero_facture}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Réinitialiser à la première page lors de la recherche
  };

  // Filtrer les factures en fonction de la recherche
  const filteredFactures = factures
    .filter((facture) =>
      facture.numero_facture.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((facture) =>
      searchDate ? new Date(facture.date_emission).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true
    )
    .sort((a, b) => new Date(b.date_emission) - new Date(a.date_emission)); // Tri par date décroissante

  // Calculer les factures à afficher pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFactures = filteredFactures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFactures.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#45B48E', color: 'white' }}>
            <h4>Liste des Factures PDF</h4>
            <div>
              <CButton color="danger" disabled={selectedFactures.length === 0} onClick={() => setShowDeleteConfirm(true)} style={{color:'white'}}>
                <CIcon icon={cilTrash} className="me-2"  style={{color:'white'}}/>
                Supprimer
              </CButton>
              <Link to="/facture">
                <CButton color="primary" className="ms-2">
                  <CIcon icon={cilPlus} className="me-2" />
                  Ajouter une Facture
                </CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            {/* Section de Recherche */}
            <CForm onSubmit={handleSearch} className="mb-3">
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="searchName">Nom du facture</CFormLabel>
                  <CFormInput
                    type="text"
                    id="searchName"
                    placeholder="Rechercher par nom..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="searchDate">Date d'Émission</CFormLabel>
                  <CFormInput
                    type="date"
                    id="searchDate"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                  />
                </CCol>
                <CCol md={4} className="d-flex align-items-end">
                  <CButton type="submit" color="primary" className="me-2">
                    <CIcon icon={cilSearch} className="me-1" />
                    Rechercher
                  </CButton>
                  <CButton
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setSearchName('');
                      setSearchDate('');
                      setCurrentPage(1);
                    }}
                  >
                    Réinitialiser
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <CSpinner color="primary" />
              </div>
            ) : error ? (
              <CAlert color="danger">{error}</CAlert>
            ) : filteredFactures.length === 0 ? (
              <CAlert color="info">Aucune facture disponible.</CAlert>
            ) : (
              <>
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        <CFormCheck
                          checked={selectedFactures.length === filteredFactures.length && filteredFactures.length > 0}
                          onChange={handleSelectAll}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Numéro de Facture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date d'Émission</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Type de Contrat</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentFactures.map((facture) => (
                      <CTableRow key={facture.id}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={selectedFactures.includes(facture.numero_facture)}
                            onChange={() => handleSelectFacture(facture.numero_facture)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{facture.numero_facture}</CTableDataCell>
                        <CTableDataCell>{new Date(facture.date_emission).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={facture.contrat_type.toLowerCase() === 'contractuelle' ? 'primary' : 'warning'}>
                            {facture.contrat_type.charAt(0).toUpperCase() + facture.contrat_type.slice(1)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            size="sm"
                            className="me-2"
                            onClick={() => viewPdfHandler(facture.importPdf)}
                            disabled={!facture.importPdf}
                            title="Visionner le PDF"
                          >
                            <CIcon icon={cilEnvelopeOpen} style={{color:'white'}} />
                          </CButton>
                          <CButton
                            color="success"
                            size="sm"
                            onClick={() => downloadPdfHandler(facture.numero_facture, facture.importPdf)}
                            disabled={!facture.importPdf}
                            title="Télécharger le PDF"
                          >
                            <CIcon icon={cilCloudDownload} style={{color:'white'}} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CPagination aria-label="Pagination" className="mt-3">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <CIcon icon={cilArrowLeft} />
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <CPaginationItem
                        key={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <CIcon icon={cilArrowRight} />
                    </CPaginationItem>
                  </CPagination>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Alert de succès */}
      {successMessage && (
        <CAlert color="success" className="mt-3" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </CAlert>
      )}

      {/* Modal de confirmation de suppression */}
      <CModal visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} color="danger">
        <CModalHeader>
          <h5>Confirmer la Suppression</h5>
        </CModalHeader>
        <CModalBody>
          Êtes-vous sûr de vouloir supprimer les factures sélectionnées ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={deleteFactures}>
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour visualiser le PDF */}
      <CModal visible={viewPdf !== null} onClose={() => setViewPdf(null)} size="xl">
        <CModalHeader>
          <h5>Visualisation du PDF</h5>
        </CModalHeader>
        <CModalBody>
          {viewPdf ? (
            <iframe
              src={viewPdf}
              title="PDF Viewer"
              width="100%"
              height="480px"
            ></iframe>
          ) : (
            <CAlert color="danger">PDF non disponible.</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewPdf(null)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Facture_pdf;
