import React, { useState } from 'react';
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
  CFormLabel,
  CButton,
  CForm,
  CFormSelect,
  CAlert,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash } from '@coreui/icons';

const Facture = () => {
  const [nomPrestataire, setNomPrestataire] = useState('');
  const [contratType, setContratType] = useState('');
  const [numeroFacture, setNumeroFacture] = useState('');
  const [dateEmission, setDateEmission] = useState('');
  const [carburants, setCarburants] = useState('');
  const [importPdf, setImportPdf] = useState(null);
  const [prestations, setPrestations] = useState([
    { designation: '', nbrVehicule: '', nbrJour: '', prixUnitaire: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const baseURL = import.meta.env.VITE_API_BASE_URL;

 //add, ajouter
  const ajouterPrestation = () => {
    setPrestations([
      ...prestations,
      { designation: '', nbrVehicule: '', nbrJour: '', prixUnitaire: '' },
    ]);
  };

  //delete
  const supprimerPrestation = (index) => {
    const newPrestations = prestations.filter((_, i) => i !== index);
    setPrestations(newPrestations);
  };

  //edit update
  const modifierPrestation = (index, field, value) => {
    const newPrestations = prestations.map((prestation, i) =>
      i === index ? { ...prestation, [field]: value } : prestation
    );
    setPrestations(newPrestations);
  };

  // Handler pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation basique
    if (
      !nomPrestataire ||
      !contratType ||
      !numeroFacture ||
      !dateEmission ||
      !carburants ||
      prestations.some(
        (prestation) =>
          !prestation.designation ||
          !prestation.nbrVehicule ||
          !prestation.nbrJour ||
          !prestation.prixUnitaire
      )
    ) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const contratData = {
      NomPrestataire: nomPrestataire,
      ContratType: contratType,
      NumeroFacture: numeroFacture,
      DateEmission: dateEmission,
      Carburants: parseFloat(carburants),
      Prestations: prestations.map(p => ({
        Designation: p.designation,
        NbrVehicule: parseInt(p.nbrVehicule, 10),
        NbrJour: parseInt(p.nbrJour, 10),
        PrixUnitaire: parseFloat(p.prixUnitaire),
      })),
    };

    const formData = new FormData();
    formData.append('NomPrestataire', contratData.NomPrestataire);
    formData.append('ContratType', contratData.ContratType);
    formData.append('NumeroFacture', contratData.NumeroFacture);
    formData.append('DateEmission', contratData.DateEmission);
    formData.append('Carburants', contratData.Carburants);

    // Ajouter les prestations au FormData
    contratData.Prestations.forEach((prestation, index) => {
      formData.append(`Prestations[${index}].Designation`, prestation.Designation);
      formData.append(`Prestations[${index}].NbrVehicule`, prestation.NbrVehicule);
      formData.append(`Prestations[${index}].NbrJour`, prestation.NbrJour);
      formData.append(`Prestations[${index}].PrixUnitaire`, prestation.PrixUnitaire);
    });

    // Ajouter le fichier PDF s'il existe
    if (importPdf) {
      formData.append('ImportPdf', importPdf);
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/facturations/ajouter_contrat_et_carburant`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        setSuccess('Contrat et carburant ajoutés avec succès!');
        // Réinitialiser le formulaire, reeset form
        setNomPrestataire('');
        setContratType('');
        setNumeroFacture('');
        setDateEmission('');
        setCarburants('');
        setImportPdf(null);
        setPrestations([{ designation: '', nbrVehicule: '', nbrJour: '', prixUnitaire: '' }]);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // Afficher les détails de l'erreur retournée par le serveur
        const errorDetails = JSON.stringify(error.response.data.errors);
        setError(`Erreur: ${errorDetails}`);
      } else {
        setError("Erreur lors de l'ajout du contrat et du carburant.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
          <strong>Ajouter une facture</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onDismiss={() => setError('')}>
                {error}
              </CAlert>
            )}
            {success && (
              <CAlert color="success" dismissible onDismiss={() => setSuccess('')}>
                {success}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              {/* Informations Générales du Contrat */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="nomPrestataire">Propriété du Prestataire</CFormLabel>
                  <CFormInput
                    id="nomPrestataire"
                    type="text"
                    value={nomPrestataire}
                    onChange={(e) => setNomPrestataire(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="contratType">Type de Contrat</CFormLabel>
                  <CFormSelect
                    id="contratType"
                    value={contratType}
                    onChange={(e) => setContratType(e.target.value)}
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="contractuelle">Contractuelle</option>
                    <option value="extra">Extra</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="numeroFacture">Numéro de Facture</CFormLabel>
                  <CFormInput
                    id="numeroFacture"
                    type="text"
                    value={numeroFacture}
                    onChange={(e) => setNumeroFacture(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="dateEmission">Date d'Émission</CFormLabel>
                  <CFormInput
                    id="dateEmission"
                    type="date"
                    value={dateEmission}
                    onChange={(e) => setDateEmission(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="carburants">Carburants</CFormLabel>
                  <CFormInput
                    id="carburants"
                    type="number"
                    value={carburants}
                    onChange={(e) => setCarburants(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="importPdf">Importer PDF</CFormLabel>
                  <CFormInput
                    id="importPdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setImportPdf(e.target.files[0])}
                  />
                </CCol>
              </CRow>

              {/* Table des Prestations */}
              <CCard className="mb-3">
                <CCardHeader>
                  Prestations
                  <CButton
                    color="primary"
                    size="sm"
                    className="float-end"
                    onClick={ajouterPrestation}
                  >
                    <CIcon icon={cilPlus} /> Ajouter une ligne
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CTable responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Désignation</CTableHeaderCell>
                        <CTableHeaderCell>Nombre de Véhicules</CTableHeaderCell>
                        <CTableHeaderCell>Nombre de Jours</CTableHeaderCell>
                        <CTableHeaderCell>Prix Unitaire</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {prestations.map((prestation, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            <CFormInput
                              type="text"
                              value={prestation.designation}
                              onChange={(e) =>
                                modifierPrestation(index, 'designation', e.target.value)
                              }
                              required
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="number"
                              min="1"
                              value={prestation.nbrVehicule}
                              onChange={(e) =>
                                modifierPrestation(index, 'nbrVehicule', e.target.value)
                              }
                              required
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="number"
                              min="1"
                              value={prestation.nbrJour}
                              onChange={(e) =>
                                modifierPrestation(index, 'nbrJour', e.target.value)
                              }
                              required
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="number"
                              min="0"
                              step="0.01"
                              value={prestation.prixUnitaire}
                              onChange={(e) =>
                                modifierPrestation(index, 'prixUnitaire', e.target.value)
                              }
                              required
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => supprimerPrestation(index)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>

              {/* Bouton de Soumission */}
              <CButton type="submit" color="success" className="text-white" disabled={loading}>
                {loading ? (
                  <>
                    <CSpinner size="sm" /> Envoi...
                  </>
                ) : (
                  'Ajouter la Facture'
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Facture;
