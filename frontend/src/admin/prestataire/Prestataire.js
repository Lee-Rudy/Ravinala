import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPaginationItem,
  CPagination,
  CFormLabel,
  CButton,
  CForm,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass, cilPencil } from '@coreui/icons';


const Prestataire = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [debutContrat, setDebutContrat] = useState('');
  const [finContrat, setFinContrat] = useState('');
  const [nomPrestataire, setNomPrestataire] = useState('');
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fonction pour récupérer les prestataires
  const fetchPrestataires = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/prestataire/liste`);
      setPrestataires(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestataires :", error);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  // Fonction pour ajouter ou mettre à jour un prestataire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id: selectedPrestataire, // Assurez-vous d'inclure l'ID ici pour l'update
      prestataire: nomPrestataire,
      debut_contrat: debutContrat,
      fin_contrat: finContrat,
    };
  
    try {
      if (selectedPrestataire) {
        console.log("selectedPrestataire ID pour update:", selectedPrestataire);
        await axios.put(`${baseURL}/api/prestataire/update/${selectedPrestataire}`, data);
      } else {
        await axios.post(`${baseURL}/api/prestataire/ajouter`, data);
      }
      resetForm();
      fetchPrestataires(); // Recharger les données
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la mise à jour du prestataire :", error.response?.data || error);
    }
  };
  
  

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setNomPrestataire('');
    setDebutContrat('');
    setFinContrat('');
    setSelectedPrestataire(null);
  };

  // Fonction pour préremplir le formulaire avec les données d'un prestataire à mettre à jour
  const handleEdit = async (prestataire) => {
    try {
      const response = await axios.get(`${baseURL}/api/prestataire/liste/${prestataire.id}`);
      const data = response.data;
      
      setSelectedPrestataire(data.id);
      setNomPrestataire(data.prestataire);
      setDebutContrat(data.debut_contrat ? data.debut_contrat.slice(0, 10) : ''); // Format YYYY-MM-DD
      setFinContrat(data.fin_contrat ? data.fin_contrat.slice(0, 10) : '');       // Format YYYY-MM-DD
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du prestataire :", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prestataires.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(prestataires.length / itemsPerPage);

  return (
    <CCard>
      <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
        <h5>Gestion des Prestataires</h5>
      </CCardHeader>
      <CCardBody>
        {/* Formulaire d'insertion/mise à jour */}
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3 align-items-end">
            <CCol md={3}>
              <CFormLabel htmlFor="axe">Nom du prestataire</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Saisir le nom"
                value={nomPrestataire}
                onChange={(e) => setNomPrestataire(e.target.value)}
                required
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="axe">Contrat début</CFormLabel>
              <CFormInput
                type="date"
                placeholder="Début Contrat"
                value={debutContrat}
                onChange={(e) => setDebutContrat(e.target.value)}
                required
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="axe">Contrat fin</CFormLabel>
              <CFormInput
                type="date"
                placeholder="Fin Contrat"
                value={finContrat}
                onChange={(e) => setFinContrat(e.target.value)}
                required
              />
            </CCol>
            <CCol md={3} className="d-flex align-items-end gap-2">
            <CButton type="submit" color="primary">
                {selectedPrestataire ? 'Mettre à jour' : ' + Ajouter'}
            </CButton>
            {selectedPrestataire && (
                <CButton color="secondary" onClick={resetForm}>
                Annuler
                </CButton>
            )}
            </CCol>

          </CRow>
        </CForm>

        {/* Tableau des prestataires */}
        <CTable bordered borderColor='primary' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="text-center">Nom du Prestataire</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Début Contrat</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Fin Contrat</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((prestataire) => (
              <CTableRow key={prestataire.id}>
                <CTableDataCell className="text-center">{prestataire.prestataire}</CTableDataCell>
                <CTableDataCell className="text-center">{prestataire.debut_contrat ? prestataire.debut_contrat.slice(0, 10) : ''}</CTableDataCell>
                <CTableDataCell className="text-center">{prestataire.fin_contrat ? prestataire.fin_contrat.slice(0, 10) : ''}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color="warning" onClick={() => handleEdit(prestataire)} className="me-2">
                  <CIcon icon={cilPencil} />Modifier
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        <CPagination align="center" className="mt-3">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Précédent
          </CPaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <CPaginationItem
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Suivant
          </CPaginationItem>
        </CPagination>
      </CCardBody>
    </CCard>
  );
};

export default Prestataire;
