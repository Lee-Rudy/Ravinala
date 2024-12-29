import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
} from '@coreui/react';

const NotificationCard = ({ notification, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'axes') {
      navigate(`/axe/update/${notification.id}`);
    } else if (type === 'pointageRamassage') {
      navigate('/notifications'); 
    }
  };

  return (
    <CCard key={notification.id} className="mb-3" color="secondary" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {type === 'axes' ? (
              <p className="mb-0" style={{ fontWeight: 'bold', color: 'white' }}>
                L'information sur l'axe {notification.axe} est incomplète
              </p>
            ) : (
              <p className="mb-0" style={{ fontWeight: 'bold', color: 'white' }}>
                Ramassage pour {notification.nomUsager} ({notification.matricule})
              </p>
            )}
            {type === 'pointageRamassage' && (
              <small style={{ color: 'lightgray' }}>
                Reçu le : {new Date(notification.recuLe).toLocaleString()}
              </small>
            )}
          </div>
          <CBadge color="warning">Rappel</CBadge>
        </div>
      </CCardBody>
    </CCard>
  );
};

const Notifications = () => {
  const [incompleteAxes, setIncompleteAxes] = useState([]);
  const [pointageRamassage, setPointageRamassage] = useState([]);

  useEffect(() => {
    const fetchIncompleteAxes = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/axe/notifications`);
        setIncompleteAxes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications Axes :", error);
      }
    };

    const fetchPointageRamassage = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const lastChecked = new Date(); 
        const response = await axios.get(`${baseURL}/api/notifications/pointageRamassage`, {
          params: { lastChecked: lastChecked.toISOString() }
        });
        setPointageRamassage(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications Pointage Ramassage :", error);
      }
    };

    fetchIncompleteAxes();
    fetchPointageRamassage();
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
              {/* Notifications Axes */}
              <CCol xs={12} md={4}>
                <h5>Rappel sur l'information de l'axe</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {incompleteAxes.length > 0 ? (
                    incompleteAxes.map((axe) => <NotificationCard key={axe.id} notification={axe} type="axes" />)
                  ) : (
                    <p className="text-center">Aucune notification</p>
                  )}
                </div>
              </CCol>

              {/* Notifications Push Ramassage */}
              <CCol xs={12} md={4}>
                <h5>Rappel Push Ramassage</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {pointageRamassage.length > 0 ? (
                    pointageRamassage.map((push) => <NotificationCard key={push.id} notification={push} type="pointageRamassage" />)
                  ) : (
                    <p className="text-center">Aucune notification</p>
                  )}
                </div>
              </CCol>

              {/* Notifications Fin de Contrat */}
              <CCol xs={12} md={4}>
                <h5>Rappel fin de contrat</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {/* encore en cours, possibilité de mis à jour */}
                  <p className="text-center">Aucune notification</p>
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
