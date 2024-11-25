import React, { useState } from 'react';
import TotalCars from 'src/admin/stat/cars/total_cars/Total_cars';
import RetardMoisTotal from 'src/admin/stat/cars/retard_mois_total/Retard_mois_total';
import RetardParCar from 'src/admin/stat/cars/retard_par_car/Retard_par_car';
import TotalTauxPonctualite from 'src/admin/stat/cars/total_taux_ponctualite/Total_taux_ponctualite';



import {
  CRow,
  CCol,
  CCardBody,
  CCard,
} from '@coreui/react';

const Stat_cars = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Année sélectionnée

  return (
    <div>
      {/* Sélecteur d'année */}
      <div className="mb-2">
        <label htmlFor="yearSelect" className="form-label">Sélectionner une année :</label>
        <select
          id="yearSelect"
          className="form-control"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[...Array(30)].map((_, i) => {
            const yearOption = new Date().getFullYear() - i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>
      </div>

      {/* Ligne contenant TotalCars et RetardMoisTotal */}
      <CRow style={{ position: 'relative', height: '160px' }}>
  {/* Colonne pour TotalCars */}
  <CCol
    xs={12}
    md={6}
    style={{
      position: 'absolute',
      top: '20px',
      left: '10px',
      width: '50%', // Largeur explicite
    }}
  >
    <TotalCars year={year} />
  </CCol>

  {/* Colonne pour Taux de ponctualité */}
  <CCol
    xs={12}
    md={8}
    style={{
      position: 'absolute',
      top: '20px',
      left: '350px',
      width: '50%',
    }}
  >
    <TotalTauxPonctualite year={year} />
  </CCol>

  {/* Colonne pour RetardMoisTotal */}
  <CCol
    xs={12}
    md={5}
    style={{
      position: 'absolute',
      top: '20px',
      left: '700px',
      width: '40%',
    }}
  >
    <RetardMoisTotal year={year} />
    
  </CCol>
</CRow>


    <CCard className="mt-4">
        <CCardBody>
          <RetardParCar year={year} />
        </CCardBody>
      </CCard>

        </div>
  );
};

export default Stat_cars;
