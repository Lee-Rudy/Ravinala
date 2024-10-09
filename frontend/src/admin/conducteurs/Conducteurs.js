import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CTable, CTableHead, 
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow, CAlert, CPagination, 
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle } from '@coreui/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Conducteurs = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [conducteurs, setConducteurs] = useState({
    nom: '', date_naissance: '', adresse: '', contact: '', mail: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [conducteursList, setConducteursList] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which conducteur is being edited
  const [mode, setMode] = useState('add'); // 'add' or 'edit'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  //limit page of pagination
  const itemsPerPage = 5;

  // Fetch conducteurs list
  useEffect(() => {
    fetchConducteurs();
  }, []);

  const fetchConducteurs = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/conducteurs/liste`);
      setConducteursList(response.data);
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
          setMode('add'); // Switch back to add mode
          setEditingId(null);
        }
        resetForm();
        fetchConducteurs(); // Refresh list
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
        <CCol xs={5}>
          <CCard>
            <CCardHeader>
              <strong>{mode === 'add' ? 'Ajouter' : 'Modifier'} un Chauffeur</strong>
            </CCardHeader>
            <CCardBody>
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
                    invalid={formErrors.nom ? true : false}
                  />
                  {formErrors.nom && <div className="invalid-feedback">{formErrors.nom}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="date_naissance">Date de naissance</CFormLabel>
                  <CFormInput
                    type="date"
                    id="date_naissance"
                    value={conducteurs.date_naissance}
                    onChange={(e) => setConducteurs({ ...conducteurs, date_naissance: e.target.value })}
                    invalid={formErrors.date_naissance ? true : false}
                  />
                  {formErrors.date_naissance && <div className="invalid-feedback">{formErrors.date_naissance}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="adresse">Adresse</CFormLabel>
                  <CFormInput
                    type="text"
                    id="adresse"
                    value={conducteurs.adresse}
                    onChange={(e) => setConducteurs({ ...conducteurs, adresse: e.target.value })}
                    placeholder="saisir l'adresse deu chauffeur"
                    invalid={formErrors.adresse ? true : false}
                  />
                  {formErrors.adresse && <div className="invalid-feedback">{formErrors.adresse}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="contact">Contact</CFormLabel>
                  <CFormInput
                    type="text"
                    id="contact"
                    value={conducteurs.contact}
                    onChange={(e) => setConducteurs({ ...conducteurs, contact: e.target.value })}
                    placeholder="saisir le contact du chauffeur"
                    invalid={formErrors.contact ? true : false}
                  />
                  {formErrors.contact && <div className="invalid-feedback">{formErrors.contact}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="mail">Mail</CFormLabel>
                  <CFormInput
                    type="email"
                    id="mail"
                    value={conducteurs.mail}
                    onChange={(e) => setConducteurs({ ...conducteurs, mail: e.target.value })}
                    placeholder="example@ravinala.com | mail n'est pas obligatoire"
                  />
                </div>

                <CButton type="submit" color={mode === 'add' ? 'success' : 'primary'}>
                  {mode === 'add' ? 'Ajouter' : 'Mettre à jour'} ce chauffeur
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={7}>
          <CTable bordered borderColor="primary">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                <CTableHeaderCell scope="col">Adresse</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mail</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {conducteursList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((conducteur) => (
                <CTableRow key={conducteur.id}>
                  <CTableDataCell>
                  <CButton color="warning" size="sm" className="m-1" onClick={() => handleEdit(conducteur.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </CButton>
                  <CButton color="danger" size="sm" className="m-1" onClick={() => handleDelete(conducteur.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </CButton>
                </CTableDataCell>
                  <CTableDataCell>{conducteur.nom}</CTableDataCell>
                  <CTableDataCell>{conducteur.contact}</CTableDataCell>
                  <CTableDataCell>{conducteur.adresse}</CTableDataCell>
                  <CTableDataCell>{conducteur.mail}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CPagination aria-label="Page navigation example">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Précédent
            </CPaginationItem>
            {[...Array(Math.ceil(conducteursList.length / itemsPerPage))].map((_, idx) => (
              <CPaginationItem
                key={idx}
                active={currentPage === idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(conducteursList.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </>
  );
};

export default Conducteurs;