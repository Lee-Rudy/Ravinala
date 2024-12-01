import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSave, cilPencil, cilTrash, cilLockLocked } from '@coreui/icons';

const Login_cars = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ nom_car_login: '', mot_de_passe: '' });
  const [showPassword, setShowPassword] = useState(false); // État pour contrôler la visibilité du mot de passe

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // États pour le toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch users
  useEffect(() => {
    axios.get(`${baseURL}/api/cars/auth/liste`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSave = () => {
    if (editingUser) {
      // Update existing user
      axios.put(`${baseURL}/api/cars/auth/update/${editingUser.id}`, editingUser)
        .then(() => {
          alert('Utilisateur mis à jour avec succès.');
          setEditingUser(null);
          window.location.reload();
        })
        .catch((error) => console.error(error));
    } else {
      // Create new user
      axios.post(`${baseURL}/api/cars/auth/create`, newUser)
        .then(() => {
          alert('Utilisateur créé avec succès.');
          // setToastMessage('Utilisateur créé avec succès.');
          // setToastVisible(true);
          setNewUser({ nom_car_login: '', mot_de_passe: '' });
          window.location.reload();
          // Ajoute le nouvel utilisateur à la liste
        // setUsers([...users, response.data]);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${baseURL}/api/cars/auth/delete/${id}`)
      .then(() => {
        alert('Utilisateur supprimé.');
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  return (
    <CContainer>
      <CToaster
        position="top-end"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1050,// eo ambony ny élément rehetra
        }}
      >
      <CToast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        autohide={3000} //fermeture après 3 secondes
        className="bg-success text-white"
      >
        <CToastHeader closeButton>
          <strong className="me-auto">Succès</strong>
        </CToastHeader>
        <CToastBody>{toastMessage}</CToastBody>
      </CToast>
    </CToaster>
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader style={{ backgroundColor: '#45B48E', color: 'white' }}>
              <h4>Gestion des utilisateurs</h4>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={5}>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Nom de l'utilisateur"
                        value={editingUser ? editingUser.nom_car_login : newUser.nom_car_login}
                        onChange={(e) => {
                          const value = e.target.value;
                          editingUser
                            ? setEditingUser({ ...editingUser, nom_car_login: value })
                            : setNewUser({ ...newUser, nom_car_login: value });
                        }}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={5}>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'} // Affiche ou masque le mot de passe selon l'état
                        placeholder="Mot de passe"
                        value={editingUser ? editingUser.mot_de_passe : newUser.mot_de_passe}
                        onChange={(e) => {
                          const value = e.target.value;
                          editingUser
                            ? setEditingUser({ ...editingUser, mot_de_passe: value })
                            : setNewUser({ ...newUser, mot_de_passe: value });
                        }}
                      />
                    </CInputGroup>
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <label className="form-check-label" htmlFor="showPassword">
                        Afficher le mot de passe
                      </label>
                    </div>
                  </CCol>
                  <CCol md={2}>
                    <CButton color="primary" onClick={handleSave}>
                      <CIcon icon={cilSave} className="me-2" />
                      {editingUser ? 'Mettre à jour' : 'Ajouter'}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
              <hr />
              <CRow>
                <CCol>
                  <h5>Liste des utilisateurs</h5>
                  <table className="table table-hover" style={{ backgroundColor: '#45B48E' }}>
                    <thead>
                      <tr>
                        <th>Nom du car</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.nom_car_login}</td>
                          <td>
                            <CButton
                              color="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => setEditingUser(user)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login_cars;
