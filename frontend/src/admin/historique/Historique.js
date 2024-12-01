import React, { useState, useEffect, useMemo } from 'react';
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
    CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass, cilCalendar, cilReload, cilBookmark, cilSearch } from '@coreui/icons';

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

    // Fonction pour déterminer si un imprévu est un ramassage ou un dépôt
    const isRamassage = (item) => {
        const heureImprevu = item.heureImprevu;
    
        if (!heureImprevu) {
            console.log(`HeureImprevu est manquante pour l'item ID: ${item.id}`);
            return false;
        }
    
        // Supprimer les fractions de seconde si elles existent
        const timeParts = heureImprevu.split(':');
        if (timeParts.length < 2) {
            console.log(`Format de HeureImprevu incorrect: ${heureImprevu}`);
            return false;
        }
    
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        let seconds = 0;
    
        if (timeParts.length >= 3) {
            // Supprimer tout caractère non numérique dans les secondes
            const secondsStr = timeParts[2].split('.')[0]; // Prendre uniquement la partie entière
            seconds = parseInt(secondsStr, 10) || 0;
        }
    
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            console.log(`HeureImprevu contient des valeurs non valides: ${heureImprevu}`);
            return false;
        }
    
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const thresholdMinutes = 14 * 60; // 14h00 correspond à 840 minutes
    
        const result = totalMinutes < thresholdMinutes;
        console.log(`Heure Imprévu: ${heureImprevu}, Total Minutes: ${totalMinutes}, Ramassage: ${result}`);
        return result;
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

    // Calcul des totaux après sélection d'une date
    const totals = useMemo(() => {
        if (!selectedDate) return null;

        const ramassagePresent = selectedDate.ramassages.filter(r => r.estPresent).length;
        const ramassageAbsent = selectedDate.ramassages.length - ramassagePresent;

        const depotPresent = selectedDate.depots.filter(d => d.estPresent).length;
        const depotAbsent = selectedDate.depots.length - depotPresent;

        const imprévusRamassage = selectedDate.imprévus.filter(item => isRamassage(item)).length;
        const imprévusDepot = selectedDate.imprévus.length - imprévusRamassage;

        const totalPresences = ramassagePresent + depotPresent + imprévusRamassage + imprévusDepot;
        const totalMax = selectedDate.ramassages.length + selectedDate.depots.length + selectedDate.imprévus.length;

        return {
            ramassagePresent,
            ramassageAbsent,
            depotPresent,
            depotAbsent,
            imprévusRamassage,
            imprévusDepot,
            totalPresences,
            totalMax,
        };
    }, [selectedDate]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <>
            {/* Sections d'Historique avec Pagination */}
            <CRow>
                <CCol xs={12} md={4} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                    <CCard
                        className="shadow-sm"
                        style={{
                            position: 'fixed',
                            top: '50',
                            left: '100',
                            height: '72vh',
                            width: '360px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            zIndex: '1050',
                            borderRight: '1px solid #ddd',
                        }}
                    >
                        <CCardHeader
                            className="text-white text-center"
                            style={{
                                fontSize: '1.25rem',
                                backgroundColor: '#45B48E',
                            }}
                        >
                            <CIcon icon={cilCalendar} className="me-2" />
                            <strong>Dates Disponibles</strong>
                        </CCardHeader>

                        <CCardBody>
                            {/* Barre de Recherche */}
                            <div className="mb-3">
                                <CInputGroup>
                                    <CInputGroupText
                                        style={{
                                            backgroundColor: '#45B48E',
                                            color: 'white',
                                            border: 'none',
                                        }}
                                    >
                                        <CIcon icon={cilMagnifyingGlass} />
                                    </CInputGroupText>
                                    <input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        className="form-control border-0"
                                        placeholder="Sélectionnez une date"
                                        style={{
                                            borderRadius: '0 0.25rem 0.25rem 0',
                                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                                        }}
                                    />
                                </CInputGroup>
                            </div>

                            {/* Boutons d'Action */}
                            <div className="d-flex justify-content-between">
                                <CButton
                                    style={{
                                        backgroundColor: '#45B48E',
                                        color: 'white',
                                        borderRadius: '0.25rem',
                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                                        flex: 1,
                                        marginRight: '0.5rem',
                                    }}
                                    onClick={handleSearch}
                                >
                                    <CIcon icon={cilSearch} className="me-2" />
                                    Rechercher
                                </CButton>
                                <CButton
                                    style={{
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        borderRadius: '0.25rem',
                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                                        flex: 1,
                                    }}
                                    onClick={() => {
                                        setSearchDate('');
                                        handleSearch();
                                    }}
                                >
                                    <CIcon icon={cilReload} className="me-2" />
                                    Réinitialiser
                                </CButton>
                            </div>

                            {/* Liste des Dates */}
                            {Object.entries(categories).map(([category, dates]) =>
                                dates.length > 0 ? (
                                    <div key={category} className="mb-4">
                                        <h5 style={{ color: '#45B48E' }}>
                                            <CIcon icon={cilBookmark} className="me-2" />
                                            {category}
                                        </h5>
                                        {dates.map((dateItem, index) => {
                                            const isSelected = selectedDate?.date === dateItem.date;
                                            return (
                                                <CCard
                                                    key={`${dateItem.date}-${index}`}
                                                    className={`mb-3 ${isSelected ? 'shadow' : ''}`}
                                                    style={{
                                                        border: isSelected ? `2px solid #45B48E` : '1px solid #ddd',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                        borderRadius: '0.5rem',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                        e.currentTarget.style.boxShadow =
                                                            '0 4px 10px rgba(0, 0, 0, 0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = isSelected
                                                            ? '0 0 8px rgba(69, 180, 142, 0.5)'
                                                            : '0 2px 5px rgba(0, 0, 0, 0.1)';
                                                    }}
                                                    onClick={() => handleDateClick(dateItem.date)}
                                                >
                                                    <CCardHeader
                                                        className={`text-center ${isSelected ? 'text-white' : ''}`}
                                                        style={{
                                                            backgroundColor: isSelected ? '#45B48E' : 'white',
                                                            fontSize: '1rem',
                                                            padding: '10px',
                                                            color: isSelected ? 'white' : '#45B48E',
                                                        }}
                                                    >
                                                        {new Date(dateItem.date).toLocaleDateString('fr-FR', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                        {isSelected && (
                                                            <span className="badge bg-success ms-2">Sélectionné</span>
                                                        )}
                                                    </CCardHeader>
                                                </CCard>
                                            );
                                        })}
                                    </div>
                                ) : null
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Affichage des Détails pour la Date Sélectionnée */}
                <CCol xs={12} md={8}>
                    {selectedDate && (
                        <CCard className="mb-4">
                            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                                <h5>Détails pour le {new Date(selectedDate.date).toLocaleDateString('fr-FR')}</h5>
                            </CCardHeader>
                            <CCardBody>
                                {/* Section des Totaux */}
                                <CRow className="mb-4">
                                    <CCol>
                                        <CCard className="mb-3 shadow-sm" style={{ border: '1px solid #45B48E' }}>
                                            <CCardHeader
                                                style={{
                                                    backgroundColor: '#45B48E',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <CIcon icon={cilMagnifyingGlass} className="me-2" />
                                                Résumé des Pointages
                                            </CCardHeader>
                                            <CCardBody style={{ backgroundColor: '#f9f9f9', color: '#343a40' }}>
                                                {/* Row 1 */}
                                                <CRow className="mb-3">
                                                    <CCol md={6}>
                                                        <span style={{ color: '#007BFF', fontWeight: 'bold' }}>
                                                            Ramassage Présent :
                                                        </span>{' '}
                                                        <strong>{totals.ramassagePresent}</strong> / {selectedDate.ramassages.length}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <span style={{ color: '#DC3545', fontWeight: 'bold' }}>
                                                            Ramassage Absent :
                                                        </span>{' '}
                                                        <strong>{totals.ramassageAbsent}</strong>
                                                    </CCol>
                                                </CRow>

                                                {/* Row 2 */}
                                                <CRow className="mb-3">
                                                    <CCol md={6}>
                                                        <span style={{ color: '#007BFF', fontWeight: 'bold' }}>
                                                            Dépôt Présent :
                                                        </span>{' '}
                                                        <strong>{totals.depotPresent}</strong> / {selectedDate.depots.length}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <span style={{ color: '#DC3545', fontWeight: 'bold' }}>
                                                            Dépôt Absent :
                                                        </span>{' '}
                                                        <strong>{totals.depotAbsent}</strong>
                                                    </CCol>
                                                </CRow>

                                                {/* Row 3 */}
                                                <CRow className="mb-3">
                                                    <CCol md={6}>
                                                        <span style={{ color: '#FFC107', fontWeight: 'bold' }}>
                                                            Imprévus Ramassage :
                                                        </span>{' '}
                                                        <strong>{totals.imprévusRamassage}</strong>
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <span style={{ color: '#FFC107', fontWeight: 'bold' }}>
                                                            Imprévus Dépôt :
                                                        </span>{' '}
                                                        <strong>{totals.imprévusDepot}</strong>
                                                    </CCol>
                                                </CRow>

                                                {/* Total Présences */}
                                                <CRow className="mt-3">
                                                    <CCol>
                                                        <CAlert
                                                            style={{
                                                                backgroundColor: '#17A2B8',
                                                                color: 'white',
                                                                fontSize: '1rem',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            <strong>Total Présences :</strong> {totals.totalPresences} /{' '}
                                                            {totals.totalMax}
                                                        </CAlert>
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>

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
                                                                <CTableDataCell>
                                                                    {new Date(`1970-01-01T${item.heureRamassage}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </CTableDataCell>
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
                                    <CCol md={5}>
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
                                                                <CTableDataCell>
                                                                    {new Date(`1970-01-01T${item.heureDepot}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </CTableDataCell>
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
                                                        <CTableHeaderCell>Nom</CTableHeaderCell>
                                                        <CTableHeaderCell>Voiture</CTableHeaderCell>
                                                        <CTableHeaderCell>Heure</CTableHeaderCell>
                                                        <CTableHeaderCell>Type</CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                        {filteredData.imprévus
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((item, index) => {
                                                return (
                                                    <CTableRow key={`${item.id}-${index}`}>
                                                        <CTableDataCell>{item.matricule}</CTableDataCell>
                                                        <CTableDataCell>{item.nom}</CTableDataCell>
                                                        <CTableDataCell>{item.nomVoiture}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {item.heureImprevu} {/* Afficher l'heure formatée */}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CBadge color={item.typeImprevu === 'Ramassage' ? 'info' : 'primary'}>
                                                                {item.typeImprevu}
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
                                        <CPagination aria-label="Pagination" style={{ cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
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
