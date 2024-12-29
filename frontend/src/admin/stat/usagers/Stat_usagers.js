// Stat_usagers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormLabel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass, cilCheck,cilChartLine,cilCarAlt } from '@coreui/icons';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Select from 'react-select';


const Stat_usagers = () => {
  const [error, setError] = useState('');
  const [usagersList, setUsagersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsager, setSelectedUsager] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statsFrequentation, setStatsFrequentation] = useState(null);
  const [statsTrafics, setStatsTrafics] = useState([]);
  const [loadingFrequentation, setLoadingFrequentation] = useState(false);
  const [loadingTrafics, setLoadingTrafics] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsagers();
  }, []);

  const fetchUsagers = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/usagers/liste`);
      setUsagersList(response.data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des données.');
    }
  };

  const filteredUsagers = usagersList.filter((usager) => {
    const searchFilter =
      (usager.matricule && usager.matricule.includes(searchTerm)) ||
      (usager.nom && usager.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.prenom && usager.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usager.axeRamassage && usager.axeRamassage.toLowerCase().includes(searchTerm.toLowerCase()));
    return searchFilter;
  });

  const paginatedUsagers = filteredUsagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUsagerClick = (usager) => {
    setSelectedUsager(usager);
    setStatsFrequentation(null);
    setStatsTrafics([]);
  };


  const handleFetchTraficsStats = async () => {
    if (!selectedUsager || !selectedYear) return;

    setLoadingTrafics(true);
    setError('');
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/stat/usagers/trafic`, {
        params: {
          matricule: selectedUsager.matricule,
          annee: selectedYear,
        },
      });
      setStatsTrafics(response.data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des statistiques de trafics.');
    } finally {
      setLoadingTrafics(false);
    }
  };

  const handleFetchFrequentationStats = async () => {
    if (!selectedUsager || !selectedYear) return;

    setLoadingFrequentation(true);
    setError('');
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/stat/usagers/frequence`, {
        params: {
          matricule: selectedUsager.matricule,
          annee: selectedYear,
        },
      });
      setStatsFrequentation(response.data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des statistiques de fréquentation.');
    } finally {
      setLoadingFrequentation(false);
    }
  };

  const generateBarChartDataTrafics = () => {
    if (!statsTrafics || statsTrafics.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const labels = statsTrafics.map((stat) => moisNoms[stat.mois - 1]);
    const ramassageData = statsTrafics.map((stat) => stat.ramassageTotal);
    const depotData = statsTrafics.map((stat) => stat.depotTotal);

    return {
      labels,
      datasets: [
        {
          label: 'Ramassage',
          data: ramassageData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Dépôt',
          data: depotData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  const generateBarChartDataFrequentation = () => {
    if (!statsFrequentation || !statsFrequentation.monthlyComparison) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const labels = statsFrequentation.monthlyComparison.map((stat) => moisNoms[stat.mois - 1]);
    const ramassagePercentage = statsFrequentation.monthlyComparison.map((stat) => stat.topRamassagePercentage);
    const depotPercentage = statsFrequentation.monthlyComparison.map((stat) => stat.topDepotPercentage);

    return {
      labels,
      datasets: [
        {
          label: 'Ramassage (%)',
          data: ramassagePercentage,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        {
          label: 'Dépôt (%)',
          data: depotPercentage,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        },
      ],
    };
  };

  const generateDoughnutData = (frequencyData) => {
    if (!frequencyData || frequencyData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = frequencyData.map((item) => item.nomVoiture);
    const data = frequencyData.map((item) => item.count);
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF',
      '#8B0000', '#00FF7F', '#FF1493',
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, frequencyData.length),
          hoverBackgroundColor: backgroundColors.slice(0, frequencyData.length),
        },
      ],
    };
  };

  const totalRamassagesTrafics = statsTrafics?.reduce((acc, stat) => acc + stat.ramassageTotal, 0) || 0;
  const totalDepotsTrafics = statsTrafics?.reduce((acc, stat) => acc + stat.depotTotal, 0) || 0;
  const totalRamassagesFrequentation = statsFrequentation?.ramassageFrequency?.reduce((acc, item) => acc + item.count, 0) || 0;
  const totalDepotsFrequentation = statsFrequentation?.depotFrequency?.reduce((acc, item) => acc + item.count, 0) || 0;

  return (
    <CRow>
      {/* Blocs de Résumé au-dessus du Tableau */}
      <CCol xs={12}>
        <CRow className="mb-4">
          {/* Bloc Total Ramassages (Trafics) */}
          <CCol xs={12} sm={6} className="mb-3 mb-sm-0">
            <CCard className="text-white bg-primary">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilCheck} size="3xl" className="me-3" />
                <div>
                  <h5>Total Ramassages (Pendant l'année)</h5>
                  <h3>{totalRamassagesTrafics}</h3>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          {/* Bloc Total Dépôts (Trafics) */}
          <CCol xs={12} sm={6}>
            <CCard className="text-white bg-success">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilCheck} size="3xl" className="me-3" />
                <div>
                  <h5>Total Dépôts (Pendant l'année)</h5>
                  <h3>{totalDepotsTrafics}</h3>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>

      {/* Section Principale : Tableau et Graphique Trafics */}
      <CCol xs={12}>
        <CRow>
          {/* Colonne pour le Tableau des Usagers */}
          <CCol xs={12} md={8}>
            <CCard>
            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                <strong>Liste des Usagers</strong>
              </CCardHeader>
              <CCardBody>
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Barre de recherche */}
                <div className="mb-3">
                  <CFormLabel htmlFor="search">Rechercher : matricule | nom & prénom</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilMagnifyingGlass} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="search"
                      placeholder="Rechercher par matricule, nom ou prénom"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </div>

                {/* Tableau des Usagers */}
                <CTable bordered borderColor="primary">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">Matricule</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Nom et prénom</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paginatedUsagers.map((usager) => (
                      <CTableRow key={usager.id}>
                        <CTableDataCell className="text-center"
                          onClick={() => handleUsagerClick(usager)}
                          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                          onMouseOver={(e) => (e.currentTarget.style.color = 'darkblue')}
                          onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                        >
                          {usager.matricule}
                        </CTableDataCell  >
                        <CTableDataCell className="text-center">{usager.nom} {usager.prenom}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* Pagination */}
                <CPagination aria-label="Pagination" className="mt-3" style={{ cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Précédent
                  </CPaginationItem>
                  {[...Array(Math.ceil(filteredUsagers.length / itemsPerPage))].map((_, idx) => (
                    <CPaginationItem
                      key={idx}
                      active={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === Math.ceil(filteredUsagers.length / itemsPerPage)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Suivant
                  </CPaginationItem>
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Colonne pour le Graphique Trafics */}
          <CCol xs={12} md={4}>
            {selectedUsager && (
              <CCard>
                <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                  <strong>Statistiques de Trafics de {selectedUsager.nom} {selectedUsager.prenom} en {selectedYear}</strong>
                </CCardHeader>
                <CCardBody>
                <div className="mb-3">
                <label htmlFor="selectYearTrafics" className="form-label">
                  Sélectionner une année
                </label>
                <Select
                  id="selectYearTrafics"
                  value={{ value: selectedYear, label: selectedYear }} 
                  onChange={(selectedOption) => setSelectedYear(selectedOption.value)} 
                  options={[...Array(10)].map((_, idx) => {
                    const year = new Date().getFullYear() - idx;
                    return { value: year, label: year };
                  })}
                  placeholder="Rechercher ou sélectionner une année"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#45B48E', 
                      boxShadow: 'none', 
                      '&:hover': { borderColor: '#45B48E' }, 
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? '#45B48E' : isFocused ? '#a8e6d0' : 'white', 
                      color: isSelected ? 'white' : 'black', 
                      '&:hover': { backgroundColor: '#45B48E', color: 'white' }, 
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#45B48E',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#45B48E', 
                    }),
                  }}
                />
              </div>

                  <CButton
                    color="primary"
                    onClick={handleFetchTraficsStats}
                    disabled={loadingTrafics}
                    className="w-100"
                  >
                    {loadingTrafics ? 'Chargement...' : 'Voir Statistiques Trafics'}
                  </CButton>

                  <div className="mt-4">
                    {statsTrafics && statsTrafics.length > 0 ? (
                      <Bar
                        key={`${selectedUsager?.matricule}-${selectedYear}-trafics`}
                        data={generateBarChartDataTrafics()}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { position: 'top' },
                            title: {
                              display: true,
                              text: `Comparaison Mensuelle de Trafics en ${selectedYear}`,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Mois',
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <div>
                        {loadingTrafics ? <p>Chargement des données...</p> : <p>Aucune donnée disponible pour cette année.</p>}
                      </div>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
      </CCol>

      {/* Section pour les Statistiques de Fréquentation */}
      <CCol xs={12} className="mt-4">
        {selectedUsager && (
          <CCard>
            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <strong>Statistiques de Fréquentation de {selectedUsager.nom} {selectedUsager.prenom} en {selectedYear}</strong>
            </CCardHeader>
            <CCardBody>
              <CButton
                color="primary"
                onClick={handleFetchFrequentationStats}
                disabled={loadingFrequentation}
                className="w-100"
              >
                {loadingFrequentation ? 'Chargement...' : 'Voir Fréquentation'}
              </CButton>

              <div className="mt-4">
                {statsFrequentation && statsFrequentation.monthlyComparison ? (
                  <>
                    {/* Tableau des Comparaisons Mensuelles Fréquentation */}
                    <CCard className="mt-4">
                <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                  <strong>
                    <CIcon icon={cilChartLine} className="me-2" />
                    Comparaison Mensuelle de Fréquentation
                  </strong>
                </CCardHeader>
                <CCardBody>
                  <CTable bordered hover responsive>
                    <CTableHead style={{ backgroundColor: '#e3f2fd' }}>
                      <CTableRow>
                        <CTableHeaderCell className="text-center">Mois</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Top Ramassage Voiture</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Ramassage (%)</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Top Dépôt Voiture</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Dépôt (%)</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Top Imprévu Voiture</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Imprévu (%)</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {statsFrequentation.monthlyComparison.map((stat, idx) => (
                        <CTableRow key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                          <CTableDataCell className="text-center">
                            <span style={{ fontWeight: 'bold', color: '#45B48E' }}>{stat.mois}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CIcon icon={cilCarAlt} className="me-2 text-primary" />
                            <span>{stat.topRamassageVoiture}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span className="badge bg-success">{stat.topRamassagePercentage}%</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CIcon icon={cilCarAlt} className="me-2 text-warning" />
                            <span>{stat.topDepotVoiture}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span className="badge bg-warning">{stat.topDepotPercentage}%</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CIcon icon={cilCarAlt} className="me-2 text-danger" />
                            <span>{stat.topImprevuVoiture}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span className="badge bg-danger">{stat.topImprevuPercentage}%</span>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>


                    {/* Diagrammes Circulaires pour Fréquentation */}
                    <CRow className="mt-4">
                      {/* Diagramme Circulaire pour Ramassage Fréquentation */}
                      <CCol xs={12} md={6} className="mb-4">
                        <CCard>
                        <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                            <strong>Fréquence Ramassage (Fréquentation)</strong>
                          </CCardHeader>
                          <CCardBody>
                            <Doughnut
                              data={generateDoughnutData(statsFrequentation.ramassageFrequency)}
                              options={{
                                responsive: true,
                                plugins: {
                                  legend: { position: 'bottom' },
                                  title: {
                                    display: true,
                                    text: `Distribution Ramassage en ${selectedYear}`,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function(context) {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        return `${label}: ${value} (${((value / totalRamassagesFrequentation) * 100).toFixed(2)}%)`;
                                      }
                                    }
                                  }
                                },
                              }}
                            />
                          </CCardBody>
                        </CCard>
                      </CCol>

                      {/* Diagramme Circulaire pour Dépôt Fréquentation */}
                      <CCol xs={12} md={6} className="mb-4">
                        <CCard>
                        <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                            <strong>Fréquence Dépôt (Fréquentation)</strong>
                          </CCardHeader>
                          <CCardBody>
                            <Doughnut
                              data={generateDoughnutData(statsFrequentation.depotFrequency)}
                              options={{
                                responsive: true,
                                plugins: {
                                  legend: { position: 'bottom' },
                                  title: {
                                    display: true,
                                    text: `Distribution Dépôt en ${selectedYear}`,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function(context) {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        return `${label}: ${value} (${((value / totalDepotsFrequentation) * 100).toFixed(2)}%)`;
                                      }
                                    }
                                  }
                                },
                              }}
                            />
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                  </>
                ) : (
                  <div>
                    {loadingFrequentation ? <p>Chargement des données...</p> : <p>Aucune donnée disponible pour cette année.</p>}
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  );
};

export default Stat_usagers;
