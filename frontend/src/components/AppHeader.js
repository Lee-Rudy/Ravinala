import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CBadge,
  useColorModes
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilContrast,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';

const AppHeader = () => {
  const [incompleteAxes, setIncompleteAxes] = useState([]);
  const [pointageRamassage, setPointageRamassage] = useState([]);
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const navigate = useNavigate();

  const [lastReset, setLastReset] = useState(new Date());

  const fetchNotifications = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const axesResponse = await axios.get(`${baseURL}/api/axe/notifications`);
      setIncompleteAxes(axesResponse.data);

      const pushResponse = await axios.get(`${baseURL}/api/notifications/pointageRamassage`);
      setPointageRamassage(pushResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 600000); // 60 secondes //aza hadino ny manova an'ito pour intérroger le serveur 
    //3000 = 30s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const unreadCount = useMemo(() => {
    return [
      ...incompleteAxes,
      ...pointageRamassage
    ].filter(notification => new Date(notification.recuLe) > lastReset).length;
  }, [incompleteAxes, pointageRamassage, lastReset]);

  const handleDropdownToggle = (isOpen) => {
    if (isOpen) {
      console.log("Dropdown ouvert, réinitialisation du compteur");
      setLastReset(new Date());
      // Optionnel : Marquer les notifications comme lues sur le serveur
      // markNotificationsAsRead();
    }
  };

  // Optionnel : Fonction pour marquer les notifications comme lues sur le serveur
  const markNotificationsAsRead = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${baseURL}/api/notifications/markAsRead`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications comme lues :", error);
    }
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto">
          {/* Notifications */}
          <CNavItem>
            <CDropdown
              variant="nav-item"
              placement="bottom-end"
              onShowChange={handleDropdownToggle}
            >
              <CDropdownToggle
                caret={false}
                className="position-relative d-flex align-items-center"
                style={{
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  cursor: 'pointer',
                }}
              >
                <CIcon
                  icon={cilBell}
                  size="lg"
                  style={{
                    color: '#45B48E',
                    marginRight: '5px',
                  }}
                />
                {unreadCount > 0 && (
                  <CBadge
                    color="danger"
                    className="position-absolute translate-middle"
                    style={{
                      top: '5px',
                      right: '-5px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadCount}
                  </CBadge>
                )}
              </CDropdownToggle>

              <CDropdownMenu
              className="shadow-lg"
              style={{
                width: '320px',
                maxHeight: '400px', // Limite la hauteur
                overflowY: 'auto',  // Active la barre de défilement verticale
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '0',
              }}
            >
                <CDropdownItem
                  header
                  className="text-center text-white"
                  style={{
                    backgroundColor: '#45B48E',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  <strong>Notifications</strong>
                </CDropdownItem>

                {/* Notifications Axes */}
                {incompleteAxes.length > 0 ? (
                  incompleteAxes.map((axe) => (
                    <CDropdownItem
                      key={`axe-${axe.id}`}
                      className="d-flex align-items-center"
                      style={{
                        padding: '10px 15px',
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/axe/update/${axe.id}`)}
                    >
                      <CIcon
                        icon={cilList}
                        size="lg"
                        style={{ marginRight: '10px', color: '#45B48E' }}
                      />
                      <span>{axe.axe || 'Nouvelle notification'} incomplète</span>
                    </CDropdownItem>
                  ))
                ) : null}

                {/* Notifications Push Ramassage */}
                {pointageRamassage.length > 0 ? (
                  pointageRamassage.map((push) => (
                    <CDropdownItem
                      key={`push-${push.id}`}
                      className="d-flex align-items-center"
                      style={{
                        padding: '10px 15px',
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                      }}
                      // onClick={() => navigate('/notifications')}
                      onClick={() => navigate('/historique')}
                    >
                      <CIcon
                        icon={cilList}
                        size="lg"
                        style={{ marginRight: '10px', color: '#45B48E' }}
                      />
                      <span>{push.nomVoiture} :</span>
                      <small style={{ marginLeft: 'auto', color: 'gray' }}>
                        {new Date(push.recuLe).toLocaleDateString()}
                      </small>
                    </CDropdownItem>
                  ))
                ) : null}

                {(incompleteAxes.length + pointageRamassage.length) === 0 && (
                  <CDropdownItem className="text-center text-muted py-3">
                    Aucune notification
                  </CDropdownItem>
                )}

                <CDropdownItem
                  className="text-center text-primary"
                  style={{ padding: '10px', borderTop: '1px solid #f0f0f0' }}
                >
                  <Link
                    to="/notifications"
                    style={{ textDecoration: 'none', color: '#45B48E' }}
                    onClick={() => navigate('/notifications')}
                  >
                    Voir toutes les notifications
                  </Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CNavItem>

          {/* ... (autres éléments de navigation) */}
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-3 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" style={{ color: '#45B48E' }} />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" style={{ color: '#45B48E' }} />
              ) : (
                <CIcon icon={cilSun} size="lg" style={{ color: '#45B48E' }} />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Clair
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Sombre
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          {/* ... */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
