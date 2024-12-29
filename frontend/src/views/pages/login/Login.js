import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormLabel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axios from 'axios';

const Login = () => {
  // États pour les champs de formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // État pour les erreurs de formulaire
  const [formErrors, setFormErrors] = useState({});

  // État pour les erreurs générales
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fonction de validation des champs
  const validateForm = () => {
    const errors = {};

    // Validation de l'email
    if (!email) {
      errors.email = 'L\'e-mail est obligatoire.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Veuillez entrer un e-mail valide.';
      }
    }

    // Validation du mot de passe
    if (!password) {
      errors.password = 'Le mot de passe est obligatoire.';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    return errors;
  };

  // Fonction de gestion de l'envoi du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    // Valider les champs du formulaire
    const errors = validateForm();
    setFormErrors(errors);
    setError(''); // Réinitialiser l'erreur générale

    // Si des erreurs existent, ne pas procéder à l'envoi
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${baseURL}/api/login/identification`, {
        mail: email,
        mot_de_passe: password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Rediriger vers l'URL fournie par le serveur
        navigate(response.data.redirectUrl); 
      }
    } catch (error) {
      if (error.response) {
        console.error("Erreur de réponse : ", error.response.data);
        const serverErrors = error.response.data.errors || {};
        const newFormErrors = {};

        // Mappez les erreurs du serveur aux champs de formulaire
        if (serverErrors.mail) {
          newFormErrors.email = serverErrors.mail;
        }
        if (serverErrors.mot_de_passe) {
          newFormErrors.password = serverErrors.mot_de_passe;
        }

        setFormErrors(newFormErrors);
        setError(error.response.data.message || 'Erreur de connexion');
      } else {
        console.error("Erreur : ", error);
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              {/* Carte de présentation */}
              <CCard className="text-white py-5" style={{ width: '44%', backgroundColor: '#2fab53' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>RaviCheck</h2>
                    <h5>by Ravinala Airports</h5><br />

                    <p>
                      Bienveillance,<br />
                      Ambition,<br />
                      Sens du service,<br />
                      Engagement 
                    </p>
                    <Link to="https://www.ravinala-airports.aero/en/#sc-presentation" target='_blank'>
                      <CButton color="primary" className="mt-3 rounded-0" active tabIndex={-1} style={{ backgroundColor: '#016172' }}>
                        En savoir Plus
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>

              {/* Carte de connexion */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} noValidate>
                    <h1 className="text-center">Login</h1>

                    {/* Champ e-mail */}
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel htmlFor="email">Votre e-mail</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput 
                            type="email" 
                            id="email"
                            placeholder="Entrer l'e-mail" 
                            autoComplete="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            invalid={!!formErrors.email}
                            required
                          />
                          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    {/* Champ mot de passe */}
                    <CRow className="mb-4">
                      <CCol md={12}>
                        <CFormLabel htmlFor="password">Votre mot de passe</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            id="password"
                            placeholder="Entrer le mot de passe"
                            autoComplete="current-password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            invalid={!!formErrors.password}
                            required 
                          />
                          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    {/* Bouton de soumission */}
                    <CRow>
                      <CCol xs={12}>
                        <CButton 
                          color="success" 
                          className="px-3 rounded-0 custom-button-text" 
                          style={{ color: 'white' }} 
                          type="submit"
                          block
                        >
                          Se connecter
                        </CButton>
                      </CCol>
                    </CRow>

                    {/* Message d'erreur général */}
                    {error && <p className="mt-3 text-danger text-center">{error}</p>}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default Login;