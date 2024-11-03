import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import React Select
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
  CFormSwitch,
} from '@coreui/react';

const Usagers_ramassage = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [fokontany, setFokontany] = useState([]);

  // Function Fetch district and fokontany data
  const fetchRegionData = async () => {
    try {
      const response = await fetch('./src/admin/usagers/region.json');
      const jsonData = await response.json();

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

  useEffect(() => {
    fetchRegionData();
  }, []);

  // Handle district selection and fetch corresponding fokontany
  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);

    fetch('./src/admin/usagers/region.json')
      .then((response) => response.json())
      .then((jsonData) => {
        Object.values(jsonData).forEach(region => {
          const fokontanyList = [];

          // Look for the selected district
          if (region[selectedOption.value]) {
            Object.values(region[selectedOption.value]).forEach(commune => {
              commune.forEach(item => {
                fokontanyList.push({ value: item.fokontany, label: item.fokontany });
              });
            });
          }
          setFokontany(fokontanyList);
        });
      })
      .catch((error) => console.error('Erreur lors de la récupération des fokontany', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('heure et lieu de rammassage ajouté');
  };

  return (
    <CRow>
      <CCol xs={{ span: 0, offset: 0 }}>
        <CCard>
          <CCardHeader>
            <strong>Ajout : heure / lieu de ramassage</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="lieu_ramassage">Lieu de ramassage</CFormLabel>
                <CFormInput type="text" id="lieu_ramassage" placeholder="saisir le lieu de ramassage" />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="heure_ramassage">Heure de ramassage</CFormLabel>
                <CFormInput type="time" id="heure_ramassage" placeholder="saisir l'heure" />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="axe">Axe</CFormLabel>
                <CFormSelect id="axe">
                  <option value="">Sélectionner l'Axe</option>
                  <option value="Ivato">Ivato</option>
                  <option value="Analakely">Analakely</option>
                  <option value="autre">Autre</option>
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="statut">Statut</CFormLabel>
                <CFormSwitch label="Non Actif / Actif" id="formSwitchCheckDefaultXL" defaultChecked={false} />
              </div>

              <div>
                {/* District Selection */}
                <CFormLabel>District</CFormLabel>
                <Select 
                  value={selectedDistrict} 
                  onChange={handleDistrictChange} 
                  options={districts} 
                  placeholder="Sélectionnez un District"
                />

                {/* Fokontany Selection */}
                {fokontany.length > 0 && (
                  <>
                    <CFormLabel>Fokontany</CFormLabel>
                    <Select
                      options={fokontany}
                      placeholder="Sélectionnez un Fokontany"
                    />
                  </>
                )}
              </div>

              <CButton type="submit" color="success">Ajouter</CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Usagers_ramassage;
