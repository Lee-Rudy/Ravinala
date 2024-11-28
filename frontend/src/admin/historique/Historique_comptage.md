// src/pages/Historique_comptage.jsx

import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilFile, cilCloudUpload } from '@coreui/icons';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correction de l'import

const Historique_comptage = () => {
  // États pour les dates de recherche
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // État pour les données de comptage
  const [comptageData, setComptageData] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fonction pour rechercher les données de comptage
  const fetchComptage = async () => {
    if (!startDate) {
      alert('Veuillez sélectionner une date de début.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/historique/comptage`, {
        params: {
          startDate,
          endDate,
        },
      });
      console.log('Données de comptage reçues:', response.data); // Ajouté pour débogage
      setComptageData(
        Array.isArray(response.data)
          ? response.data.map(comptage => ({
              ...comptage,
              details: Array.isArray(comptage.details) ? comptage.details : [],
            }))
          : []
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des données de comptage:', error);
      alert('Une erreur est survenue lors de la récupération des données.');
    }
    setLoading(false);
  };

  // Fonction pour exporter les données en CSV via le backend
  const exportCSV = async () => {
    if (!startDate) {
      alert('Veuillez sélectionner une date de début.');
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/api/historique/comptage/export/csv`, {
        params: {
          startDate,
          endDate,
        },
        responseType: 'blob', // Important pour le téléchargement de fichiers
      });

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Comptage.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'exportation du CSV:', error);
      alert('Une erreur est survenue lors de l\'exportation du CSV.');
    }
  };

  // Fonction pour exporter les données en PDF côté frontend
  const exportPDF = () => {
    if (comptageData.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }

    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.text('Comptage des Passagers', 14, 22);

    // Période
    doc.setFontSize(12);
    doc.text(`Période : ${startDate} au ${endDate}`, 14, 30);

    // Préparer les données pour le tableau
    const tableColumn = [
      "Matricule",
      "Date",
      "Jour",
      "Ramassage Statut",
      "Dépôt Statut",
      "Total Ramassages Présents",
      "Total Dépôts Présents",
      "Total Présences"
    ];
    const tableRows = [];

    comptageData.forEach(comptage => {
      if (comptage.details && Array.isArray(comptage.details)) {
        comptage.details.forEach(detail => {
          const comptageRow = [
            comptage.matricule,
            new Date(detail.date).toLocaleDateString(),
            detail.jour,
            detail.ramassageStatut,
            detail.depotStatut,
            comptage.totalRamassagePresent,
            comptage.totalDepotPresent,
            comptage.totalPresences,
          ];
          tableRows.push(comptageRow);
        });
      } else {
        // Si aucun détail, ajouter une ligne avec les totaux seulement
        const comptageRow = [
          comptage.matricule,
          '',
          '',
          '',
          '',
          comptage.totalRamassagePresent,
          comptage.totalDepotPresent,
          comptage.totalPresences,
        ];
        tableRows.push(comptageRow);
      }
    });

    // Ajouter le tableau au PDF en utilisant autoTable
    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Télécharger le PDF
    doc.save('Comptage.pdf');
  };

  return (
    <CRow>
      <CCol xs="12" sm="12" md="12">
        <CCard>
          <CCardHeader color="primary" className="text-white d-flex align-items-center">
            <CIcon icon={cilSearch} className="me-2" />
            Recherche de Comptage
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow>
                <CCol md="4" className="mb-3">
                  <CFormLabel htmlFor="startDate">Date de Début</CFormLabel>
                  <CFormInput
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    required
                  />
                </CCol>
                <CCol md="4" className="mb-3">
                  <CFormLabel htmlFor="endDate">Date de Fin</CFormLabel>
                  <CFormInput
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </CCol>
                <CCol md="4" className="d-flex align-items-end mb-3">
                  <CButton color="success" onClick={fetchComptage} className="me-2">
                    <CIcon icon={cilSearch} className="me-2" />
                    Rechercher
                  </CButton>
                  <CButton color="info" onClick={exportCSV} className="me-2">
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    Exporter CSV
                  </CButton>
                  <CButton color="warning" onClick={exportPDF}>
                    <CIcon icon={cilFile} className="me-2" />
                    Exporter PDF
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            <CRow className="mt-4">
              <CCol>
                <CCard color="info" className="text-white">
                  <CCardHeader className="d-flex align-items-center">
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    Exportation CSV
                  </CCardHeader>
                  <CCardBody>
                    <CButton color="light" onClick={exportCSV}>
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      Télécharger CSV
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol>
                <CCard color="warning" className="text-white">
                  <CCardHeader className="d-flex align-items-center">
                    <CIcon icon={cilFile} className="me-2" />
                    Exportation PDF
                  </CCardHeader>
                  <CCardBody>
                    <CButton color="light" onClick={exportPDF}>
                      <CIcon icon={cilFile} className="me-2" />
                      Télécharger PDF
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CTable striped bordered hover className="mt-4">
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Matricule</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Jour</CTableHeaderCell>
                  <CTableHeaderCell>Ramassage</CTableHeaderCell>
                  <CTableHeaderCell>Dépôt</CTableHeaderCell>
                  <CTableHeaderCell>Total Ramassages Présents</CTableHeaderCell>
                  <CTableHeaderCell>Total Dépôts Présents</CTableHeaderCell>
                  <CTableHeaderCell>Total Présences</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      Chargement des données...
                    </CTableDataCell>
                  </CTableRow>
                ) : comptageData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      Aucune donnée trouvée pour la période spécifiée.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  comptageData.map((comptage, index) => (
                    comptage.details && comptage.details.length > 0 ? (
                      comptage.details.map((detail, idx) => (
                        <CTableRow key={`${index}-${idx}`}>
                          {idx === 0 && (
                            <CTableDataCell rowSpan={comptage.details.length}>
                              {comptage.matricule}
                            </CTableDataCell>
                          )}
                          <CTableDataCell>{new Date(detail.date).toLocaleDateString()}</CTableDataCell>
                          <CTableDataCell>{detail.jour}</CTableDataCell>
                          <CTableDataCell>{detail.ramassageStatut}</CTableDataCell>
                          <CTableDataCell>{detail.depotStatut}</CTableDataCell>
                          {idx === 0 && (
                            <>
                              <CTableDataCell rowSpan={comptage.details.length}>
                                {comptage.totalRamassagePresent}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={comptage.details.length}>
                                {comptage.totalDepotPresent}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={comptage.details.length}>
                                {comptage.totalPresences}
                              </CTableDataCell>
                            </>
                          )}
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell>{comptage.matricule}</CTableDataCell>
                        <CTableDataCell colSpan="7" className="text-center">
                          Aucun détail disponible pour ce matricule.
                        </CTableDataCell>
                      </CTableRow>
                    )
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Historique_comptage;
