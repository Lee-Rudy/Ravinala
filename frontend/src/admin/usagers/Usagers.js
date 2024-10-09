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



const Usagers = () => {

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
    date_naissance: '',
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
    est_actif: false
  });

  //keep state usagers
  const [axeDepotData, setAxeDepotData] = useState({
    lieu_depot: '',
    heure_depot: '',
    axe_depot_id: '',
    //toogle swich default (false) , that is to say , disabled (désactivé) 
    est_actif: false
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

  //dropDown for postes, genres, departements 
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

    // validate usagers
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
      if (!usagerData.date_naissance) errors.date_naissance = 'La date de naissance est obligatoire.*';
      if (!usagerData.contact) errors.contact = 'Le contact est obligatoire.*';
      if (!usagerData.adresse) errors.adresse = 'L\'adresse est obligatoire.*';
      if (!usagerData.mail_ravinala) errors.mail_ravinala = 'Le mail est obligatoire.*';
      if (!usagerData.genre_id) errors.genre_id = 'Le genre est obligatoire.*';
      if (!usagerData.poste_id) errors.poste_id = 'Le poste est obligatoire.*';
      if (!usagerData.departement_id) errors.departement_id = 'Le département est obligatoire.*';
    }

    // validate ramassage
    if (step === 2) {
      if (!axeRamassageData.lieu_ramassage) errors.lieu_ramassage = 'Le lieu de ramassage est obligatoire.*';
      if (!axeRamassageData.heure_ramassage) errors.heure_ramassage = 'L\'heure de ramassage est obligatoire.*';
      if (!axeRamassageData.axe_ramassage_id) errors.axe_ramassage_id = 'L\'axe de ramassage est obligatoire.*';
    }

    // validate dépôt
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
            est_actif: axeRamassageData.est_actif
        },
        Depot: {
            lieu: axeDepotData.lieu_depot,
            heure_depot: axeDepotData.heure_depot,
            axe_id: axeDepotData.axe_depot_id,
            est_actif: axeDepotData.est_actif
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
        date_naissance: '',
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
        est_actif: false
    });
    setAxeDepotData({
        lieu_depot: '',
        heure_depot: '',
        axe_depot_id: '',
        est_actif: false
    });
    setError('');
};


const handleError = (err) => {
    if (err.response) {
        console.error('Erreur de réponse:', err.response.data);
        setError(err.response.data.errors);
    } else if (err.request) {
        console.error('Erreur de requête:', err.request);
        setError('Erreur lors de l\'envoi de la requête.');
    } else {
        console.error('Erreur:', err.message);
        setError('Erreur du serveur !');
    }
};


  switch(step) {
    case 1:
      return (
        <CRow>
          <CCol xs={{ span: 0, offset: 0 }}>
            <CCard>
              <CCardHeader>
                <strong>Ajout d'un Usager</strong>
              </CCardHeader>
              <CCardBody>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
                    <CFormInput
                      type="text"
                      id="matricule"
                      value={usagerData.matricule}
                      onChange={handleInputChange}
                      placeholder="Entrer le matricule"
                      invalid={formErrors.matricule ? true : false}
                    />
                     {formErrors.matricule && <div className="invalid-feedback">{formErrors.matricule}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="nom">Nom</CFormLabel>
                    <CFormInput
                      type="text"
                      id="nom"
                      value={usagerData.nom}
                      onChange={handleInputChange}
                      placeholder="Entrer le nom"
                      invalid={formErrors.nom ? true : false}
                    />
                    {formErrors.nom && <div className="invalid-feedback">{formErrors.nom}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="date_naissance">Date de naissance</CFormLabel>
                    <CFormInput
                      type="date"
                      id="date_naissance"
                      value={usagerData.date_naissance}
                      onChange={handleInputChange}
                      invalid={formErrors.date_naissance ? true : false}
                    />
                    {formErrors.date_naissance && <div className="invalid-feedback">{formErrors.date_naissance}</div>}

                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="contact">Contact</CFormLabel>
                    <CFormInput
                      type="text"
                      id="contact"
                      value={usagerData.contact}
                      onChange={handleInputChange}
                      placeholder="ajouter un '/' si plusieurs contacts"
                      invalid={formErrors.contact ? true : false}
                    />
                    {formErrors.contact && <div className="invalid-feedback">{formErrors.contact}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="adresse">Adresse</CFormLabel>
                    <CFormInput
                      type="text"
                      id="adresse"
                      value={usagerData.adresse}
                      onChange={handleInputChange}
                      placeholder="mettre l'adresse"
                      invalid={formErrors.adresse ? true : false}
                    />
                    {formErrors.adresse && <div className="invalid-feedback">{formErrors.adresse}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="mail_ravinala">Mail Ravinala</CFormLabel>
                    <CFormInput
                      type="email"
                      id="mail_ravinala"
                      value={usagerData.mail_ravinala}
                      onChange={handleInputChange}
                      placeholder="Entrer l'email"
                      invalid={formErrors.mail_ravinala ? true : false}
                    />
                    {formErrors.mail_ravinala && <div className="invalid-feedback">{formErrors.mail_ravinala}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="genre_id">Genre</CFormLabel>
                    <CFormSelect
                      id="genre_id"
                      value={usagerData.genre_id}
                      onChange={handleInputChange}
                      invalid={formErrors.genre_id ? true : false}
                    >
                    {formErrors.genre_id && <div className="invalid-feedback">{formErrors.genre_id}</div>}

                      <option value="">Sélectionner le genre</option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.genre}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="poste_id">Poste</CFormLabel>
                    <CFormSelect
                      id="poste_id"
                      value={usagerData.poste_id}
                      onChange={handleInputChange}
                      invalid={formErrors.poste_id ? true : false}
                    >
                    {formErrors.poste_id && <div className="invalid-feedback">{formErrors.poste_id}</div>}

                      <option value="">Sélectionner le poste</option>
                      {postes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.poste}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="departement_id">Département</CFormLabel>
                    <CFormSelect
                      id="departement_id"
                      value={usagerData.departement_id}
                      onChange={handleInputChange}
                      invalid={formErrors.departement_id ? true : false}
                    >
                    {formErrors.departement_id && <div className="invalid-feedback">{formErrors.departement_id}</div>}

                      <option value="">Sélectionner le département</option>
                      {departements.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.departement}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                  
                  <CButton type="button" onClick={nextStep} color="info">Suivant</CButton>
                  <span className="mb-3" style={{ marginLeft: '10px' }}>1/3</span>
                </form>
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
                <CCardHeader>
                  <strong>Informations de Ramassage</strong>
                </CCardHeader>
                <CCardBody>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="lieu_ramassage">Lieu de Ramassage</CFormLabel>
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
                    <CButton type="button" onClick={nextStep} color="info">Suivant</CButton>
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
                <CCardHeader>
                  <strong>Informations de Dépôt</strong>
                </CCardHeader>
                <CCardBody>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="lieu_depot">Lieu de Dépôt</CFormLabel>
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
                    <CButton type="submit"color="success">Soumettre</CButton>
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
  