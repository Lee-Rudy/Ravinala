import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck } from '@coreui/icons';

const TotalCars = ({ year }) => {
  const [totalDelays, setTotalDelays] = useState(0); // Stocke le total des retards
  const [loading, setLoading] = useState(false); // Indique si les données sont en cours de chargement
  const [error, setError] = useState('');


  const fetchTotalDelays = async () => {
    setLoading(true);
    setError('');
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    if (!baseURL) {
      console.error('VITE_API_BASE_URL is not defined.');
      setError('Configuration manquante pour l\'URL de l\'API.');
      setLoading(false);
      return;
    }

    console.log(`Fetching data for year ${year} from: ${baseURL}/api/stat/cars/total`);

    try {
      const response = await axios.get(`${baseURL}/api/stat/cars/total`, {
        params: { year }, 
      });

      console.log('API Response:', response.data);

      // Mise à jour correcte de l'état
      if (response.data && typeof response.data.totalDelays === 'number') {
        setTotalDelays(response.data.totalDelays); // Utilise la bonne casse
      } else {
        setError('Les données retournées par l\'API sont invalides.');
        console.error('Invalid API response:', response.data);
      }
    } catch (err) {
      console.error('Erreur Axios:', err);
      setError('Erreur lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTotalDelays();
  }, [year]);

  return (
    <CRow>

      <CCol xs={12}>
        <CRow className="mb-4">
          <CCol xs={12} sm={6} className="mb-3 mb-sm-0">
            <CCard className="text-white bg-primary">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilCheck} size="3xl" className="me-3" />
                <div>
                  <h5>Total des Retards (Année : {year})</h5>
                  {loading ? (
                    <h3>Chargement...</h3>
                  ) : error ? (
                    <h3 style={{ color: 'red' }}>{error}</h3>
                  ) : (
                    <h3>{totalDelays}</h3>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  );
};

export default TotalCars;
