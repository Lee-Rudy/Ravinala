import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))







//=========================================================

//dashboard admin
const Dashboard_admin = React.lazy(()=> import('src/admin/dashboard_admin/Dashboard_admin'))

//login_cars
const Login_cars = React.lazy(() => import('src/user_tablette/login_cars/Login_cars'))

//admin path routes
const Admin = React.lazy(() => import('src/admin/Admin'))

//usagers=========================================================
const Usagers = React.lazy(() => import('src/admin/usagers/Usagers'))
const Usagers_list = React.lazy(() => import('src/admin/usagers/Usagers_list'))

//usagers ramassage
const Usagers_ramassage = React.lazy(() => import('src/admin/usagers/Usagers_ramassage'))
//usagers depot
const Usagers_depot = React.lazy(() => import('src/admin/usagers/Usagers_depot'))

//usagers affectation 
const Usagers_affecter_ramassage = React.lazy(() => import('src/admin/usagers/Usagers_affecter_ramassage'))
const Usagers_affecter_depot = React.lazy(() => import('src/admin/usagers/Usagers_affecter_depot'))



//conducteurs==========================================================
//chauffeurs
const Conducteurs = React.lazy(()=> import('src/admin/conducteurs/Conducteurs'))
const Conducteurs_assignation = React.lazy(()=> import('src/admin/conducteurs/Conducteurs_assignation'))


//cars=====================================================================
//cars Crud
const Cars = React.lazy(()=> import('src/admin/cars/Cars'))
const Cars_list = React.lazy(()=> import('src/admin/cars/Cars_list'))


//prestataire================================================
const Prestataire = React.lazy(()=> import('src/admin/prestataire/Prestataire'))
//facture des prestataires
const Facture = React.lazy(()=> import('src/admin/prestataire/facture/Facture'))
//liste des factures 
const Facture_list = React.lazy(()=> import('src/admin/prestataire/facture/Facture_list'))
//facture pdf
const Facture_pdf = React.lazy(()=> import('src/admin/prestataire/facture/Facture_pdf'))

//Map======================================================================
//ramassage map
const Map_ramassage = React.lazy(()=> import('src/admin/map/Map_ramassage'))
//ramassage depot
const Map_depot = React.lazy(()=> import('src/admin/map/Map_depot'))

//plannification itinéraire
const Axe_confondu = React.lazy(()=> import('src/admin/map/Axe_confondu'))



//axe 
const Axe_list = React.lazy(()=> import('src/admin/axe/Axe_list'))
const Axe = React.lazy(()=> import('src/admin/axe/Axe'))
const Axe_conducteurs_cars_list = React.lazy(()=> import('src/admin/axe/Axe_conducteurs_cars_list'))

//assignation des chauffeurs et cars et axe , axe_conducteurs

//Notifications
const Notifications = React.lazy(()=> import('src/admin/notifications/Notifications'))

//planning
const Planning = React.lazy(()=> import('src/admin/planning/Planning'))

//historique
const Historique = React.lazy(()=> import('src/admin/historique/Historique'))
const HistoriqueCars = React.lazy(()=> import('src/admin/historique/HistoriqueCars'))
const Historique_comptage = React.lazy(()=> import('src/admin/historique/Historique_comptage'))




  //statistiques
  //statistiques usagers
const Stat_usagers = React.lazy(()=> import('src/admin/stat/usagers/Stat_usagers'))
//satistiques cars 
const Stat_cars = React.lazy(()=> import('src/admin/stat/cars/Stat_cars'))
//satatistiques consommation des cars
const Consommation_car = React.lazy(()=> import('src/admin/stat/consommation/Consommation_car'))








///////////////////////////////////////////////////////////////////////////////:
//user tablette
// const Push = React.lazy(()=> import('src/user_tablette/push/Push'))


//axe notifications
// const NotificationsSlice = React.lazy(()=> import('src/admin/axe/notifications/NotificationsSlice'))
// const NotificationsPage = React.lazy(()=> import('src/admin/axe/notifications/NotificationsPage'))

const routes = [

  //admin path
  { path: '/admin', name: 'Admin', element: Admin , isProtected: true},

  //login_cars
  {path: '/login_cars' , name: 'Gestion des utilisateurs des cars', element: Login_cars, isProtected: true},

  //dashboard
  { path: '/dashboard_admin', name: 'Admin', element: Dashboard_admin, isProtected: true },



  //usagers==========================
  { path: '/usagers', name: '', element: Usagers_list, isProtected: true},
  { path: '/usagers/add', name: 'Usagers', element: Usagers },

  //usagers_ramassage
  { path: '/usagers/ramassage', name: 'ramassage de l\'usager ', element: Usagers_ramassage, isProtected: true },
    //usagers_depot
    { path: '/usagers/depot', name: 'depot de l\'usager', element: Usagers_depot, isProtected: true },

    //affecter usagers
    { path: '/usagers/affecter_ramassage/:usagerId', name: 'affecter usagers', element: Usagers_affecter_ramassage, isProtected: true },
    { path: '/usagers/affecter_depot/:usagerId', name: 'affecter usagers', element: Usagers_affecter_depot},



  //conducteurs / chauffeurs==================================================
  { path: '/conducteurs', name: 'chauffeurs', element: Conducteurs, isProtected: true },
  { path: '/conducteurs/assignation', name: 'chauffeurs à assigner', element: Conducteurs_assignation, isProtected: true },


  //cars =========================================================
  { path: '/cars', name: 'cars', element: Cars, isProtected: true },
  { path: '/cars_liste', name: 'cars', element: Cars_list, isProtected: true },

  //prestataire=============================================
  { path: '/prestataire', name: 'cars', element: Prestataire, isProtected: true },
  { path: '/facture', name: 'facture', element: Facture, isProtected: true },
  { path: '/facture_list', name: 'liste des factures', element: Facture_list, isProtected: true },
  { path: '/facture_pdf', name: 'liste des factures', element: Facture_pdf, isProtected: true },




  //Map
  { path: '/map/ramassage', name: 'map de ramassage', element: Map_ramassage , isProtected: true},
  { path: '/map/depot', name: 'map de depot', element: Map_depot, isProtected: true },
  //planning itinéraire
  {path:'map/confondu', name: 'tout axe', element:Axe_confondu, isProtected: true},
 
  //axe 
  {path:'axe', name: 'liste des axes', element:Axe_list, isProtected: true},
  {path:'axe/add', name: 'ajouter un axe', element:Axe, isProtected: true},
  { path: 'axe/update/:axeId', name: 'Mis à jour', element: Axe},
  { path: 'axe_conducteurs', name: 'Attributions des cars', element: Axe_conducteurs_cars_list, isProtected: true },
  { path: '/conducteurs/assignation/:assignationId', name: 'modifications assignation', element: Conducteurs_assignation, isProtected: true },


  //notifications
  {path:'notifications', name: 'notificactions', element:Notifications, isProtected: true},

  //planning
  {path:'planning', name: 'usagers actif', element:Planning, isProtected: true},

  //historique
  {path:'historique', name: 'historique', element:Historique, isProtected: true},
  {path:'historique_cars', name: 'historique', element:HistoriqueCars, isProtected: true},
  {path:'historique_comptage', name: 'historique', element:Historique_comptage, isProtected: true},

  

  //statistiques
  //statistiques usagers
  {path:'stat_usagers', name: '', element:Stat_usagers, isProtected: true},
  //statistiques cars
  {path:'stat_cars', name: '', element:Stat_cars, isProtected: true},
  //consommation des cars
  {path:'stat_consommation', name: '', element:Consommation_car, isProtected: true},


  ///////////////////////////////////////////////////////////////////////
  //user tablette
  // {path:'/push', name: 'push', element:Push},


  


  //axe notifications
  // {path:'axe', name: 'notifications', element:NotificationsSlice},
  // {path:'axe', name: 'notifications page', element:NotificationsPage},
    
//====================================================================
  { path: '/admin', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
