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
  CFormSwitch,
  CRow
} from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';

const Axe = () => {
  const { axeId } = useParams(); // Récupère l'axeId depuis l'URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    axe: '',
    duree_trajet: '',
    distance_km: ''
  });
  const [isDeferred, setIsDeferred] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Charger les données de l'axe existant pour la modification
  useEffect(() => {
    if (axeId) {
      const fetchAxeData = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/axe/liste/${axeId}`);
          setFormData({
            axe: response.data.axe,
            duree_trajet: response.data.duree_trajet || '',
            distance_km: response.data.distance_km || ''
          });
          setIsDeferred(response.data.duree_trajet === 0 || response.data.distance_km === 0);
        } catch (error) {
          console.error('Erreur lors de la récupération des données de l\'axe :', error);
        }
      };
      fetchAxeData();
    }
  }, [axeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDeferredChange = () => {
    setIsDeferred(!isDeferred);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      axe: formData.axe,
      ...(isDeferred ? {} : { duree_trajet: formData.duree_trajet, distance_km: formData.distance_km })
    };

    try {
      if (axeId) {
        // Mode modification
        await axios.put(`${baseURL}/api/axe/update/${axeId}`, dataToSend);
        alert('Axe modifié avec succès');
      } else {
        // Mode ajout
        await axios.post(`${baseURL}/api/axe/ajout`, dataToSend);
        alert('Axe ajouté avec succès');
      }
      navigate('/axe'); // redirect
    } catch (error) {
      console.error(error);
      alert(`Erreur lors de ${axeId ? 'la modification' : "l'ajout"} de l'axe`);
    }
  };

  return (
    <CCard>
      <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>{axeId ? 'Modifier' : 'Ajouter'} un Axe</CCardHeader>
      <CCardBody>
        <form onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md="13">
              <CFormLabel htmlFor="axe">Nom de l'Axe</CFormLabel>
              <CFormInput
                type="text"
                id="axe"
                name="axe"
                value={formData.axe}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="13">
              <CFormLabel htmlFor="duree_trajet">Durée de Trajet (en minutes)</CFormLabel>
              <CFormInput
                type="number"
                id="duree_trajet"
                name="duree_trajet"
                value={formData.duree_trajet}
                onChange={handleChange}
                disabled={isDeferred}
                required={!isDeferred}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="13">
              <CFormLabel htmlFor="distance_km">Distance (km)</CFormLabel>
              <CFormInput
                type="number"
                id="distance_km"
                name="distance_km"
                value={formData.distance_km}
                onChange={handleChange}
                disabled={isDeferred}
                required={!isDeferred}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="13">
              <CFormSwitch
                label="Remplir plus tard (durée de trajet, distance km)"
                id="deferSwitch"
                checked={isDeferred}
                onChange={handleDeferredChange}
              />
            </CCol>
          </CRow>
          <CButton type="submit" color="primary">{axeId ? 'Modifier' : 'Ajouter'} l'Axe</CButton>
        </form>
      </CCardBody>
    </CCard>
  );
}

export default Axe;
