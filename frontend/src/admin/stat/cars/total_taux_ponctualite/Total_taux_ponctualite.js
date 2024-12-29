import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck } from '@coreui/icons';

const TotalTauxPonctualite = ({ year }) => {
  const [punctualityRate, setPunctualityRate] = useState(0); // Stocke le taux de ponctualité
  const [loading, setLoading] = useState(false); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(''); 


  const fetchPunctualityRate = async () => {
    setLoading(true);
    setError('');
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    if (!baseURL) {
      console.error('VITE_API_BASE_URL is not defined.');
      setError('Configuration manquante pour l\'URL de l\'API.');
      setLoading(false);
      return;
    }

    console.log(`Fetching data for year ${year} from: ${baseURL}/api/stat/cars/ponctualityrate`);

    try {
      const response = await axios.get(`${baseURL}/api/stat/cars/ponctualityrate`, {
        params: { year },
      });

      console.log('API Response:', response.data);

      // Mise à jour correcte de l'état
      if (response.data && typeof response.data.punctualityRate === 'number') {
        setPunctualityRate(response.data.punctualityRate); // Mettre à jour le taux de ponctualité
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

  // Récupère les données lorsque `year` change
  useEffect(() => {
    fetchPunctualityRate();
  }, [year]);

  return (
    <CRow>
      {/* Résumé */}
      <CCol xs={12}>
        <CRow className="mb-4">
          <CCol xs={12} sm={6} className="mb-3 mb-sm-0">
            <CCard className="text-white bg-warning">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilCheck} size="3xl" className="me-3" />
                <div>
                  <h5>Taux de Ponctualité (Année : {year})</h5>
                  {loading ? (
                    <h3>Chargement...</h3>
                  ) : error ? (
                    <h3 style={{ color: 'red' }}>{error}</h3>
                  ) : (
                    <h3>{punctualityRate.toFixed(2)}%</h3>
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

export default TotalTauxPonctualite;
