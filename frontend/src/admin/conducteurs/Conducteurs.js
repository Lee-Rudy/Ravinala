import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CTable, CTableHead, 
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow, CAlert, CPagination, 
  CPaginationItem, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CInputGroupText,
  CInputGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle,cilMagnifyingGlass } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';



const Conducteurs = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [conducteurs, setConducteurs] = useState({
    nom: '', date_naissance: '', adresse: '', contact: '', mail: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [conducteursList, setConducteursList] = useState([]);
  const [filteredConducteurs, setFilteredConducteurs] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [mode, setMode] = useState('add');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Contrôle de la visibilité du modal

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch conducteurs list
  useEffect(() => {
    fetchConducteurs();
  }, []);

  useEffect(() => {
    const filtered = conducteursList.filter(conducteur => 
      conducteur.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConducteurs(filtered);
  }, [searchTerm, conducteursList]);

  const fetchConducteurs = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/conducteurs/liste`);
      setConducteursList(response.data);
      setFilteredConducteurs(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des données.');
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const formErrors = validateForm();
    setFormErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        if (mode === 'add') {
          await axios.post(`${baseURL}/api/conducteurs/ajout`, conducteurs);
          alert('Conducteur ajouté avec succès');
        } else {
          await axios.put(`${baseURL}/api/conducteurs/update/${editingId}`, conducteurs);
          alert('Conducteur mis à jour avec succès');
          setMode('add');
          setEditingId(null);
        }
        resetForm();
        fetchConducteurs();
        setIsModalVisible(false); // Masquer le modal après soumission
      } catch (err) {
        handleError(err);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!conducteurs.nom) errors.nom = 'Le nom est obligatoire.*';
    if (!conducteurs.date_naissance) errors.date_naissance = 'La date de naissance est obligatoire.*';
    if (!conducteurs.contact) errors.contact = 'Le contact est obligatoire.*';
    if (!conducteurs.adresse) errors.adresse = "L'adresse est obligatoire.*";
    return errors;
  };

  const handleError = (err) => {
    if (err.response) {
      setError(err.response.data.errors);
    } else {
      setError("Erreur du serveur !");
    }
  };

  const resetForm = () => {
    setConducteurs({ nom: '', date_naissance: '', adresse: '', contact: '', mail: '' });
    setSuccess(false);
    setEditingId(null);
  };

  // Handle Edit
  const handleEdit = (id) => {
    const selectedConducteur = conducteursList.find((conducteur) => conducteur.id === id);
    setConducteurs(selectedConducteur);
    setEditingId(id);
    setMode('edit');
    setIsModalVisible(true); // Afficher le modal lors de l'édition
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce conducteur?")) {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        await axios.delete(`${baseURL}/api/conducteurs/delete/${id}`);
        setConducteursList(conducteursList.filter((conducteur) => conducteur.id !== id));
        alert('Conducteur supprimé avec succès');
      } catch (err) {
        handleError(err);
      }
    }
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard>
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Liste des Chauffeurs</strong>
              <CButton
                color="primary"
                onClick={() => {
                  setIsModalVisible(true); // show modal add
                  resetForm();
                }}
                className="float-end"
              >
                + Ajouter un Chauffeur
              </CButton>

              <Link to="/conducteurs/assignation">
              <CButton
                color="secondary"
                className="float-end" style={{marginRight:'5px'}}
              >
                Créer une assignation
              </CButton>
              </Link>
            </CCardHeader>

            

              <CInputGroup className="mt-3" style={{ maxWidth: '400px', marginLeft:'15px' }}>
              <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Rechercher par nom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CInputGroup>
            <CCardBody>
              {error && <CAlert color="danger">{error}</CAlert>}
              <CTable bordered borderColor="primary">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Nom</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Date de naissance</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Contact</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Adresse</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Mail</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Options</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredConducteurs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((conducteur) => (
                    <CTableRow key={conducteur.id}>
                      <CTableDataCell className="text-center">{conducteur.nom}</CTableDataCell>
                      <CTableDataCell className="text-center">{conducteur.date_naissance ? conducteur.date_naissance.slice(0,10) : ''}</CTableDataCell>
                      <CTableDataCell className="text-center">{conducteur.contact}</CTableDataCell>
                      <CTableDataCell className="text-center">{conducteur.adresse}</CTableDataCell>
                      <CTableDataCell className="text-center">{conducteur.mail}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="warning" onClick={() => handleEdit(conducteur.id)} className="me-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </CButton>
                        <CButton color="danger" onClick={() => handleDelete(conducteur.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination aria-label="Page navigation example" className="mt-4">
            {/* Bouton Précédent */}
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </CPaginationItem>

            {/* Pages Numérotées */}
            {[...Array(Math.ceil(filteredConducteurs.length / itemsPerPage)).keys()].map((number) => (
              <CPaginationItem
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => setCurrentPage(number + 1)}
              >
                {number + 1}
              </CPaginationItem>
            ))}

            {/* Bouton Suivant */}
            <CPaginationItem
              disabled={currentPage === Math.ceil(filteredConducteurs.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </CPaginationItem>
          </CPagination>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal Form */}
      <CModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          resetForm();
        }}
      >
        <CModalHeader>
          <CModalTitle>{mode === 'add' ? 'Ajouter' : 'Modifier'} un Chauffeur</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {success && (
            <CAlert color="success" className="d-flex align-items-center">
              <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
              <div>Opération réussie</div>
            </CAlert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="nom">Nom et prénom complet</CFormLabel>
              <CFormInput
                type="text"
                id="nom"
                value={conducteurs.nom}
                onChange={(e) => setConducteurs({ ...conducteurs, nom: e.target.value })}
                placeholder="saisir le nom complet du chauffeur"
                invalid={formErrors.nom}
              />
              {formErrors.nom && <span className="text-danger">{formErrors.nom}</span>}
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="date_naissance">Date de naissance</CFormLabel>
              <CFormInput
                type="date"
                id="date_naissance"
                value={conducteurs.date_naissance}
                onChange={(e) => setConducteurs({ ...conducteurs, date_naissance: e.target.value })}
                invalid={formErrors.date_naissance}
              />
              {formErrors.date_naissance && <span className="text-danger">{formErrors.date_naissance}</span>}
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="contact">Numéro de contact</CFormLabel>
              <CFormInput
                type="text"
                id="contact"
                value={conducteurs.contact}
                onChange={(e) => setConducteurs({ ...conducteurs, contact: e.target.value })}
                placeholder="saisir le numéro de contact"
                invalid={formErrors.contact}
              />
              {formErrors.contact && <span className="text-danger">{formErrors.contact}</span>}
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="adresse">Adresse</CFormLabel>
              <CFormInput
                type="text"
                id="adresse"
                value={conducteurs.adresse}
                onChange={(e) => setConducteurs({ ...conducteurs, adresse: e.target.value })}
                placeholder="saisir l'adresse"
                invalid={formErrors.adresse}
              />
              {formErrors.adresse && <span className="text-danger">{formErrors.adresse}</span>}
            </div>

            <div className="mb-3">
                    <CFormLabel htmlFor="mail">Mail</CFormLabel>
                    <CFormInput
                      id="mail"
                      value={conducteurs.mail}
                      onChange={(e) => setConducteurs({ ...conducteurs, mail: e.target.value })}
                      placeholder="example@ravinala.com | mail n'est pas obligatoire"
                    />
             </div>

            <CModalFooter>
              <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
                Fermer
              </CButton>
              <CButton color="primary" type="submit">
                {mode === 'add' ? 'Ajouter' : 'Mettre à jour'}
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>
    </>
  );
};

export default Conducteurs;
