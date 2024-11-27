import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CForm
} from '@coreui/react';

const Cars = () => {
  const [carsData, setCarsData] = useState({
    nom_car: '',
    immatriculation: '',
    nombre_place: 0,
    type_cars_id: '',
    prestataire_id: '',
    litre_consommation: 0,
    km_consommation: 0,
    prix_consommation: 0,
    type_carburant: ''
  });
  const [type_cars, setType_cars] = useState([]);
  const [prestataire, setPrestataire] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const fetchData = async () => {
      try {
        const [type_carsResponse, prestataireResponse] = await Promise.all([
          axios.get(`${baseURL}/api/type_cars/liste`),
          axios.get(`${baseURL}/api/prestataire/liste`)
        ]);
        setType_cars(type_carsResponse.data);
        setPrestataire(prestataireResponse.data);
      } catch (error) {
        console.error('Erreur de récupération des données:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setCarsData({
      ...carsData,
      [id]: id === 'type_cars_id' || id === 'prestataire_id' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const formErrors = validateForm();
    setFormErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const requestData = {
          CarsDto: {
            nom_car: carsData.nom_car,
            immatriculation: carsData.immatriculation,
            nombre_place: carsData.nombre_place,
            litre_consommation: carsData.litre_consommation,
            km_consommation: carsData.km_consommation,
            prix_consommation: carsData.prix_consommation,
            type_carburant: carsData.type_carburant,
          },
          Type_carsDto: {
            id: carsData.type_cars_id
          },
          PrestaitaireDto: {
            id: carsData.prestataire_id
          }
        };
        await axios.post(`${baseURL}/api/cars/ajout`, requestData);
        alert('Véhicule ajouté avec succès');
        resetForm();
      } catch (error) {
        handleError(error);
      }
    }
  };

  const resetForm = () => {
    setCarsData({
      nom_car: '',
      immatriculation: '',
      nombre_place: 0,
      type_cars_id: '',
      prestataire_id: '',
      litre_consommation: 0,
      km_consommation: 0,
      prix_consommation: 0,
      type_carburant: ''
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!carsData.nom_car) errors.nom_car = 'Le nom du car est obligatoire.*';
    if (!carsData.immatriculation) errors.immatriculation = 'L\'immatriculation est obligatoire.*';
    if (!carsData.nombre_place) errors.nombre_place = 'Le nombre de place est obligatoire.*';
    if (!carsData.prestataire_id) errors.prestataire_id = 'Choix de prestataire obligatoire.*';
    if (!carsData.type_cars_id) errors.type_cars_id = 'Choix de type du car obligatoire.*';
    return errors;
  };

  const handleError = (err) => {
    setError(err.response ? err.response.data.errors : 'Erreur du serveur !');
  };

  return (
    <CRow>
      <CCol xs={12} md={12}>
        <CCard>
        <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
            <strong>Ajout d'un véhicule / car</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-4">
                <CFormLabel htmlFor="nom_car">Nom du car</CFormLabel>
                <CFormInput
                  type="text"
                  id="nom_car"
                  value={carsData.nom_car}
                  onChange={handleInputChange}
                  placeholder="Entrer le nom du véhicule"
                  invalid={!!formErrors.nom_car}
                />
                {formErrors.nom_car && <div className="invalid-feedback">{formErrors.nom_car}</div>}
              </div>

              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel htmlFor="immatriculation">Immatriculation</CFormLabel>
                  <CFormInput
                    type="text"
                    id="immatriculation"
                    value={carsData.immatriculation}
                    onChange={handleInputChange}
                    placeholder="Saisir l'immatriculation"
                    invalid={!!formErrors.immatriculation}
                  />
                  {formErrors.immatriculation && <div className="invalid-feedback">{formErrors.immatriculation}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="nombre_place">Nombre de places</CFormLabel>
                  <CFormInput
                    type="number"
                    id="nombre_place"
                    value={carsData.nombre_place}
                    onChange={handleInputChange}
                    placeholder="Nombre de places"
                    invalid={!!formErrors.nombre_place}
                  />
                  {formErrors.nombre_place && <div className="invalid-feedback">{formErrors.nombre_place}</div>}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel htmlFor="type_cars_id">Type de car</CFormLabel>
                  <CFormSelect
                    id="type_cars_id"
                    value={carsData.type_cars_id}
                    onChange={handleInputChange}
                    invalid={!!formErrors.type_cars_id}
                  >
                    <option value="">Sélectionner le type du véhicule</option>
                    {type_cars.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.type_cars}
                      </option>
                    ))}
                  </CFormSelect>
                  {formErrors.type_cars_id && <div className="invalid-feedback">{formErrors.type_cars_id}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="prestataire_id">Prestataire</CFormLabel>
                  <CFormSelect
                    id="prestataire_id"
                    value={carsData.prestataire_id}
                    onChange={handleInputChange}
                    invalid={!!formErrors.prestataire_id}
                  >
                    <option value="">Sélectionner un prestataire</option>
                    {prestataire.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.prestataire}
                      </option>
                    ))}
                  </CFormSelect>
                  {formErrors.prestataire_id && <div className="invalid-feedback">{formErrors.prestataire_id}</div>}
                </CCol>
              </CRow>

              <div className="mb-4">
                <CFormLabel htmlFor="type_carburant">Type de consommation</CFormLabel>
                <CFormSelect
                  id="type_carburant"
                  value={carsData.type_carburant}
                  onChange={handleInputChange}
                  invalid={!!formErrors.type_carburant}
                >
                  <option value="">Sélectionner le type de carburant</option>
                  <option value="essence">Essence</option>
                  <option value="gasoil">Gasoil</option>
                </CFormSelect>
                {formErrors.type_carburant && <div className="invalid-feedback">{formErrors.type_carburant}</div>}
              </div>

              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormLabel htmlFor="litre_consommation">Consommation (L)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="litre_consommation"
                    value={carsData.litre_consommation}
                    onChange={handleInputChange}
                    placeholder="Litre"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="km_consommation">Km par Litre</CFormLabel>
                  <CFormInput
                    type="number"
                    id="km_consommation"
                    value={carsData.km_consommation}
                    onChange={handleInputChange}
                    placeholder="Km par litre"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="prix_consommation">Prix par Litre</CFormLabel>
                  <CFormInput
                    type="number"
                    id="prix_consommation"
                    value={carsData.prix_consommation}
                    onChange={handleInputChange}
                    placeholder="Prix en Ariary"
                  />
                </CCol>
              </CRow>

              <CButton type="submit" color="primary">Ajouter le car</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Cars;
