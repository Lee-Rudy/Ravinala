import React, { useState } from 'react';
import Select from 'react-select';
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

  // Options pour le sélecteur d'année
  const yearOptions = [...Array(30)].map((_, i) => {
    const yearOption = new Date().getFullYear() - i;
    return { value: yearOption, label: yearOption };
  });

  return (
    <div>
      {/* Sélecteur d'année avec react-select */}
      <div className="mb-3">
        <label htmlFor="yearSelect" className="form-label">
          Sélectionner une année :
        </label>
        <Select
          id="yearSelect"
          value={{ value: year, label: year }} 
          onChange={(selectedOption) => setYear(selectedOption.value)}
          options={yearOptions}
          placeholder="Rechercher ou sélectionner une année"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#45B48E', 
              boxShadow: 'none', 
              '&:hover': { borderColor: '#45B48E' }, 
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? '#45B48E'
                : isFocused
                ? '#a8e6d0'
                : 'white',
              color: isSelected ? 'white' : 'black', 
              '&:hover': { backgroundColor: '#45B48E', color: 'white' },
            }),
            placeholder: (base) => ({
              ...base,
              color: '#45B48E',
            }),
            singleValue: (base) => ({
              ...base,
              color: '#45B48E',
            }),
          }}
        />
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
            width: '50%', 
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
