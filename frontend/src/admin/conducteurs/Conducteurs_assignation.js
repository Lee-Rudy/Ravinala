import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
  CRow
} from '@coreui/react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';

const Conducteurs_assignation = () => {
  const { assignationId } = useParams();
  const navigate = useNavigate();
  const [conducteurs, setConducteurs] = useState([]);
  const [axes, setAxes] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedConducteur, setSelectedConducteur] = useState(null);
  const [selectedAxe, setSelectedAxe] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const fetchData = async () => {
      try {
        const conducteursResponse = await axios.get(`${baseURL}/api/conducteurs/liste`);
        setConducteurs(
          conducteursResponse.data.map((conducteur) => ({
            value: conducteur.id,
            label: conducteur.nom,
          }))
        );

        const axesResponse = await axios.get(`${baseURL}/api/axe/liste`);
        setAxes(axesResponse.data);

        const carsResponse = await axios.get(`${baseURL}/api/cars/liste`);
        setCars(carsResponse.data);

        if (assignationId) {
          const assignationResponse = await axios.get(`${baseURL}/api/axe_conducteurs/details/${assignationId}`);
          const assignationData = assignationResponse.data;

          setSelectedConducteur({
            value: assignationData.conducteur_id,
            label: assignationData.nom_conducteur,
          });
          setSelectedAxe(assignationData.axe_id);
          setSelectedCar(assignationData.car_id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [assignationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const data = {
      id:assignationId,
      conducteurs_id: selectedConducteur ? selectedConducteur.value : null,
      axe_id: selectedAxe,
      cars_id: selectedCar,
    };

    try {
      if (assignationId) {
        await axios.put(`${baseURL}/api/axe_conducteurs/update/${assignationId}`, data);
        alert('Assignation mise à jour avec succès');
      } else {
        await axios.post(`${baseURL}/api/axe_conducteurs/ajouter`, data);
        alert('Assignation ajoutée avec succès');
      }
      navigate('/axe_conducteurs'); // Redirige vers la liste des assignations
    } catch (error) {
      console.error("Erreur lors de l'assignation :", error);
      // setMessage("Erreur lors de l'assignation");
      alert("Erreur lors de l'assignation");
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={8}>
        <CCard>
          <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
            <strong>{assignationId ? 'Mettre à jour' : 'Ajouter'} une Assignation</strong>
          </CCardHeader>
          <CCardBody>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Conducteur</CFormLabel>
                <Select
                  options={conducteurs}
                  value={selectedConducteur}
                  onChange={setSelectedConducteur}
                  placeholder="Rechercher un conducteur"
                  isClearable
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Axe</CFormLabel>
                <CFormSelect
                  value={selectedAxe}
                  onChange={(e) => setSelectedAxe(e.target.value)}
                >
                  <option value="">Sélectionner un axe</option>
                  {axes.map((axe) => (
                    <option key={axe.id} value={axe.id}>
                      {axe.axe}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Voiture</CFormLabel>
                <CFormSelect
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(e.target.value)}
                >
                  <option value="">Sélectionner une voiture</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.nom_car}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <CButton color="primary" type="submit">
                {assignationId ? 'Changer l\'assignation' : 'Assigner'}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Conducteurs_assignation;
