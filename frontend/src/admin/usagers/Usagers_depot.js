import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CRow,
} from '@coreui/react'

//Formulaire 3
const Usagers_depot = () => {

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche la soumission par défaut,  pour éviter le rechargement de la page lorsque le formulaire est soumis.
    console.log("heure et lieu de depôt ajouté");
  }

  return (
    <CRow>
      <CCol xs={{ span: 0, offset: 0 }}>
        <CCard>
          <CCardHeader>
            <strong>Ajout : heure / lieu de depôt</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              {/* lieu_ramassage */}
              <div className="mb-3">
                <CFormLabel htmlFor="lieu_ramassage">Lieu de depôt</CFormLabel>
                <CFormInput type="text" id="lieu_ramassage" placeholder="saisir le lieu de depôt" />
              </div>

              {/* heure_ramassage */}
              <div className="mb-3">
                <CFormLabel htmlFor="heure_depot">Heure de depôt</CFormLabel>
                <CFormInput type="time" id="heure_depot" placeholder="saisir l'heure" />
              </div>

              {/* Axe */}
              <div className="mb-3">
                <CFormLabel htmlFor="axe">Axe</CFormLabel>
                <CFormSelect id="axe">
                  <option value="">Sélectionner l'Axe</option>
                  <option value="Ivato">Ivato</option>
                  <option value="Analakely">Analakely</option>
                  <option value="autre">Autre</option>
                </CFormSelect>
              </div>

              {/* Statut */}
              <div className="mb-3">
            <CFormLabel htmlFor="statut">Statut</CFormLabel>
            <CFormSwitch 
                label="Non Actif / Actif" 
                id="formSwitchCheckDefaultXL" 
                defaultChecked={false} 
            />
            </div>

              {/* Bouton Ajouter */}
              <CButton type="submit" color="success">Ajouter</CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

  )
}

export default Usagers_depot
