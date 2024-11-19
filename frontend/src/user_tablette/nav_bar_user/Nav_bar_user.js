import React, { useState } from 'react';
import {
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CForm,
  CFormInput,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CContainer,
} from '@coreui/react';

const Nav_bar_user = () => {
  const [visible, setVisible] = useState(false);

  return (
    <CNavbar expand="lg" colorScheme="dark" className="bg-dark fixed-top w-100">
      <CContainer fluid>
        <CNavbarBrand href="#">LOGO</CNavbarBrand>
        <CNavbarToggler
          aria-label="Toggle navigation"
          aria-expanded={visible}
          onClick={() => setVisible(!visible)}
        />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav>
            <CNavItem>
              <CNavLink href="#" active>
                Acceuil
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">Liste</CNavLink>
            </CNavItem>
            <CDropdown variant="nav-item" popper={false}>
              <CDropdownToggle color="secondary">Synchronisation</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Push</CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem href="#">Pull</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CNavItem>
              <CNavLink href="#" disabled>
                Front office
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
          <CForm className="d-flex ms-auto">
            <CFormInput type="search" className="me-2" placeholder="Search" />
            <CButton type="submit" color="light" variant="outline">
              Search
            </CButton>
          </CForm>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default Nav_bar_user;
