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
    CBadge,
    CPagination,
    CPaginationItem,
    CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

const Historique = () => {
    const [pointagesRamassage, setPointagesRamassage] = useState([]);
    const [pointagesDepot, setPointagesDepot] = useState([]);
    const [pointagesImprevus, setPointagesImprevus] = useState([]);
    const [historiqueData, setHistoriqueData] = useState({});
    const [groupedDates, setGroupedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchDate, setSearchDate] = useState('');
    const [filteredDates, setFilteredDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 32;

    // États pour les filtres
    const [selectedCar, setSelectedCar] = useState('');
    const [searchMatricule, setSearchMatricule] = useState('');

    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ramassageRes, depotRes, imprevusRes] = await Promise.all([
                    axios.get(`${baseURL}/api/historique/ramassage`),
                    axios.get(`${baseURL}/api/historique/depot`),
                    axios.get(`${baseURL}/api/historique/imprevus`),
                ]);

                console.log("Ramassage Data: ", ramassageRes.data);
                console.log("Depot Data: ", depotRes.data);
                console.log("Imprevus Data: ", imprevusRes.data);

                setPointagesRamassage(ramassageRes.data);
                setPointagesDepot(depotRes.data);
                setPointagesImprevus(imprevusRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                if (err.response) {
                    setError(`Erreur ${err.response.status}: ${err.response.data.message || err.response.statusText}`);
                } else if (err.request) {
                    setError('Aucune réponse reçue du serveur.');
                } else {
                    setError(`Erreur: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [baseURL]);

    useEffect(() => {
        // Regrouper les données par date
        const groupByDate = () => {
            const data = {};

            // Fonction pour ajouter les données au groupe approprié
            const addToGroup = (dateStr, type, item) => {
                const normalizedDate = new Date(dateStr).toISOString().split('T')[0];
                if (!data[normalizedDate]) {
                    data[normalizedDate] = {
                        date: normalizedDate,
                        ramassages: [],
                        depots: [],
                        imprévus: [],
                    };
                }
                data[normalizedDate][type].push(item);
            };

            pointagesRamassage.forEach((item) => {
                addToGroup(item.dateRamassage, 'ramassages', item);
            });

            pointagesDepot.forEach((item) => {
                addToGroup(item.dateDepot, 'depots', item);
            });

            pointagesImprevus.forEach((item) => {
                addToGroup(item.dateImprevu, 'imprévus', item);
            });

            const grouped = Object.values(data).sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistoriqueData(data);
            setGroupedDates(grouped);
            setFilteredDates(grouped);
        };

        groupByDate();
    }, [pointagesRamassage, pointagesDepot, pointagesImprevus]);

    const handleSearch = () => {
        if (searchDate) {
            const filtered = groupedDates.filter((item) => item.date === searchDate);
            setFilteredDates(filtered);
        } else {
            setFilteredDates(groupedDates);
        }
        setCurrentPage(1); // Réinitialiser la page à 1 après une recherche
    };

    const getDateCategory = (dateStr) => {
        const today = new Date();
        const date = new Date(dateStr);
        const diffTime = today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Aujourd\'hui';
        if (diffDays === 1) return 'Hier';
        if (diffDays <= 7) return '7 derniers jours';
        return 'Autres';
    };

    const categorizedDates = () => {
        const categories = {
            "Aujourd'hui": [],
            'Hier': [],
            '7 derniers jours': [],
            'Autres': [],
        };

        filteredDates.forEach((item) => {
            const category = getDateCategory(item.date);
            if (categories[category]) {
                categories[category].push(item);
            }
        });

        return categories;
    };

    const handleDateClick = (dateStr) => {
        const data = historiqueData[dateStr];
        setSelectedDate(data);
        setCurrentPage(1); // Réinitialiser la page à 1 lorsque une nouvelle date est sélectionnée

        // Réinitialiser les filtres lorsque une nouvelle date est sélectionnée
        setSelectedCar('');
        setSearchMatricule('');
    };

    const categories = categorizedDates();

    // Calculer les indices pour la pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Appliquer la pagination uniquement aux dates filtrées
    const currentDates = filteredDates.slice(indexOfFirstItem, indexOfLastItem);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(filteredDates.length / itemsPerPage);

    // Fonction pour générer les éléments de pagination avec "..."
    const renderPaginationItems = () => {
        const paginationItems = [];

        if (totalPages <= 10) {
            for (let i = 1; i <= totalPages; i++) {
                paginationItems.push(
                    <CPaginationItem
                        key={i}
                        active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </CPaginationItem>
                );
            }
        } else {
            // Toujours afficher les 1 à 3 premières pages
            for (let i = 1; i <= 3; i++) {
                paginationItems.push(
                    <CPaginationItem
                        key={i}
                        active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </CPaginationItem>
                );
            }

            // Ajouter "..." si la page actuelle est après la 4ème page
            if (currentPage > 4) {
                paginationItems.push(<CPaginationItem key="start-ellipsis" disabled>...</CPaginationItem>);
            }

            // Afficher les pages autour de la page actuelle
            const start = Math.max(4, currentPage - 2);
            const end = Math.min(totalPages - 3, currentPage + 2);

            for (let i = start; i <= end; i++) {
                paginationItems.push(
                    <CPaginationItem
                        key={i}
                        active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </CPaginationItem>
                );
            }

            // Ajouter "..." si la page actuelle est avant l'avant-dernière page
            if (currentPage < totalPages - 3) {
                paginationItems.push(<CPaginationItem key="end-ellipsis" disabled>...</CPaginationItem>);
            }

            // Toujours afficher les 3 dernières pages
            for (let i = totalPages - 2; i <= totalPages; i++) {
                paginationItems.push(
                    <CPaginationItem
                        key={i}
                        active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </CPaginationItem>
                );
            }
        }

        return paginationItems;
    };

    // Fonction pour extraire les noms de voitures uniques de la date sélectionnée
    const getUniqueCarNames = () => {
        if (!selectedDate) return [];

        const carNamesRamassage = selectedDate.ramassages.map(item => item.nomVoiture);
        const carNamesDepots = selectedDate.depots.map(item => item.nomVoiture);
        const allCarNames = [...carNamesRamassage, ...carNamesDepots];
        const uniqueCarNames = Array.from(new Set(allCarNames));
        return uniqueCarNames;
    };

    // Appliquer les filtres aux données sélectionnées
    const getFilteredData = () => {
        if (!selectedDate) return { ramassages: [], depots: [], imprévus: [] };

        const { ramassages, depots, imprévus } = selectedDate;

        // Filtrer ramassages
        let filteredRamassages = ramassages;
        if (selectedCar) {
            filteredRamassages = filteredRamassages.filter(item => item.nomVoiture === selectedCar);
        }
        if (searchMatricule) {
            filteredRamassages = filteredRamassages.filter(item =>
                item.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
            );
        }

        // Filtrer depots
        let filteredDepots = depots;
        if (selectedCar) {
            filteredDepots = filteredDepots.filter(item => item.nomVoiture === selectedCar);
        }
        if (searchMatricule) {
            filteredDepots = filteredDepots.filter(item =>
                item.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
            );
        }

        // Filtrer imprévus (si 'nomVoiture' existe)
        let filteredImprevus = imprévus;
        if (selectedCar) {
            filteredImprevus = filteredImprevus.filter(item => item.nomVoiture === selectedCar);
        }
        if (searchMatricule) {
            filteredImprevus = filteredImprevus.filter(item =>
                item.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
            );
        }

        return {
            ramassages: filteredRamassages,
            depots: filteredDepots,
            imprévus: filteredImprevus,
        };
    };

    const filteredData = getFilteredData();

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <>
            {/* Section de Recherche */}
            <CRow className="mb-3">
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Recherche d'Historique des Pointages</strong>
                        </CCardHeader>
                        <CCardBody>
                            <CRow className="align-items-center">
                                <CCol md={4} className="mb-2">
                                    <CInputGroup>
                                        <CInputGroupText>
                                            <CIcon icon={cilMagnifyingGlass} />
                                        </CInputGroupText>
                                        <input
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                            className="form-control"
                                            placeholder="Sélectionnez une date"
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol md={2} className="mb-2">
                                    <CButton color="primary" onClick={handleSearch}>
                                        Rechercher
                                    </CButton>
                                </CCol>

                                <CCol md={2} className="mb-2 text-center">
                                    <CButton color="dark" onClick={() => { /* Ajouter l'action souhaitée */ }}>
                                        Informations
                                    </CButton>
                                </CCol>

                                <CCol md={2} className="mb-2 text-end">
                                    <CButton color="secondary" onClick={() => { setSearchDate(''); handleSearch(); }}>
                                        Réinitialiser
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Sections d'Historique avec Pagination */}
            <CRow>
            <CCol xs={12} md={4} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            <CCard className="mb-4 shadow-sm">
                <CCardHeader className="bg-primary text-white text-center">
                    <strong>Dates Disponibles</strong>
                </CCardHeader>
                <CCardBody>
                    {Object.entries(categories).map(([category, dates]) => (
                        dates.length > 0 && (
                            <div key={category} className="mb-4">
                                <h5 className="text-muted">{category}</h5>
                                {dates.map((dateItem, index) => {
                                    const isSelected = selectedDate?.date === dateItem.date;
                                    return (
                                        <CCard
                                            key={`${dateItem.date}-${index}`}
                                            className={`mb-3 ${isSelected ? 'border-primary shadow' : 'border-light'}`}
                                            style={{
                                                border: isSelected ? '2px solid #0d6efd' : '1px solid #ddd',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = isSelected
                                                    ? '0 0 8px rgba(13, 110, 253, 0.5)'
                                                    : '0 2px 5px rgba(0, 0, 0, 0.1)';
                                            }}
                                            onClick={() => handleDateClick(dateItem.date)}
                                        >
                                            <CCardHeader
                                                className={`text-center ${isSelected ? 'bg-primary text-white' : ''}`}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    padding: '10px',
                                                }}
                                            >
                                                {new Date(dateItem.date).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </CCardHeader>
                                        </CCard>
                                    );
                                })}
                            </div>
                        )
                    ))}
                </CCardBody>
            </CCard>
        </CCol>


                {/* Affichage des Détails pour la Date Sélectionnée */}
                <CCol xs={12} md={8}>
                    {selectedDate && (
                        <CCard className="mb-4">
                            <CCardHeader>
                                <h5>Détails pour le {new Date(selectedDate.date).toLocaleDateString('fr-FR')}</h5>
                            </CCardHeader>
                            <CCardBody>
                                {/* Section des Filtres */}
                                <CRow className="mb-4">
                                    <CCol md={4} className="mb-2">
                                        <CInputGroup>
                                            <CInputGroupText>Voiture</CInputGroupText>
                                            <CFormSelect
                                                value={selectedCar}
                                                onChange={(e) => { setSelectedCar(e.target.value); setCurrentPage(1); }}
                                            >
                                                <option value="">Toutes les voitures</option>
                                                {getUniqueCarNames().map((car, idx) => (
                                                    <option key={idx} value={car}>
                                                        {car}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md={4} className="mb-2">
                                        <CInputGroup>
                                            <CInputGroupText>Matricule</CInputGroupText>
                                            <input
                                                type="text"
                                                value={searchMatricule}
                                                onChange={(e) => { setSearchMatricule(e.target.value); setCurrentPage(1); }}
                                                className="form-control"
                                                placeholder="Rechercher par matricule"
                                            />
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md={4} className="mb-2 text-end">
                                        <CButton
                                            color="secondary"
                                            onClick={() => {
                                                setSelectedCar('');
                                                setSearchMatricule('');
                                                setCurrentPage(1);
                                            }}
                                        >
                                            Réinitialiser les filtres
                                        </CButton>
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol md={6}>
                                        <h6>Pointages de Ramassage</h6>
                                        {filteredData.ramassages.length > 0 ? (
                                            <CTable striped>
                                                <CTableHead>
                                                    <CTableRow>
                                                        <CTableHeaderCell>Matricule</CTableHeaderCell>
                                                        <CTableHeaderCell>Nom</CTableHeaderCell>
                                                        <CTableHeaderCell>Voiture</CTableHeaderCell>
                                                        <CTableHeaderCell>Heure</CTableHeaderCell>
                                                        <CTableHeaderCell>Présent</CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                                    {filteredData.ramassages
                                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                        .map((item, index) => (
                                                        <CTableRow key={`${item.id}-${index}`}>
                                                            <CTableDataCell>{item.matricule}</CTableDataCell>
                                                            <CTableDataCell>{item.nomUsager}</CTableDataCell>
                                                            <CTableDataCell>{item.nomVoiture}</CTableDataCell>
                                                            <CTableDataCell>{item.heureRamassage}</CTableDataCell>
                                                            <CTableDataCell>
                                                                <CBadge color={item.estPresent ? 'success' : 'danger'}>
                                                                    {item.estPresent ? 'Présent' : 'Absent'}
                                                                </CBadge>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody>
                                            </CTable>
                                        ) : (
                                            <p>Aucun pointage de ramassage correspondant aux filtres.</p>
                                        )}
                                    </CCol>
                                    <CCol md={6}>
                                        <h6>Pointages de Dépôt</h6>
                                        {filteredData.depots.length > 0 ? (
                                            <CTable striped>
                                                <CTableHead>
                                                    <CTableRow>
                                                        <CTableHeaderCell>Matricule</CTableHeaderCell>
                                                        <CTableHeaderCell>Nom</CTableHeaderCell>
                                                        <CTableHeaderCell>Voiture</CTableHeaderCell>
                                                        <CTableHeaderCell>Heure</CTableHeaderCell>
                                                        <CTableHeaderCell>Présent</CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                                    {filteredData.depots
                                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                        .map((item, index) => (
                                                        <CTableRow key={`${item.id}-${index}`}>
                                                            <CTableDataCell>{item.matricule}</CTableDataCell>
                                                            <CTableDataCell>{item.nomUsager}</CTableDataCell>
                                                            <CTableDataCell>{item.nomVoiture}</CTableDataCell>
                                                            <CTableDataCell>{item.heureDepot}</CTableDataCell>
                                                            <CTableDataCell>
                                                                <CBadge color={item.estPresent ? 'success' : 'danger'}>
                                                                    {item.estPresent ? 'Présent' : 'Absent'}
                                                                </CBadge>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody>
                                            </CTable>
                                        ) : (
                                            <p>Aucun pointage de dépôt correspondant aux filtres.</p>
                                        )}

                                        <h6 className="mt-4">Pointages Imprévus</h6>
                                        {filteredData.imprévus.length > 0 ? (
                                        <CTable striped>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                                                    <CTableHeaderCell>Voiture</CTableHeaderCell>
                                                    <CTableHeaderCell>Heure</CTableHeaderCell>
                                                    <CTableHeaderCell>Type</CTableHeaderCell> {/* Nouvelle colonne */}
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {filteredData.imprévus
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map((item, index) => {
                                                        // Conversion correcte de l'heure
                                                        const [hours, minutes, seconds] = item.heureImprevu.split(':').map(Number);
                                                        const imprevuTime = new Date(1970, 0, 1, hours, minutes, seconds);
                                                        const thresholdTime = new Date(1970, 0, 1, 15, 30, 0); // 15:30

                                                        const isBeforeThreshold = imprevuTime < thresholdTime;

                                                        return (
                                                            <CTableRow key={`${item.id}-${index}`}>
                                                                <CTableDataCell>{item.matricule}</CTableDataCell>
                                                                <CTableDataCell>{item.nomVoiture}</CTableDataCell>
                                                                <CTableDataCell>{item.heureImprevu}</CTableDataCell>
                                                                <CTableDataCell>
                                                                    <CBadge color={isBeforeThreshold ? 'info' : 'primary'}>
                                                                        {isBeforeThreshold ? 'Ramassage' : 'Dépôt'}
                                                                    </CBadge>
                                                                </CTableDataCell>
                                                            </CTableRow>
                                                        );
                                                    })}
                                            </CTableBody>
                                        </CTable>
                                    ) : (
                                        <p>Aucun pointage imprévu correspondant aux filtres.</p>
                                    )}


                                    </CCol>
                                </CRow>

                                {/* Pagination */}
                                <CRow className="mt-4">
                                    <CCol className="d-flex justify-content-center">
                                        <CPagination aria-label="Pagination">
                                            <CPaginationItem
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                            >
                                                Précédent
                                            </CPaginationItem>
                                            {renderPaginationItems()}
                                            <CPaginationItem
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                            >
                                                Suivant
                                            </CPaginationItem>
                                        </CPagination>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    )}
                </CCol>
            </CRow>
        </>
    );
};

export default Historique;
