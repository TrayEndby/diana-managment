import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory, useLocation } from 'react-router-dom';
import cn from 'classnames';

import { Calendar3 } from 'react-bootstrap-icons';

import ConversationIcon from 'assets/menus/MyConversation.svg';
import HomeworkIcon from 'assets/menus/MyHomework.svg';
import CalendarIcon from 'assets/menus/MyCalendar.svg';
import ProgressIcon from 'assets/menus/MyProgress.svg';
import EventsIcon from 'assets/menus/MyEvents.svg';
import EducatorIcon from 'assets/menus/FindEducator.svg';
import kyrosTextLogo from '../../assets/KyrosHomePage/KyrosWhiteText.svg';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import LOGO from './Logo';
import HelpDropdown from './Help';
import NavigationBarDropdown from './Dropdown';

import Tooltip from 'util/Tooltip';
import GeneralSearchbar from 'util/GeneralSearchBar';

import { STORAGE_SIGN_IN_TYPE } from 'constants/storageKeys';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';
import { CSA_URL } from 'constants/server';
import styles from './style.module.scss';

const Icons = [
  {
    icon: ConversationIcon,
    description: 'My Conversations',
    path: ROUTES.CONVERSATIONS,
  },
  {
    icon: HomeworkIcon,
    description: 'My Homework',
    path: ROUTES.SPRINT_WORKSHOP,
  },
  {
    icon: CalendarIcon,
    description: 'My Calendar',
    path: ROUTES.CALENDAR,
  },
  {
    icon: ProgressIcon,
    description: 'My Progress',
    path: ROUTES.MY_PROGRESS,
  },
  {
    icon: EventsIcon,
    description: 'My Events',
  },
  {
    icon: EducatorIcon,
    description: 'Find Educator',
    path: ROUTES.MY_EDUCATOR,
    style: {
      height: '50px',
      position: 'relative',
      top: '10px',
    },
  },
];

const eventRoutes = [
  ROUTES.WEBINAR,
  ROUTES.WEBINAR_DETAIL,
  ROUTES.SPRINT,
  ROUTES.SPRINT_DETAIL,
  ROUTES.COUNSELING,
];

const Navigation = ({ authUser, authedAs }) => {
  const location = useLocation();

  if (
    location.pathname === ROUTES.PRODUCT_BROCHURE ||
    location.pathname === ROUTES.SERVICE_BROCHURE
  ) {
    return null;
  }

  return authUser ? (
    <NavigationAuth authUser={authUser} authedAs={authedAs} />
  ) : (
      <NavigationNonAuth />
    );
};

const NavigationAuth = withRouter(({ history, authedAs }) => {
  const isEducator = authedAs.userType === PROFILE_TYPE.Educator;
  const notVerified = authedAs.emailVerified === false;
  return (
    <Navbar className={styles.navbar} expand="sm">
      <LOGO toMyGoals={!isEducator} redirect={ROUTES.HOME} />
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        className="navbar-dark"
      />
      <Navbar.Collapse className={styles.navCollapse}>
        {!isEducator && !notVerified && (
          <GeneralSearchbar className={styles.searchBar} />
        )}
        <div className={styles.middleSections}>
          {Icons.map(({ icon, description, path, style }, index) => {
            const Icon = (
              <Tooltip key={index} title={description} placement="bottom">
                <div
                  onClick={() => history.push(path)}
                  className={cn({
                    [styles.active]: history.location.pathname.includes(path),
                  })}
                >
                  <img
                    src={icon}
                    alt={description}
                    className={styles.logoSM}
                    style={style}
                  />
                </div>
              </Tooltip>
            );

            if (description !== 'My Events') {
              return Icon;
            } else {
              return (
                <NavDropdown
                  key={index}
                  title={Icon}
                  className={cn(styles.myEvents, {
                    [styles.active]: eventRoutes.includes(
                      history.location.pathname,
                    ),
                  })}
                >
                  <NavDropdown.Item
                    onClick={() => history.push(ROUTES.COUNSELING)}
                  >
                    Bi-weekly Counseling
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => history.push(ROUTES.SPRINT)}>
                    Sprint Program
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    onClick={() => history.push(ROUTES.WEBINAR)}
                  >
                    CSA Webinar
                  </NavDropdown.Item>
                </NavDropdown>
              );
            }
          })}
        </div>
        <HelpDropdown hidden={history.location.pathname === ROUTES.HOME} />
        <NavigationBarDropdown authedAs={authedAs} notVerified={notVerified} />
      </Navbar.Collapse>
    </Navbar>
  );
});

const NavigationNonAuth = () => {
  const handleSignInType = (type) => {
    localStorage.setItem(STORAGE_SIGN_IN_TYPE, type);
  };

  const history = useHistory();

  return (
    <div>
      <Navbar
        className={cn(styles.navbar, styles.nonAuth)}
        style={{ backgroundColor: '#152332' }}
        expand="lg"
      >
        <LOGO toMyGoals={false} redirect={ROUTES.LANDING} />
        <img
          className={styles.kyrosLogo}
          src={kyrosTextLogo}
          alt="kyrosTextLogo"
        ></img>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-dark"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" style={{ marginLeft: '70px' }}>
            {/* Product & Services */}
            <NavDropdown
              title="Product & Services"
              className={cn(styles.leftNav, styles.nonAuth, styles.events)}
            >
              <NavDropdown
                title="Our Product"
                className={cn(
                  styles['dropdown-item'],
                  styles.submenu,
                  styles.orangeArrow,
                )}
                bsPrefix="dropdown-item"
              >
                <NavDropdown.Item
                  onClick={() => history.push(ROUTES.PRODUCT_BROCHURE)}
                  className={cn(styles['dropdown-item'], styles.submenu)}
                  bsPrefix="dropdown-item dropdown-submenu-item"
                >
                  Product Brochure
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="Our Services"
                className={cn(
                  styles['dropdown-item'],
                  styles.submenu,
                  styles.orangeArrow,
                )}
                bsPrefix="dropdown-item"
              >
                <NavDropdown.Item
                  onClick={() => history.push(ROUTES.SERVICE_BROCHURE)}
                  className={cn(styles['dropdown-item'], styles.submenu)}
                  bsPrefix="dropdown-item dropdown-submenu-item"
                >
                  Services Brochure
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => history.push(ROUTES.SPRINT)}
                  className={cn(styles['dropdown-item'], styles.submenu)}
                  bsPrefix="dropdown-item dropdown-submenu-item"
                >
                  Sprint Programs
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => history.push(ROUTES.COUNSELING)}
                  className={cn(styles['dropdown-item'], styles.submenu)}
                  bsPrefix="dropdown-item dropdown-submenu-item"
                >
                  Bi-weekly Counseling
                </NavDropdown.Item>
              </NavDropdown>
              {/* <NavDropdown.Item onClick={() => history.push(ROUTES.COUNSELING)}>
                Bi-weekly Counseling Sessions
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => history.push(ROUTES.SPRINT)}>
                Sprint Program
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => history.push(ROUTES.WEBINAR)}>
                CSA Webinar
              </NavDropdown.Item> */}
            </NavDropdown>

            {/* RESOURCES */}
            <NavDropdown
              title="Resources"
              className={cn(styles.leftNav, styles.noArrow, styles.events)}
            >
              <NavDropdown.Item disabled>Assesment Tool</NavDropdown.Item>
              <NavDropdown.Item onClick={() => history.push(ROUTES.FAQ)}>FAQ</NavDropdown.Item>
            </NavDropdown>

            {/* PARTNERS */}
            <NavDropdown
              title="Partners"
              className={cn(styles.leftNav, styles.noArrow, styles.events)}
            >
              <NavDropdown.Item
                onClick={() => history.push(ROUTES.COUNSELING)}
                disabled
              >
                Education Partners
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  window.location = CSA_URL;
                }}
              >
                Sales Partners
              </NavDropdown.Item>
            </NavDropdown>
            {/* <button
              className={cn(styles.leftNav)}
              onClick={() => {
                window.location = CSA_URL;
              }}
            >
              Resources
            </button> */}
          </Nav>
        </Navbar.Collapse>
        <a
          className={styles.consultation}
          href="https://calendly.com/rye-33"
          target="_blank"
        >
          <Calendar3 className="mr-2" /> Schedule Free Consultation
        </a>
        <div className={styles.dropdownContainer1}>
          <NavDropdown
            id="logInSetting-dropdown"
            className="dropdown"
            alignRight
            title="Member Sign In"
          >
            <NavDropdown.Item className="text-black">
              <Link
                to={ROUTES.SIGN_IN_PARENT}
                onClick={() => handleSignInType(PROFILE_TYPE.Parent)}
              >
                I am a parent
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <Link
                to={ROUTES.SIGN_IN}
                onClick={() => handleSignInType(PROFILE_TYPE.RegularHSStudent)}
              >
                I am a student
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <Link
                to={ROUTES.SIGN_IN_EDUCATOR}
                onClick={() => handleSignInType(PROFILE_TYPE.Educator)}
              >
                I am an educator
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
        <div className={styles.dropdownContainer2}>
          <NavDropdown
            id="SignUpSetting-dropdown"
            className={cn(styles.noArrow, styles.download)}
            alignRight
            title="Sign Up"
          >
            <NavDropdown.Item className="text-black">
              <Link
                to={ROUTES.SIGN_UP_PARENT}
                onClick={() => handleSignInType(PROFILE_TYPE.Parent)}
              >
                I am a parent
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <Link
                to={ROUTES.SIGN_UP}
                onClick={() => handleSignInType(PROFILE_TYPE.RegularHSStudent)}
              >
                I am a student
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <Link
                to={ROUTES.SIGN_UP_EDUCATOR}
                onClick={() => handleSignInType(PROFILE_TYPE.Educator)}
              >
                I am an educator
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Navbar>
    </div>
  );
};

Navigation.prototype = {
  authUser: PropTypes.object,
};

export default Navigation;
