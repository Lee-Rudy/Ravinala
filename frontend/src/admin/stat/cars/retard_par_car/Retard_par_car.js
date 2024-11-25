import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react';

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const RetardParCar = () => {
  const [carsList, setCarsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [selectedCar, setSelectedCar] = useState(null); // Voiture sélectionnée
  const [year, setYear] = useState(new Date().getFullYear()); // Année sélectionnée
  const [delaysByMonth, setDelaysByMonth] = useState([]); // Données pour le graphique des retards
  const [passengerGeneralStats, setPassengerGeneralStats] = useState(null); // Statistiques générales des passagers
  const [passengerAverageStats, setPassengerAverageStats] = useState(null); // Statistiques moyennes ramassage-dépot
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [passengerError, setPassengerError] = useState('');
  const [averageError, setAverageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passengerLoading, setPassengerLoading] = useState(false);
  const [averageLoading, setAverageLoading] = useState(false);

  const itemsPerPage = 5;

  // Liste des mois (texte)
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  // Récupérer la liste des voitures
  const fetchCars = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/cars/liste`);
      setCarsList(response.data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des données des voitures.');
    }
  };

  // Récupérer les retards pour une voiture donnée et une année
  const fetchDelaysByCar = async (carName) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/stat/cars/delaysbycarandmonth`,
        {
          params: { carName, year },
        }
      );
      setDelaysByMonth(response.data.delaysByMonth || []); // Mettre à jour les données pour le graphique des retards
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des retards.');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques générales des passagers
  const fetchPassengerGeneralStats = async (carName) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    setPassengerLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/stat/cars/passengers/average`,
        {
          params: { carName, year },
        }
      );
      setPassengerGeneralStats(response.data);
    } catch (error) {
      console.error(error);
      setPassengerError('Erreur lors de la récupération des statistiques des passagers.');
    } finally {
      setPassengerLoading(false);
    }
  };

  // Récupérer les statistiques moyennes ramassage-dépot des passagers
  const fetchPassengerAverageStats = async (carName) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    setAverageLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/stat/cars/passengers/average/ramassage-depot`,
        {
          params: { carName, year },
        }
      );
      setPassengerAverageStats(response.data);
    } catch (error) {
      console.error(error);
      setAverageError('Erreur lors de la récupération des statistiques ramassage-dépot.');
    } finally {
      setAverageLoading(false);
    }
  };

  // Gestion de la pagination
  const paginatedCars = carsList
    .filter((car) =>
      car.nom_car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Gestion du clic sur une voiture
  const handleCarClick = (car) => {
    setSelectedCar(car);
    fetchDelaysByCar(car.nom_car); // Récupérer les données pour le graphique des retards
    fetchPassengerGeneralStats(car.nom_car); // Récupérer les statistiques générales des passagers
    fetchPassengerAverageStats(car.nom_car); // Récupérer les statistiques moyennes ramassage-dépot
  };

  // Préparer les données pour l'histogramme des retards
  const delaysChartData = {
    labels: monthNames, // Mois en texte
    datasets: [
      {
        label: `Retards (${selectedCar?.nom_car || 'Voiture'})`,
        data: monthNames.map((_, index) => {
          const monthData = delaysByMonth.find((item) => Number(item.month) === index + 1);
          return monthData ? monthData.delays : 0; // Ajouter 0 pour les mois sans données
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const delaysChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histogramme des Retards par Mois',
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text: 'Mois',
          font: { size: 14 },
        },
      },
      y: {
        ticks: { font: { size: 12 }, beginAtZero: true },
        title: {
          display: true,
          text: 'Nombre de Retards',
          font: { size: 14 },
        },
      },
    },
  };

  // Préparer les données pour l'histogramme combiné ramassage-dépot
  const averageChartData = {
    labels: monthNames, // Mois en toutes lettres
    datasets: [
      {
        label: 'Ramassage',
        data: monthNames.map((_, index) => {
          const monthData = passengerAverageStats?.passengersByMonthRamassage.find(
            (item) => Number(item.month) === index + 1
          );
          return monthData ? monthData.passengers : 0; // Ajouter 0 pour les mois sans données
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Couleur pour Ramassage
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Dépôt',
        data: monthNames.map((_, index) => {
          const monthData = passengerAverageStats?.passengersByMonthDepot.find(
            (item) => Number(item.month) === index + 1
          );
          return monthData ? monthData.passengers : 0; // Ajouter 0 pour les mois sans données
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Couleur pour Dépôt
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const averageChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Afficher la légende
        position: 'top',
      },
      title: {
        display: true,
        text: 'Moyenne Ramassage et Dépot des Passagers par Mois',
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text: 'Mois',
          font: { size: 14 },
        },
      },
      y: {
        ticks: { font: { size: 12 }, beginAtZero: true },
        title: {
          display: true,
          text: 'Nombre de Passagers',
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div>
      {/* Barre de recherche */}
      <CInputGroup className="mb-3">
        <CInputGroupText>Recherche</CInputGroupText>
        <CFormInput
          placeholder="Nom ou immatriculation du car"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </CInputGroup>

      {/* Sélecteur de l'année */}
      <div className="mb-3">
        <label htmlFor="yearSelect" className="form-label">Sélectionner une année :</label>
        <CFormSelect
          id="yearSelect"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[...Array(30)].map((_, i) => {
            const yearOption = new Date().getFullYear() - i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </CFormSelect>
      </div>

      <CRow>
        {/* Liste des voitures */}
        {/* lg={6}  */}

        <CCol xs={12} lg={3}> 
          <CTable bordered borderColor="primary">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom du car</CTableHeaderCell>
                <CTableHeaderCell>Immatriculation</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedCars.map((car) => (
                <CTableRow key={car.id}>
                  <CTableDataCell
                    onClick={() => handleCarClick(car)}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'darkblue')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                  >
                    {car.nom_car}
                  </CTableDataCell>
                  <CTableDataCell>{car.immatriculation}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Pagination */}
          <CPagination aria-label="Pagination" className="mt-3">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </CPaginationItem>
            {[...Array(Math.ceil(carsList.length / itemsPerPage))].map((_, idx) => (
              <CPaginationItem
                key={idx}
                active={currentPage === idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(carsList.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </CPaginationItem>
          </CPagination>
        </CCol>

        {/* Graphiques et Tableaux */}
        {/* lg={6}  */}
        <CCol xs={12} lg={8}>
          {/* Histogramme des Retards */}
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Histogramme des Retards</h5>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <p>Chargement des données des retards...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <Bar data={delaysChartData} options={delaysChartOptions} />
              )}
            </CCardBody>
          </CCard>

          {/* Histogramme Combiné Ramassage-Dépot */}
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Moyenne Ramassage et Dépot des Passagers</h5>
            </CCardHeader>
            <CCardBody>
              {averageLoading ? (
                <p>Chargement des données des moyennes ramassage-dépot...</p>
              ) : averageError ? (
                <p style={{ color: 'red' }}>{averageError}</p>
              ) : passengerAverageStats ? (
                <Bar data={averageChartData} options={averageChartOptions} />
              ) : (
                <p>Aucune donnée disponible.</p>
              )}
            </CCardBody>
          </CCard>

          {/* Tableau des Statistiques Générales des Passagers */}
          <CCard>
            <CCardHeader>
              <h5>Statistiques Générales des Passagers</h5>
            </CCardHeader>
            <CCardBody>
              {passengerLoading ? (
                <p>Chargement des données des passagers...</p>
              ) : passengerError ? (
                <p style={{ color: 'red' }}>{passengerError}</p>
              ) : passengerGeneralStats ? (
                <>
                  <CTable bordered color='warning'>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Voiture</CTableHeaderCell>
                        <CTableHeaderCell>Année</CTableHeaderCell>
                        <CTableHeaderCell>Passagers Totaux</CTableHeaderCell>
                        <CTableHeaderCell>Passagers Moyens</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>{passengerGeneralStats.car}</CTableDataCell>
                        <CTableDataCell>{passengerGeneralStats.year}</CTableDataCell>
                        <CTableDataCell>{passengerGeneralStats.totalPassengers}</CTableDataCell>
                        <CTableDataCell>{passengerGeneralStats.averagePassengers}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                  
                  
                  <h6 className="mt-4">Passagers par Mois</h6>
                  <CTable bordered borderColor="primary">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Mois</CTableHeaderCell>
                        <CTableHeaderCell>Passagers</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {passengerGeneralStats.passengersByMonth.map((item) => (
                        <CTableRow key={item.month}>
                          <CTableDataCell>{monthNames[Number(item.month) - 1]}</CTableDataCell>
                          <CTableDataCell>{item.passengers}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              ) : (
                <p>Aucune donnée disponible.</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default RetardParCar;