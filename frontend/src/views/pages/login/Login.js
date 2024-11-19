import React, { useState } from 'react'; // Correction ici
import { Link } from 'react-router-dom';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Authentification 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fonction de gestion de l'envoi du formulaire
  // Fonction de gestion de l'envoi du formulaire
    const Envoi_data = async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

      try {
          const baseURL = import.meta.env.VITE_API_BASE_URL;
          
          const response = await axios.post(`${baseURL}/api/login/identification`, {
              mail: email,
              mot_de_passe: password
          }, {
              withCredentials: true
          });

          // si la vérification / réponse sont correcte
          if (response.status === 200) {
              localStorage.setItem('user', JSON.stringify(response.data));
              // alert("Connexion réussie !");
              navigate(response.data.redirectUrl); // Redirection en fonction de l'URL reçue du serveur
          }
      } catch (error) {
          if (error.response) {
              console.error("Erreur de réponse : ", error.response.data);
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
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={Envoi_data}>
                    <h1 className="text-center">Login</h1>
                    <p>Votre e-mail</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        type="email" 
                        placeholder="email" 
                        autoComplete="E-mail" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required  
                      />
                    </CInputGroup>
                    <p>Votre mot de passe</p>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="success" 
                          className="px-3 rounded-0 custom-button-text" 
                          style={{ color: 'white' }} 
                          type="submit" // Assurez-vous que le bouton soumet le formulaire
                        >
                          Se connecter
                        </CButton>
                      </CCol>
                    </CRow>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
