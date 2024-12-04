import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CButton,
  CForm,
  CFormSelect,
  CAlert,
  CSpinner,
  CBadge,
  CPagination,
  CPaginationItem,
  CTooltip,
} from '@coreui/react';
import { useTable, useResizeColumns, useFlexLayout } from 'react-table';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilArrowLeft, cilArrowRight, cilCloudDownload, cilPlus, cilFolderOpen } from '@coreui/icons';
import styled from 'styled-components';
import { NavLink, Link } from 'react-router-dom';

// Styles personnalisés pour le tableau
const Styles = styled.div`
  padding: 1rem;

  .table-container {
    overflow-x: auto;
    /* Optionnel : ajouter une hauteur maximale si vous souhaitez une barre de défilement verticale */
    /* max-height: 600px; */
  }

  .table {
    border-spacing: 0;
    border: 1px solid #dee2e6;
    width: 100%;

    .tr {
      display: flex;
    }

    .th,
    .td {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #dee2e6;
      border-right: 1px solid #dee2e6;
      position: relative;

      :last-child {
        border-right: 0;
      }

      /* Centrer le texte */
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .th {
      background: #f8f9fa;
      font-weight: bold;
    }

    /* Styles pour les colonnes redimensionnables */
    .resizer {
      display: inline-block;
      background: #aaa;
      width: 3px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(50%);
      z-index: 1;
      touch-action: none;

      &.isResizing {
        background: #000;
      }
    }
  }
`;

const Facture_list = () => {
  // États pour les filtres
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [contratType, setContratType] = useState('tous');

  // États pour la pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20); // Vous pouvez rendre cela dynamique si nécessaire

  // États pour les données
  const [facturations, setFacturations] = useState([]);
  const [montantFinal, setMontantFinal] = useState(0);
  const [netPayerFinal, setNetPayerFinal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // États pour le statut
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fonction pour récupérer les données
  const fetchFacturations = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        pageNumber,
        pageSize,
        contratType,
      };

      if (dateDebut) params.dateDebut = dateDebut;
      if (dateFin) params.dateFin = dateFin;

      const response = await axios.get(`${baseURL}/api/facturations/liste`, { params });

      const data = response.data;

      // Tri des facturations par dateEmission décroissante (du plus récent au plus ancien)
      const sortedFacturations = [...data.facturations].sort((a, b) => {
        const dateA = new Date(a.dateEmission);
        const dateB = new Date(b.dateEmission);
        return dateB - dateA;
      });

      setFacturations(sortedFacturations);
      setMontantFinal(data.montantFinal);
      setNetPayerFinal(data.netPayerFinal);

      // Estimation du nombre total de pages
      // Vous devriez ajuster cela en fonction de votre API pour obtenir le nombre total d'éléments
      const totalItems = data.totalItems || 100; // Remplacez ceci par la valeur réelle si disponible
      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des facturations.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect pour récupérer les données au chargement et lors des changements de filtres/pagination
  useEffect(() => {
    fetchFacturations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, contratType, dateDebut, dateFin]);

  // Handler pour soumettre les filtres
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPageNumber(1); // Réinitialiser à la première page lors de l'application des filtres
    fetchFacturations();
  };

  // Handler pour réinitialiser les filtres
  const handleReset = () => {
    setDateDebut('');
    setDateFin('');
    setContratType('tous');
    setPageNumber(1);
    fetchFacturations();
  };

  // Handler pour changer la page
  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  // Fonction pour obtenir la couleur du badge en fonction du type de contrat
  const getBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'contractuelle':
        return 'primary';
      case 'extra':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Colonnes pour react-table
  const columns = useMemo(
    () => [
      {
        Header: 'Nom du Prestataire',
        accessor: 'nomPrestataire',
      },
      {
        Header: 'Type de Contrat',
        accessor: 'contratType',
        Cell: ({ value }) => (
          <CBadge color={getBadgeColor(value)}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </CBadge>
        ),
      },
      {
        Header: 'Numéro de Facture',
        accessor: 'numeroFacture',
      },
      {
        Header: 'Date d\'Émission',
        accessor: 'dateEmission',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Désignation',
        accessor: 'designation',
      },
      {
        Header: 'Nombre de Véhicules',
        accessor: 'nbrVehicule',
      },
      {
        Header: 'Nombre de Jours',
        accessor: 'nbrJour',
      },
      {
        Header: 'Prix Unitaire (AR)',
        accessor: 'prixUnitaire',
        Cell: ({ value }) => value.toLocaleString('fr-FR') + ' AR',
      },
      {
        Header: 'Montant Total (AR)',
        accessor: 'montantTotal',
        Cell: ({ value }) => value.toLocaleString('fr-FR') + ' AR',
      },
      {
        Header: 'Carburants (AR)',
        accessor: 'carburants',
        Cell: ({ value }) => value.toLocaleString('fr-FR') + ' AR',
      },
      {
        Header: 'Net à Payer (AR)',
        accessor: 'netAPayer',
        Cell: ({ value }) => value.toLocaleString('fr-FR') + ' AR',
      },
    ],
    []
  );

  // Table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: facturations,
      defaultColumn: { minWidth: 150, width: 200, maxWidth: 400 },
    },
    useFlexLayout,
    useResizeColumns
  );

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    if (!facturations.length) {
      alert('Aucune donnée à exporter.');
      return;
    }

    const headers = columns.map(col => col.Header);
    const rowsCSV = facturations.map(facturation => columns.map(col => {
      const value = facturation[col.accessor];
      if (col.accessor === 'contratType') {
        return facturation[col.accessor].charAt(0).toUpperCase() + facturation[col.accessor].slice(1);
      } else if (col.accessor === 'dateEmission') {
        return new Date(facturation[col.accessor]).toLocaleDateString();
      } else if (['prixUnitaire', 'montantTotal', 'carburants', 'netAPayer'].includes(col.accessor)) {
        return value.toLocaleString('fr-FR') + ' AR';
      }
      return facturation[col.accessor];
    }));

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rowsCSV].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'facturations.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
          <strong>Liste des Facturations</strong>
          </CCardHeader>
          <CCardBody>
            {/* Affichage des messages d'erreur */}
            {error && (
              <CAlert color="danger" dismissible onDismiss={() => setError('')}>
                {error}
              </CAlert>
            )}

            {/* Formulaire de filtres */}
            <CForm onSubmit={handleFilterSubmit} className="mb-4">
              <CRow className="g-3 align-items-end">
                <CCol md={3}>
                  <CFormLabel htmlFor="dateDebut" className="col-form-label">
                    Date de Début
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    id="dateDebut"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dateFin" className="col-form-label">
                    Date de Fin
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    id="dateFin"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="contratType" className="col-form-label">
                    Type de Contrat
                  </CFormLabel>
                  <CFormSelect
                    id="contratType"
                    value={contratType}
                    onChange={(e) => setContratType(e.target.value)}
                  >
                    <option value="tous">Tous</option>
                    <option value="contractuelle">Contractuelle</option>
                    <option value="extra">Extra</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3} className="d-flex">
                  <CButton type="submit" color="primary" className="w-100 me-2">
                    <CIcon icon={cilSearch} className="me-2" />
                    Rechercher
                  </CButton>
                  <CButton type="button" color="secondary" className="w-100" onClick={handleReset}>
                    Réinitialiser
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {/* Boutons Export CSV et Ajouter une Facture */}
            <CRow className="mb-3">
              <CCol className="d-flex justify-content-end">
                <CButton color="success" onClick={exportToCSV} className="me-2" style={{ color: 'white' }}>
                  <CIcon icon={cilCloudDownload} className="me-2" style={{ color: 'white' }} />
                  Exporter en CSV
                </CButton>

                <Link to="/facture">
                <CButton color="primary">
                  <CIcon icon={cilPlus} className="me-2" />
                  Ajouter une facture
                </CButton>
                </Link>

                <CTooltip content="Archive PDF" placement="top">
                <Link to="/facture_pdf">
                  <CButton color="dark" className="ms-2">
                    <CIcon icon={cilFolderOpen} className="me-1" />
                  </CButton>
                </Link>
              </CTooltip>
              </CCol>
            </CRow>

            {/* Tableau avec react-table */}
            <Styles>
              <div className="table-container">
                <div {...getTableProps()} className="table">
                  <div>
                    {headerGroups.map(headerGroup => (
                      <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map(column => (
                          <div {...column.getHeaderProps()} className="th">
                            {column.render('Header')}
                            {/* Ajout des handles de redimensionnement */}
                            {column.canResize && (
                              <div
                                {...column.getResizerProps()}
                                className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div {...getTableBodyProps()} className="tbody">
                    {loading ? (
                      <div className="tr">
                        <div className="td" colSpan="11" style={{ textAlign: 'center' }}>
                          <CSpinner color="primary" />
                        </div>
                      </div>
                    ) : rows.length > 0 ? (
                      rows.map(row => {
                        prepareRow(row);
                        return (
                          <div {...row.getRowProps()} className="tr">
                            {row.cells.map(cell => (
                              <div {...cell.getCellProps()} className="td">
                                {cell.render('Cell')}
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <div className="tr">
                        <div className="td" colSpan="11" style={{ textAlign: 'center' }}>
                          Aucune facturation trouvée.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Styles>

            {/* Totaux avec CBadge */}
            <CRow className="mt-3">
              <CCol>
                <ul className="list-group list-group-horizontal">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Total Montant :</strong>
                    <CBadge color="info" pill>
                      {montantFinal.toLocaleString('fr-FR')} AR
                    </CBadge>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Net à Payer :</strong>
                    <CBadge color="success" pill>
                      {netPayerFinal.toLocaleString('fr-FR')} AR
                    </CBadge>
                  </li>
                </ul>
              </CCol>
            </CRow>

            {/* Pagination */}
            <CRow className="mt-3">
              <CCol className="d-flex justify-content-center">
                <CPagination aria-label="Page navigation example" style={{ cursor: pageNumber === 0 ? 'not-allowed' : 'pointer' }}>
                  <CPaginationItem
                    disabled={pageNumber === 1}
                    onClick={() => handlePageChange(pageNumber - 1)}
                  >
                    {/* <CIcon icon={cilArrowLeft} />  */}
                    Précédent
                  </CPaginationItem>
                  {/* Afficher quelques pages autour de la page actuelle */}
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <CPaginationItem
                      key={page}
                      active={page === pageNumber}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={pageNumber === totalPages}
                    onClick={() => handlePageChange(pageNumber + 1)}
                  >
                    Suivant 
                    {/* <CIcon icon={cilArrowRight} /> */}
                  </CPaginationItem>
                </CPagination>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Facture_list;
