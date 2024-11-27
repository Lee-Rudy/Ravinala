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
  CCardHeader
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilClock, cilSpeedometer, cilSearch } from '@coreui/icons';

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
    // Charger les données des différents endpoints
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
          <CCardHeader>
            <h5 style={{ color: '#45B48E' }}>
              <CIcon icon={cilClock} className="me-2" /> Ponctualité
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
                  <CTableHeaderCell className="text-center">Date Départ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Heure Départ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Date Arrivée</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Heure Arrivée</CTableHeaderCell>
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
                  <CTableHeaderCell className="text-center">kilométrage départ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">kilométrage arrivée</CTableHeaderCell>
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
                  <CTableHeaderCell className="text-center">kilométrage départ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">kilométrage arrivée</CTableHeaderCell>
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
