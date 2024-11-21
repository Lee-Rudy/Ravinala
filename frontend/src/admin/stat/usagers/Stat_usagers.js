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
import { cilMagnifyingGlass, cilTruck, cilColorPalette } from '@coreui/icons'; // Importation des icônes supplémentaires
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Nécessaire pour Chart.js v3+

const Stat_usagers = () => {
  const [error, setError] = useState('');
  const [usagersList, setUsagersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsager, setSelectedUsager] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsagers();
  }, []);

  const fetchUsagers = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/usagers/liste`);
      console.log('Liste des usagers:', response.data);
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

  // Pagination
  const paginatedUsagers = filteredUsagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUsagerClick = (usager) => {
    setSelectedUsager(usager);
    setStats([]); // Réinitialiser les stats pour le nouvel usager
  };

  const handleFetchStats = async () => {
    if (!selectedUsager || !selectedYear) return;

    setLoading(true);
    setError('');
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/stat/usagers/trafic`, {
        params: {
          matricule: selectedUsager.matricule,
          annee: selectedYear,
        },
      });
      console.log('Statistiques récupérées:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des statistiques.');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (!stats || stats.length === 0) return {};

    // Tableau des noms complets des mois
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const labels = stats.map((stat) => moisNoms[stat.mois - 1]);
    const ramassageData = stats.map((stat) => stat.ramassageTotal);
    const depotData = stats.map((stat) => stat.depotTotal);

    console.log('Labels:', labels);
    console.log('Ramassage Data:', ramassageData);
    console.log('Dépôt Data:', depotData);

    return {
      labels,
      datasets: [
        {
          label: 'Ramassage',
          data: ramassageData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Bleu
        },
        {
          label: 'Dépôt',
          data: depotData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Vert
        },
      ],
    };
  };

  // Calculer les totaux des ramassages et dépôts
  const totalRamassages = stats.reduce((acc, stat) => acc + stat.ramassageTotal, 0);
  const totalDepots = stats.reduce((acc, stat) => acc + stat.depotTotal, 0);

  // Ajout d'un useEffect pour surveiller les changements de stats
  useEffect(() => {
    if (stats.length > 0) {
      console.log('Stats mises à jour:', stats);
    }
  }, [stats]);

  return (
    <CRow>
      {/* Blocs de Résumé au-dessus du Tableau */}
      <CCol xs={12}>
        <CRow className="mb-4">
          {/* Bloc Total Ramassages */}
          <CCol xs={12} sm={6} className="mb-3 mb-sm-0">
            <CCard className="text-white bg-primary">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilTruck} size="3xl" className="me-3" />
                <div>
                  <h5>Total Ramassages</h5>
                  <h3>{totalRamassages}</h3>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          {/* Bloc Total Dépôts */}
          <CCol xs={12} sm={6}>
            <CCard className="text-white bg-success">
              <CCardBody className="d-flex align-items-center">
                <CIcon icon={cilColorPalette} size="3xl" className="me-3" />
                <div>
                  <h5>Total Dépôts</h5>
                  <h3>{totalDepots}</h3>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>

      {/* Section Principale : Tableau et Graphique */}
      <CCol xs={12}>
        <CRow>
          {/* Colonne pour le Tableau */}
          <CCol xs={12} md={8}>
            <CCard>
              <CCardHeader>
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
                      <CTableHeaderCell>Matricule</CTableHeaderCell>
                      <CTableHeaderCell>Nom et prénom</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paginatedUsagers.map((usager) => (
                      <CTableRow key={usager.id}>
                        <CTableDataCell
                          onClick={() => handleUsagerClick(usager)}
                          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                          onMouseOver={(e) => (e.currentTarget.style.color = 'darkblue')}
                          onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                        >
                          {usager.matricule}
                        </CTableDataCell>
                        <CTableDataCell>{usager.nom} {usager.prenom}</CTableDataCell>
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

          {/* Colonne pour le Graphique */}
          <CCol xs={12} md={4}>
            {selectedUsager && (
              <CCard>
                <CCardHeader>
                  <strong>Statistiques de {selectedUsager.nom} {selectedUsager.prenom} en {selectedYear}</strong>
                </CCardHeader>
                <CCardBody>
                  {/* Sélection de l'Année */}
                  <CFormLabel htmlFor="selectYear">Sélectionner une année</CFormLabel>
                  <CFormSelect
                    id="selectYear"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="mb-3"
                  >
                    {/* Générer des années de 10 ans en arrière jusqu'à l'année en cours */}
                    {[...Array(10)].map((_, idx) => {
                      const year = new Date().getFullYear() - idx;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </CFormSelect>

                  <CButton color="primary" onClick={handleFetchStats} disabled={loading} block>
                    {loading ? 'Chargement...' : 'Valider'}
                  </CButton>

                  {/* Graphique des Statistiques */}
                  <div className="mt-4">
                    {stats.length > 0 ? (
                      <Bar
                        key={`${selectedUsager?.matricule}-${selectedYear}`} // Forcer le re-render
                        data={generateChartData()}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: `Statistiques de ${selectedUsager.nom} ${selectedUsager.prenom} en ${selectedYear}`,
                            },
                            tooltip: {
                              enabled: true,
                              callbacks: {
                                label: function(context) {
                                  let label = context.dataset.label || '';
                                  if (label) {
                                    label += ': ';
                                  }
                                  if (context.parsed.y !== null) {
                                    label += context.parsed.y;
                                  }
                                  return label;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Nombre de Présences',
                              },
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
                        {loading ? <p>Chargement des données...</p> : <p>Aucune donnée disponible pour cette année.</p>}
                      </div>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  );
};

export default Stat_usagers;
