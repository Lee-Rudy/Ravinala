import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
} from '@coreui/react';

const NotificationCard = ({ axe }) => (
  <CCard key={axe.id} className="mb-3" color="secondary">
    <Link to={`/axe/update/${axe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0" style={{ fontWeight: 'bold', color: 'white' }}>
            L'information sur l'axe {axe.axe} est incomplète
          </p>
          <CBadge color="warning">Rappel</CBadge>
        </div>
      </CCardBody>
    </Link>
  </CCard>
);

const Notifications = () => {
  const [incompleteAxes, setIncompleteAxes] = useState([]);

  // Récupérer les notifications à partir de l'API
  useEffect(() => {
    const fetchIncompleteAxes = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/axe/notifications`);
        setIncompleteAxes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
      }
    };

    fetchIncompleteAxes();
  }, []);

  return (
    <CRow className="justify-content-between">
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Notifications</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={4}>
                <h5>Rappel sur l'information de l'axe</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {incompleteAxes.length > 0 ? (
                    incompleteAxes.map((axe) => <NotificationCard axe={axe} />)
                  ) : (
                    <p className="text-center">Aucune notification</p>
                  )}
                </div>
              </CCol>
              <CCol xs={12} md={4}>
                <h5>Rappel push</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {incompleteAxes.length > 0 ? (
                    incompleteAxes.map((axe) => <NotificationCard axe={axe} />)
                  ) : (
                    <p className="text-center">Aucune notification</p>
                  )}
                </div>
              </CCol>
              <CCol xs={12} md={4}>
                <h5>Rappel fin de contrat</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {incompleteAxes.length > 0 ? (
                    incompleteAxes.map((axe) => <NotificationCard axe={axe} />)
                  ) : (
                    <p className="text-center">Aucune notification</p>
                  )}
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Notifications;
