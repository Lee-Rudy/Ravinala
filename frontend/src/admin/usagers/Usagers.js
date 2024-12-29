import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CFormSwitch
} from '@coreui/react';

import Select from 'react-select';

const Usagers = () => {

  //district, fokontany ramassage
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [fokontany, setFokontany] = useState([]);
  const [selectedFokontany, setSelectedFokontany] = useState(null);

  //district, fokontany depot
  const [selectedDistrictDepot, setSelectedDistrictDepot] = useState(null);
  const [fokontanyDepot, setFokontanyDepot] = useState([]);
  const [selectedFokontanyDepot, setSelectedFokontanyDepot] = useState(null);

  const [regionData, setRegionData] = useState(null);


  //Function Fetch district and fokontany data
  const fetchRegionData = async () => {
    try {
      const response = await fetch('./src/admin/usagers/region.json');
      const jsonData = await response.json();
  
      // Stocker jsonData dans l'état
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

  useEffect(() => {
    fetchRegionData();
  }, []);

  // Handle district selection and fetch corresponding fokontany
  const handleDistrictChange = (selectedOption) => {
  setSelectedDistrict(selectedOption);

  
  // Vérifier si regionData est défini
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



const handleDistrictChangeDepot = (selectedOption) => {
  setSelectedDistrictDepot(selectedOption);

  
  // Vérifier si regionData est défini
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
  setFokontanyDepot(fokontanyList);

};

  //======================================================


  //variables
  const [genres, setGenres] = useState([]);
  const [postes, setPostes] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [axes, setAxes] = useState([]);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  //variables to change form step by step
  //here, we have 3 steps for our forms
  const [step, setStep] = useState(1);


  //keep state usagers
  const [usagerData, setUsagerData] = useState({
    matricule: '',
    nom: '',
    prenom:'',
    contact: '',
    adresse: '',
    mail_ravinala: '',
    genre_id: '',
    poste_id: '',
    departement_id: ''
  });

  //keep state usagers
  const [axeRamassageData, setAxeRamassageData] = useState({
    lieu_ramassage: '',
    heure_ramassage: '',
    axe_ramassage_id: '',
    //toogle swich default (false) , that is to say , disabled (désactivé) 
    est_actif: false,
    district:'',
    fokontany:''
  });

  //keep state usagers
  const [axeDepotData, setAxeDepotData] = useState({
    lieu_depot: '',
    heure_depot: '',
    axe_depot_id: '',
    //toogle swich default (false) , that is to say , disabled (désactivé) 
    est_actif: false,
    district:'',
    fokontany:''
  });

  //function using to skip a step form
  //explication : when clicking a button "suivant" , calls the ValidateForm function for fiels checking if they are not ampty , it applies for each field and each form 
  const nextStep = async () => {
    const formErrors = await validateForm(step);
  
    if (Object.keys(formErrors).length > 0) {
      setFormErrors(formErrors);
      return;
    }
  
    setStep(step + 1);
  };

  //function using to back step form : use the button "précedent"
  const prevStep = () => setStep(step - 1);


  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const fetchData = async () => {
      try {
        const [genresResponse, postesResponse, departementsResponse, axesResponse] = await Promise.all([
          axios.get(`${baseURL}/api/genre/liste`),
          axios.get(`${baseURL}/api/poste/liste`),
          axios.get(`${baseURL}/api/departement/liste`),
          axios.get(`${baseURL}/api/axe/liste`)
        ]);
        setGenres(genresResponse.data);
        setPostes(postesResponse.data);
        setDepartements(departementsResponse.data);
        setAxes(axesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  //saisi for postes, genres, departements 
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUsagerData({
      ...usagerData,
      [id]: value
    });
  };

  //lieu, heure, axe
  const handleRamassageChange = (event) => {
    const { id, value } = event.target;
    setAxeRamassageData({
      ...axeRamassageData,
      [id]: value
    });
  };

  //lieu, heure, axe
  const handleDepotChange = (event) => {
    const { id, value } = event.target;
    setAxeDepotData({
      ...axeDepotData,
      [id]: value
    });
  };

  //function toggle switch 'est_actif'
  const handleSwitchChange = (type) => {
    if (type === 'ramassage') {
      setAxeRamassageData((prevData) => ({
        ...prevData,
        est_actif: !prevData.est_actif
      }));
    } else if (type === 'depot') {
      setAxeDepotData((prevData) => ({
        ...prevData,
        est_actif: !prevData.est_actif
      }));
    }
  };


//========================================================================
    //validate if matricule doesn't once exits 
    const validateMatriculeUnique = async (matricule) => {
      try {
        // to avoid the broken case (convertir en miniscule pour éviter la casse)
        const normalizedMatricule = matricule.toLowerCase();

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/usagers/liste`);
    
        //check if this 'matricule usagers' exists
        const matriculeExists = response.data.some(usager => 
          usager.matricule.toLowerCase() === normalizedMatricule
        );
        
        return matriculeExists;//return true if exists
      } catch (error) {
        console.error("Erreur lors de la vérification du matricule:", error);
        return false;
      }
    };

  //function validate form:
  const validateForm = async (step) => {
    const errors = {};
  
    // Validation de l'usager
    if (step === 1) {
      if (!usagerData.matricule) {
        errors.matricule = 'Le matricule est obligatoire.*';
      } else {
        const matriculeExists = await validateMatriculeUnique(usagerData.matricule);
        if (matriculeExists) {
          errors.matricule = 'Ce matricule est déjà utilisé.*';
        }
      }
      if (!usagerData.nom) errors.nom = 'Le nom est obligatoire.*';
      if (!usagerData.prenom) errors.prenom = 'Le prénom est obligatoire.*';
      if (!usagerData.contact) errors.contact = 'Le contact est obligatoire.*';
      if (!usagerData.adresse) errors.adresse = 'L\'adresse est obligatoire.*';
      if (!usagerData.genre_id) errors.genre_id = 'Le genre est obligatoire.*';
      if (!usagerData.poste_id) errors.poste_id = 'Le poste est obligatoire.*';
      if (!usagerData.departement_id) errors.departement_id = 'Le département est obligatoire.*';
    }
  
    // Validation du ramassage
    if (step === 2) {
      if (!axeRamassageData.lieu_ramassage) errors.lieu_ramassage = 'Le lieu de ramassage est obligatoire.*';
      if (!axeRamassageData.heure_ramassage) errors.heure_ramassage = 'L\'heure de ramassage est obligatoire.*';
      if (!axeRamassageData.axe_ramassage_id) errors.axe_ramassage_id = 'L\'axe de ramassage est obligatoire.*';
    }
  
    // Validation du dépôt
    if (step === 3) {
      if (!axeDepotData.lieu_depot) errors.lieu_depot = 'Le lieu de dépôt est obligatoire.*';
      if (!axeDepotData.heure_depot) errors.heure_depot = 'L\'heure de dépôt est obligatoire.*';
      if (!axeDepotData.axe_depot_id) errors.axe_depot_id = 'L\'axe de dépôt est obligatoire.*';
    }
  
    return errors;
  };
  

  

  //Send data to your controller c# : controllers/usagers/Usagers_controller.cs
  const handleSubmit = async (event) => {

    event.preventDefault();//prevents loading the page (empêche le chargement de la page)

    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const usagerPayload = {
        UsagerDto: {
            ...usagerData
        },
        Ramassage: {
            lieu: axeRamassageData.lieu_ramassage,
            heure_ramassage: axeRamassageData.heure_ramassage,
            axe_id: axeRamassageData.axe_ramassage_id,
            est_actif: axeRamassageData.est_actif,
            district:selectedDistrict ? selectedDistrict.value : null,
            fokontany:selectedFokontany ? selectedFokontany.value : null
        },
        Depot: {
            lieu: axeDepotData.lieu_depot,
            heure_depot: axeDepotData.heure_depot,
            axe_id: axeDepotData.axe_depot_id,
            est_actif: axeDepotData.est_actif,
            district:selectedDistrictDepot ? selectedDistrictDepot.value : null,
            fokontany:selectedFokontanyDepot ? selectedFokontanyDepot.value : null
        }
    };

    try {
        const response = await axios.post(`${baseURL}/api/usagers/ajout`, usagerPayload);
        console.log(response);
        alert('Usager ajouté avec succès !');

        // Reset from after send data 
        resetForm();
    } catch (err) {
        handleError(err);
    }
};

//Reset form
const resetForm = () => {
  setUsagerData({
    matricule: '',
    nom: '',
    prenom:'',
    contact: '',
    adresse: '',
    mail_ravinala: '',
    genre_id: '',
    poste_id: '',
    departement_id: ''
  });
  setAxeRamassageData({
    lieu_ramassage: '',
    heure_ramassage: '',
    axe_ramassage_id: '',
    est_actif: false,
    selectedDistrict: '',
    selectedFokontany: ''
  });
  setAxeDepotData({
    lieu_depot: '',
    heure_depot: '',
    axe_depot_id: '',
    est_actif: false,
    selectedDistrictDepot: '',
    selectedFokontanyDepot: ''
  });
  setSelectedDistrict(null);
  setSelectedFokontany(null);
  setSelectedDistrictDepot(null);
  setSelectedFokontanyDepot(null);
  setError('');
};



const handleError = (err) => {
  if (err.response) {
    console.error('Erreur de réponse:', err.response.data);
    setError(err.response.data.message || 'Erreur lors de la requête.');
  } else if (err.request) {
    console.error('Erreur de requête:', err.request);
    setError('Aucune réponse du serveur. Vérifiez votre connexion réseau.');
  } else {
    console.error('Erreur:', err.message);
    setError('Erreur du serveur !');
  }
};


  switch(step) {
    case 1:
      return (
        <CRow className="justify-content-center">
          <CCol xs={12} md={12}>
            <CCard>
            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                <strong>Ajout d'un Usager</strong>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  {/* Row 1: Matricule and Nom */}
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
                      <CFormInput
                        type="text"
                        id="matricule"
                        value={usagerData.matricule}
                        onChange={handleInputChange}
                        placeholder="Entrer le matricule"
                        invalid={!!formErrors.matricule}
                        style={{ textTransform: 'uppercase' }} 
                      />
                      {formErrors.matricule && <div className="invalid-feedback">{formErrors.matricule}</div>}
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="nom">Nom</CFormLabel>
                      <CFormInput
                        type="text"
                        id="nom"
                        value={usagerData.nom}
                        onChange={handleInputChange}
                        placeholder="Entrer le nom"
                        invalid={!!formErrors.nom}
                      />
                      {formErrors.nom && <div className="invalid-feedback">{formErrors.nom}</div>}
                    </CCol>
                  </CRow>
    
                  {/* Row 2: Prénom and Contact */}
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="prenom">Prénom</CFormLabel>
                      <CFormInput
                        type="text"
                        id="prenom"
                        value={usagerData.prenom}
                        onChange={handleInputChange}
                        placeholder="Entrer le prénom"
                        invalid={!!formErrors.prenom}
                      />
                      {formErrors.prenom && <div className="invalid-feedback">{formErrors.prenom}</div>}
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="contact">Contact</CFormLabel>
                      <CFormInput
                        type="text"
                        id="contact"
                        value={usagerData.contact}
                        onChange={handleInputChange}
                        placeholder="Ajouter un '/' si plusieurs contacts"
                        invalid={!!formErrors.contact}
                      />
                      {formErrors.contact && <div className="invalid-feedback">{formErrors.contact}</div>}
                    </CCol>
                  </CRow>
    
                  {/* Adresse */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="adresse">Adresse</CFormLabel>
                    <CFormInput
                      type="text"
                      id="adresse"
                      value={usagerData.adresse}
                      onChange={handleInputChange}
                      placeholder="Entrer l'adresse"
                      invalid={!!formErrors.adresse}
                    />
                    {formErrors.adresse && <div className="invalid-feedback">{formErrors.adresse}</div>}
                  </div>
    
                  {/* Mail Ravinala */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="mail_ravinala">Mail Ravinala</CFormLabel>
                    <CFormInput
                      type="email"
                      id="mail_ravinala"
                      value={usagerData.mail_ravinala}
                      onChange={handleInputChange}
                      placeholder="Entrer l'email (facultatif)"
                    />
                  </div>
    
                  {/* Row 3: Genre, Poste, Département */}
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <CFormLabel htmlFor="genre_id">Genre</CFormLabel>
                      <CFormSelect
                        id="genre_id"
                        value={usagerData.genre_id}
                        onChange={handleInputChange}
                        invalid={!!formErrors.genre_id}
                      >
                        <option value="">Sélectionner le genre</option>
                        {genres.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.genre}
                          </option>
                        ))}
                      </CFormSelect>
                      {formErrors.genre_id && <div className="invalid-feedback">{formErrors.genre_id}</div>}
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="poste_id">Poste</CFormLabel>
                      <CFormSelect
                        id="poste_id"
                        value={usagerData.poste_id}
                        onChange={handleInputChange}
                        invalid={!!formErrors.poste_id}
                      >
                        <option value="">Sélectionner le poste</option>
                        {postes.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.poste}
                          </option>
                        ))}
                      </CFormSelect>
                      {formErrors.poste_id && <div className="invalid-feedback">{formErrors.poste_id}</div>}
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="departement_id">Direction</CFormLabel>
                      <CFormSelect
                        id="departement_id"
                        value={usagerData.departement_id}
                        onChange={handleInputChange}
                        invalid={!!formErrors.departement_id}
                      >
                        <option value="">Sélectionner la direction</option>
                        {departements.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.departement}
                          </option>
                        ))}
                      </CFormSelect>
                      {formErrors.departement_id && <div className="invalid-feedback">{formErrors.departement_id}</div>}
                    </CCol>
                  </CRow>
    
                  <CButton type="button" onClick={nextStep} color="info" className="text-white">
                    Suivant
                  </CButton>
                  <span className="ms-3">1/3</span>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      );

      case 2:
        return (
          <CRow>
            <CCol xs={{ span: 0, offset: 0 }}>
              <CCard>
              <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                  <strong>Informations de Ramassage</strong>
                </CCardHeader>
                <CCardBody>
                  <form onSubmit={handleSubmit}>
                  <div>
                    {/* District Selection ramassage*/}
                    <CFormLabel>District</CFormLabel>
                    <Select 
                      value={selectedDistrict} 
                      onChange={handleDistrictChange} 
                      options={districts} 
                      placeholder="Sélectionnez un District"
                    />

                    {/* Fokontany Selection ramassage*/}
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
                  <br></br>
                    <div className="mb-3">
                      <CFormLabel htmlFor="lieu_ramassage">Point de Ramassage</CFormLabel>
                      <CFormInput
                        type="text"
                        id="lieu_ramassage"
                        value={axeRamassageData.lieu_ramassage}
                        onChange={handleRamassageChange}
                        placeholder="Entrer le lieu de ramassage"
                        invalid={formErrors.lieu_ramassage ? true : false}
                      />
                    {formErrors.lieu_ramassage && <div className="invalid-feedback">{formErrors.lieu_ramassage}</div>}

                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="heure_ramassage">Heure de Ramassage</CFormLabel>
                      <CFormInput
                        type="time"
                        id="heure_ramassage"
                        step="2"
                        value={axeRamassageData.heure_ramassage}
                        onChange={handleRamassageChange}
                        invalid={formErrors.heure_ramassage ? true : false}
                      />
                    {formErrors.heure_ramassage && <div className="invalid-feedback">{formErrors.heure_ramassage}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="axe_ramassage_id">Axe de Ramassage</CFormLabel>
                      <CFormSelect
                        id="axe_ramassage_id"
                        value={axeRamassageData.axe_ramassage_id}
                        onChange={handleRamassageChange}
                        invalid={formErrors.axe_ramassage_id ? true : false}
                      >
                      {formErrors.axe_ramassage_id && <div className="invalid-feedback">{formErrors.axe_ramassage_id}</div>}
                        <option value="">Sélectionner l'axe</option>
                        {axes.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.axe}
                          </option>
                        ))}
                      </CFormSelect>
                    </div> 

                    <div className="mb-3">
                      <CFormSwitch
                        id="est_actif"
                        label="Activer le ramassage ?"
                        checked={axeRamassageData.est_actif}
                        onChange={() => handleSwitchChange('ramassage')}
                      />
                    </div>
  
                    <CButton type="button" onClick={prevStep} className="me-2" color="primary">Précédent</CButton>
                    <CButton type="button" onClick={nextStep} color="info" className="text-white">Suivant</CButton>
                    <span className="mb-3" style={{ marginLeft: '10px' }}>2/3</span>
                  </form>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        );
  
      case 3:
        return (
          <CRow>
            <CCol xs={{ span: 0, offset: 0 }}>
              <CCard>
                <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
                  <strong>Informations de Dépôt</strong>
                </CCardHeader>
                <CCardBody>
                  <form onSubmit={handleSubmit}>
                  <div>
                    {/* District Selection depot*/}
                    <CFormLabel>District</CFormLabel>
                    <Select 
                      value={selectedDistrictDepot} 
                      onChange={handleDistrictChangeDepot} 
                      options={districts} 
                      placeholder="Sélectionnez un District"
                    />

                    {/* Fokontany Selection depot*/}
                    {fokontany.length > 0 && (
                      <>
                        <CFormLabel>Fokontany</CFormLabel>
                        <Select
                        value={selectedFokontanyDepot} 
                        onChange={(option) => setSelectedFokontanyDepot(option)} 
                        options={fokontany}
                        placeholder="Sélectionnez un Fokontany"
                      />
                      </>
                    )}
                  </div>
                  <br></br>
                    <div className="mb-3">
                      <CFormLabel htmlFor="lieu_depot">Point de Dépôt</CFormLabel>
                      <CFormInput
                        type="text"
                        id="lieu_depot"
                        value={axeDepotData.lieu_depot}
                        onChange={handleDepotChange}
                        placeholder="Entrer le lieu de dépôt"
                        invalid={formErrors.lieu_depot ? true : false}
                      />
                      {formErrors.lieu_depot && <div className="invalid-feedback">{formErrors.lieu_depot}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="heure_depot">Heure de Dépôt</CFormLabel>
                      <CFormInput
                        type="time"
                        id="heure_depot"
                        step="2"
                        value={axeDepotData.heure_depot}
                        onChange={handleDepotChange}
                        invalid={formErrors.heure_depot ? true : false}
                      />
                      {formErrors.heure_depot && <div className="invalid-feedback">{formErrors.heure_depot}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="axe_depot_id">Axe de Dépôt</CFormLabel>
                      <CFormSelect
                        id="axe_depot_id"
                        value={axeDepotData.axe_depot_id}
                        onChange={handleDepotChange}
                        invalid={formErrors.axe_depot_id ? true : false}
                      >
                      {formErrors.axe_depot_id && <div className="invalid-feedback">{formErrors.axe_depot_id}</div>}
                        <option value="">Sélectionner l'axe</option>
                        {axes.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.axe}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>

                    

                    <div className="mb-3">
                      <CFormSwitch
                        id="est_actif"
                        label="Activer le dépôt ?"
                        checked={axeDepotData.est_actif}
                        onChange={() => handleSwitchChange('depot')}
                      />
                    </div>
  
                    <CButton type="button" onClick={prevStep} className="me-2" color="primary">Précédent</CButton>
                    <CButton type="submit"color="success" className="text-white">Soumettre</CButton>
                    <span className="mb-3" style={{ marginLeft: '10px' }}>3/3</span>
                  </form>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        );
  
      default:
        return null;
    }
  };
  
  export default Usagers;