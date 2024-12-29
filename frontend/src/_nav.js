import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAirplaneMode,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilAddressBook,
  cilMap,
  cilPaperPlane,
  cilChartLine,
  cilHistory
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

//cilBarChart peut aussi être icone dashboard

const _nav = [


  {
    component: CNavTitle,
    name: 'Historique',
  },
  {
    component: CNavGroup,
    name: 'Historique',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" style={{
      color: '#45B48E',
    }}/>,
    
    items: [
      {
        component: CNavItem,
        name: 'historique',
        to: '/historique',
        style: { color: '#45B48E' },

      },
      {
        component: CNavItem,
        name: 'historique des cars',
        to: '/historique_cars',
        style: { color: '#45B48E' },

      },
      {
        component: CNavItem,
        name: 'historique de comptage',
        to: '/historique_comptage',
        style: { color: '#45B48E' },

      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Dashboard',
  },

  {
    component: CNavGroup,
    name: 'Dashboard',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" style={{
      color: '#45B48E',
    }}/>,
    
    items: [
      {
        component: CNavItem,
        name: 'usagers',
        to: '/stat_usagers',
        style: { color: '#45B48E' },

      },
      {
        component: CNavItem,
        name: 'cars',
        to: '/stat_cars',
        style: { color: '#45B48E' },

      },
      {
        component: CNavItem,
        name: 'consommation',
        to: '/stat_consommation',
        style: { color: '#45B48E' },

      },

    ],
  },

  


  {
    component: CNavTitle,
    name: 'Plannification',
  },

  {
    component: CNavGroup,
    name: 'Itinéraire - Axe',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" style={{
      color: '#45B48E',
    }} />,
    items: [
      {
        component: CNavItem,
        name: 'Axe de ramassage',
        to: '/map/ramassage',
        style: { color: '#45B48E' },


      },
      {
        component: CNavItem,
        name: 'Axe de dépôt',
        to: '/map/depot',
        style: { color: '#45B48E' },

      },
    ],
  },
  {
    component: CNavGroup,
    name: 'PLanning',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" style={{
      color: '#45B48E',
    }} />,
    component: CNavItem,
        name: 'Planning',
        to: '/planning',
  },
  {
    component: CNavTitle,
    name: 'Administrations',
  },
  //page admin
  {
    component: CNavGroup,
    name: 'Administateur',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" style={{
      color: '#45B48E',
    }}/>,
    items: [
      {
        component: CNavItem,
        name: 'Usagers',
        to: '/usagers',
        style: { color: '#45B48E' },
      },
      {
        component: CNavItem,
        name: 'cars',
        to: '/cars_liste',
        style: { color: '#45B48E' },


      },
      {
        component: CNavItem,
        name: 'Chauffeurs',
        to: '/conducteurs',
        style: { color: '#45B48E' },


      },
      {
        component: CNavItem,
        name: 'Axe',
        to: '/axe',
        style: { color: '#45B48E' },


      },
      {
        component: CNavItem,
        name: 'Prestataire',
        to: '/prestataire',
        style: { color: '#45B48E' },


      },

    ],
  },

  //authentification
  {
    component: CNavGroup,
    name: 'Authentification',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" style={{
      color: '#45B48E',
    }} />,
    
    items: [
      {
        component: CNavItem,
        name: 'Se déconnecter',
        to: '/login',
        style: { color: '#45B48E' },

      },
      {
        component: CNavItem,
        name: 'Login cars',
        to: '/login_cars',
        style: { color: '#45B48E' },
      },
    ],
  },
]

export default _nav
