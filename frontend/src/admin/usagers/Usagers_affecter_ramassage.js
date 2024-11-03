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
  CFormSwitch
} from '@coreui/react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const Usagers_affecter_ramassage = () => {
  const { usagerId } = useParams();

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [fokontany, setFokontany] = useState([]);
  const [selectedFokontany, setSelectedFokontany] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [axes, setAxes] = useState([]);
  const [axeRamassageData, setAxeRamassageData] = useState({
    lieu_ramassage: '',
    heure_ramassage: '',
    axe_ramassage_id: '',
    est_actif: false
  });
  const [usager, setUsager] = useState(null);
  const [error, setError] = useState('');

  // Fetch region data for districts and fokontany
  const fetchRegionData = async () => {
    try {
      const response = await fetch('./src/admin/usagers/region.json');
      const jsonData = await response.json();
      setRegionData(jsonData);
      const districtList = [];

      Object.values(jsonData).forEach(region => {
        Object.keys(region).forEach(district => {
          if (!districtList.some(d => d.value === district)) {
            districtList.push({ value: district, label: district });
          }
        });
      });

      setDistricts(districtList);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON', error);
    }
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);

    if (!regionData) return;

    const fokontanyList = [];
    Object.values(regionData).forEach(region => {
      if (region[selectedOption.value]) {
        Object.values(region[selectedOption.value]).forEach(commune => {
          commune.forEach(item => {
            fokontanyList.push({ value: item.fokontany, label: item.fokontany });
          });
        });
      }
    });
    setFokontany(fokontanyList);
  };

  // Fetch Usager Details
  // Fetch Usager Details
const fetchUsagerDetails = async () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  
  try {
    const response = await axios.get(`${baseURL}/api/axe_usagers_ramassage_depot/liste_axe_usager_ramassage_depot/${usagerId}`);
    console.log(response.data);
    setUsager(response.data);

    // Pré-remplir seulement lieu de ramassage, heure de ramassage, axe et état actif
    if (response.data) {
      setAxeRamassageData({
        lieu_ramassage: response.data.lieuRamassage || '',
        heure_ramassage: response.data.heureRamassage || '',
        axe_ramassage_id: response.data.axeIdRamassage || '',
        est_actif: response.data.estActifRamassage || false
      });
      // NE PAS pré-remplir district et fokontany
      setSelectedDistrict({ value: response.data.districtRamassage || '', label: response.data.districtRamassage || '' });
      setSelectedFokontany({ value: response.data.fokontanyRamassage || '', label: response.data.fokontanyRamassage || '' });
    }
  } catch (error) {
    setError('Erreur lors de la récupération des détails de l\'usager.');
  }
};


  // Fetch Axes data
  const fetchAxes = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/api/axe/liste`);
      setAxes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchRegionData();
    fetchAxes();
    fetchUsagerDetails();
  }, [usagerId]);

  // Handle changes in Ramassage
  const handleRamassageChange = (event) => {
    const { id, value } = event.target;
    setAxeRamassageData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle switch change for activating ramassage
  const handleSwitchChange = () => {
    setAxeRamassageData((prevData) => ({
      ...prevData,
      est_actif: !prevData.est_actif
    }));
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const usagerPayload = {
      Ramassage: {
        lieu: axeRamassageData.lieu_ramassage,
        heure_ramassage: axeRamassageData.heure_ramassage,
        axe_id: axeRamassageData.axe_ramassage_id,
        est_actif: axeRamassageData.est_actif,
        district: selectedDistrict ? selectedDistrict.value : null,
        fokontany: selectedFokontany ? selectedFokontany.value : null,
      }
    };

    try {
      const response = await axios.put(`${baseURL}/api/axe_usagers_ramassage_depot/update_usager_ramassage/${usagerId}`, usagerPayload);
      alert('Usager affecté avec succès !');
      //resetForm();
    } catch (err) {
      handleError(err);
    }
  };

  const resetForm = () => {
    setAxeRamassageData({
      lieu_ramassage: '',
      heure_ramassage: '',
      axe_ramassage_id: '',
      est_actif: false
    });
    setSelectedDistrict(null);
    setSelectedFokontany(null);
  };

  const handleError = (err) => {
    if (err.response) {
      console.error('Erreur de réponse:', err.response.status, err.response.data);
    } else if (err.request) {
      console.error('Erreur de requête:', err.request);
    } else {
      console.error('Erreur:', err.message);
    }
  };

  return (
    <CRow>
      <CCol xs={{ span: 0, offset: 0 }}>
        <CCard>
          <CCardHeader>
            <strong>Affectation de ramassage</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <div>
                <CFormLabel>District</CFormLabel>
                <Select 
                  value={selectedDistrict} 
                  onChange={handleDistrictChange} 
                  options={districts} 
                  placeholder="Sélectionnez un District"
                />
              </div>
              <div>
                {fokontany.length > 0 && (
                  <>
                    <CFormLabel>Fokontany</CFormLabel>
                    <Select
                      value={selectedFokontany} 
                      onChange={(option) => setSelectedFokontany(option)} 
                      options={fokontany}
                      placeholder="Sélectionnez un Fokontany"
                    />
                  </>
                )}
              </div>
              <CFormLabel htmlFor="lieu_ramassage">Lieu de Ramassage</CFormLabel>
              <CFormInput
                id="lieu_ramassage"
                value={axeRamassageData.lieu_ramassage || ''}
                onChange={handleRamassageChange}
                required
              />
              <CFormLabel htmlFor="heure_ramassage">Heure de Ramassage</CFormLabel>
              <CFormInput
                id="heure_ramassage"
                type="time"
                step="2"
                value={axeRamassageData.heure_ramassage}
                onChange={handleRamassageChange}
                required
              />
              <CFormLabel htmlFor="axe_ramassage_id">Axe de Ramassage</CFormLabel>
              <CFormSelect
                id="axe_ramassage_id"
                value={axeRamassageData.axe_ramassage_id}
                onChange={handleRamassageChange}
                required
              >
                {axes.map(axe => (
                  <option key={axe.id} value={axe.id}>{axe.axe}</option>
                ))}
              </CFormSelect>
              <CFormSwitch
                label="Activer"
                checked={axeRamassageData.est_actif}
                onChange={handleSwitchChange}
              />
              <CButton type="submit" color="primary">Affecter</CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Usagers_affecter_ramassage;
