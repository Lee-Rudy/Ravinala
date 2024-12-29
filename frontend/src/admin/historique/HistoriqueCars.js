import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilClock, cilSpeedometer, cilSearch, cilCloudUpload } from '@coreui/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistoriqueCars = () => {
  const [historiqueCars, setHistoriqueCars] = useState([]);
  const [kmMatin, setKmMatin] = useState([]);
  const [kmSoir, setKmSoir] = useState([]);
  const [filteredData, setFilteredData] = useState({
    btn: [],
    kmMatin: [],
    kmSoir: [],
  });
  const [searchDate, setSearchDate] = useState('');

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const parseDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const parseTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 'N/A';
    const timeParts = timeString.split(':');
    return timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : 'N/A';
  };

  const isRedTime = (timeString) => {
    if (!timeString) return false;
    const [hours, minutes] = timeString.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    return timeInMinutes >= 450 && timeInMinutes <= 930; // 7h30 (450 min) à 15h30 (930 min)
  };

  useEffect(() => {
    
    axios
      .get(`${baseURL}/api/historique/btn`)
      .then((response) => setHistoriqueCars(response.data))
      .catch((error) => console.error('Erreur lors du chargement des historiques', error));

    axios
      .get(`${baseURL}/api/historique/km_matin`)
      .then((response) => setKmMatin(response.data))
      .catch((error) => console.error('Erreur lors du chargement des km matin', error));

    axios
      .get(`${baseURL}/api/historique/km_soir`)
      .then((response) => setKmSoir(response.data))
      .catch((error) => console.error('Erreur lors du chargement des km soir', error));
  }, []);

  const handleSearch = () => {
    if (!searchDate) {
      // Si aucune date n'est sélectionnée, réinitialisez les données filtrées
      setFilteredData({ btn: historiqueCars, kmMatin, kmSoir });
      return;
    }

    const filterByDate = (data, dateField) =>
      data.filter((item) => {
        const itemDate = item[dateField];
        if (!itemDate) return false;
        const parsedDate = new Date(itemDate);
        return !isNaN(parsedDate.getTime()) && parsedDate.toISOString().split('T')[0] === searchDate;
      });

    setFilteredData({
      btn: filterByDate(historiqueCars, 'datetimeDepart'),
      kmMatin: filterByDate(kmMatin, 'datetimeMatin'),
      kmSoir: filterByDate(kmSoir, 'datetimeSoir'),
    });
  };

  // Fonction pour exporter en CSV
  const exportCSV = () => {
    const headers = [
      'Nom Voiture',
      'Date Départ',
      'Heure Départ',
      'Date Arrivée',
      'Heure Arrivée',
      'Motif',
    ];

    const rows = filteredData.btn.map((item) => [
      item.nomVoiture,
      parseDate(item.datetimeDepart),
      parseTime(item.heureDepart),
      parseDate(item.datetimeArrivee),
      parseTime(item.heureArrivee),
      item.motif ? item.motif : 'N/A',
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PonctualiteVoitures.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour exporter en PDF
  const exportPDF = () => {
    if (!filteredData.btn || filteredData.btn.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }

    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.text('Ponctualité des Voitures', 14, 22);

    // Date de recherche
    doc.setFontSize(12);
    const searchText = searchDate ? `Date : ${parseDate(searchDate)}` : 'Toutes les dates';
    doc.text(searchText, 14, 30);

    // Préparer les données pour le tableau
    const tableColumn = [
      'Nom Voiture',
      'Date Départ',
      'Heure Départ',
      'Date Arrivée',
      'Heure Arrivée',
      'Motif',
    ];
    const tableRows = filteredData.btn.map((item) => [
      item.nomVoiture,
      parseDate(item.datetimeDepart),
      parseTime(item.heureDepart),
      parseDate(item.datetimeArrivee),
      parseTime(item.heureArrivee),
      item.motif ? item.motif : 'N/A',
    ]);

    // Ajouter le tableau au PDF en utilisant autoTable
    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [69, 180, 142], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: 'striped',
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const heureArrivee = data.cell.text[0];
          if (heureArrivee && isRedTime(heureArrivee)) {
            doc.setTextColor(255, 0, 0);
          } else {
            doc.setTextColor(0, 0, 0);
          }
        }
      },
    });

    // Télécharger le PDF
    doc.save('PonctualiteVoitures.pdf');
  };

  return (
    <CCard>
      <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
        <h4 style={{ color: '#FAFAFAFF', fontWeight: 'bold' }}>
          <CIcon icon={cilCarAlt} size="lg" /> Historique des Voitures
        </h4>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol md="6">
            <CInputGroup>
              <CFormInput
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="Rechercher par date"
              />
              <CButton
                color="success"
                style={{ backgroundColor: '#45B48E' }}
                onClick={handleSearch}
              >
                <CIcon icon={cilSearch} /> Rechercher
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>

        {/* Table: Boutons */}
        <CRow className="mb-5">
          <CCol>
            <CCard>
              <CCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ color: '#45B48E' }}>
                  <CIcon icon={cilClock} className="me-2" /> Ponctualité
                </h5>
                {/* Bouton Liste Déroulante pour Exporter */}
                <CDropdown>
                  <CDropdownToggle color="primary">
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    Exporter
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={exportCSV}>Exporter en CSV</CDropdownItem>
                    <CDropdownItem onClick={exportPDF}>Exporter en PDF</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCardHeader>
              <CCardBody>
                <CTable bordered borderColor='primary'>
                  <CTableHead style={{ backgroundColor: '#45B48E', color: '#fff' }}>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">
                        <CIcon icon={cilCarAlt} size="sm" className="me-2" />
                        Nom Voiture
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date Départ</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Heure Départ</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date Arrivée</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Heure Arrivée</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Motif</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.btn.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilCarAlt} className="me-2 text-primary" />
                          {item.nomVoiture}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{parseDate(item.datetimeDepart)}</CTableDataCell>
                        <CTableDataCell className="text-center">{parseTime(item.heureDepart)}</CTableDataCell>
                        <CTableDataCell className="text-center">{parseDate(item.datetimeArrivee)}</CTableDataCell>

                        <CTableDataCell
                          className="text-center"
                          style={{
                            color: isRedTime(item.heureArrivee) ? 'red' : 'inherit',
                            fontWeight: isRedTime(item.heureArrivee) ? 'bold' : 'normal',
                          }}
                        >
                          {parseTime(item.heureArrivee)}
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center">
                          <CTooltip
                            content={item.motif ? item.motif : 'Motif non spécifié'}
                            placement="top"
                          >
                            <CBadge 
                            color={
                              item.motif === 'rien à signaler' || item.motif === 'Aucun' 
                                ? 'success' 
                                : item.motif === null || item.motif === 'N/A' 
                                ? 'warning' 
                                : 'danger'
                            }
                          >
                            {item.motif ? item.motif : 'motif oublié'}
                          </CBadge>
                          </CTooltip>
                        </CTableDataCell>

                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Table: KM Matin */}
        <CRow className="mb-5">
          <CCol>
            <CCard>
              <CCardHeader>
                <h5 style={{ color: '#45B48E' }}>
                  <CIcon icon={cilSpeedometer} className="me-2" /> KM Matin
                </h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered borderColor='primary'>
                  <CTableHead style={{ backgroundColor: '#45B48E', color: '#fff' }}>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">
                        <CIcon icon={cilCarAlt} size="sm" className="me-2" />
                        Nom Voiture
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date Matin</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Heure Matin</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Kilométrage Départ</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Kilométrage Arrivée</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.kmMatin.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilCarAlt} className="me-2 text-primary" />
                          {item.nomVoiture}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{parseDate(item.datetimeMatin)}</CTableDataCell>
                        <CTableDataCell className="text-center">{parseTime(item.heureMatin)}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilSpeedometer} className="me-2 text-info" />
                          {item.depart} KM
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilSpeedometer} className="me-2 text-info" />
                          {item.fin} KM
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Table: KM Soir */}
        <CRow className="mb-5">
          <CCol>
            <CCard>
              <CCardHeader>
                <h5 style={{ color: '#45B48E' }}>
                  <CIcon icon={cilSpeedometer} className="me-2" /> KM Soir
                </h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered borderColor='primary'>
                  <CTableHead style={{ backgroundColor: '#45B48E', color: '#fff' }}>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">
                        <CIcon icon={cilCarAlt} size="sm" className="me-2" />
                        Nom Voiture
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date Soir</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Heure Soir</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Kilométrage Départ</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Kilométrage Arrivée</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.kmSoir.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilCarAlt} className="me-2 text-primary" />
                          {item.nomVoiture}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{parseDate(item.datetimeSoir)}</CTableDataCell>
                        <CTableDataCell className="text-center">{parseTime(item.heureSoir)}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilSpeedometer} className="me-2 text-info" />
                          {item.depart} KM
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon icon={cilSpeedometer} className="me-2 text-info" />
                          {item.fin} KM
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default HistoriqueCars;
