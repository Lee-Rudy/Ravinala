import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import CIcon from '@coreui/icons-react';
import { cilChartLine } from '@coreui/icons';

const RetardMoisTotal = ({ year }) => {
  const [delaysByMonth, setDelaysByMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRetardMoisTotal = async () => {
    setLoading(true);
    setError('');
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.get(`${baseURL}/api/stat/cars/delaysbymonth`, {
        params: { year },
      });

      if (response.data && Array.isArray(response.data.delaysByMonth)) {
        setDelaysByMonth(response.data.delaysByMonth);
      } else {
        setError('Les données retournées par l\'API sont invalides.');
      }
    } catch (err) {
      setError('Erreur lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetardMoisTotal();
  }, [year]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const chartData = {
    labels: delaysByMonth.map((item) => monthNames[item.month - 1]),
    datasets: [
      {
        label: `Retards (${year})`,
        data: delaysByMonth.map((item) => item.delays),
        borderColor: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Retards : ${context.raw}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: 'white', font: { size: 10 } } },
      y: { ticks: { color: 'white', font: { size: 10 } } },
    },
  };

  const totalDelays = delaysByMonth.reduce((sum, item) => sum + item.delays, 0);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="text-white bg-success mb-4" style={{ height: '145px'}}>
          <CCardBody className="d-flex flex-column py-2 px-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{totalDelays} Retards au Total</h4>
                <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                  Nombre total de retards par mois de tout les cars({year})
                </p>
              </div>
              <CIcon icon={cilChartLine} size="3xl" />
            </div>
            {loading ? (
              <h3 className="mt-3">Chargement...</h3>
            ) : error ? (
              <h3 className="mt-3" style={{ color: 'red' }}>{error}</h3>
            ) : (
              <div style={{ height: '80px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RetardMoisTotal;
