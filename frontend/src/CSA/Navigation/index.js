import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router-dom';
import cn from 'classnames';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

import SignOutButton from 'components/SignOut';
import NotificationNavItem from 'util/NotificationNavItem';

import userProfilePicService from 'service/UserProfilePicService';

import * as CSA_ROUTES from 'constants/CSA/routes';

import UserIcon from './UserIcon';
import LOGO from './Logo';
import Facebook from "../../assets/CSA/Landing/Facebook.svg"
import Instagram from "../../assets/CSA/Landing/Instagram.svg"
import TikTok from "../../assets/CSA/Landing/TikTok.svg"
import Youtube from "../../assets/CSA/Landing/Youtube.svg"

import kyrosTextLogo from "../../assets/CSA/Landing/Logo-Kyros.png"

import styles from './style.module.scss';

const pipelineTables = [
  {
    text: 'My Business',
    sections: [
      {
        text: 'My CSA Website',
        path: CSA_ROUTES.MY_BUSINESS_WEBSITE,
      },
      {
        text: 'My Conversations',
        path: CSA_ROUTES.MY_BUSINESS_CONVERSATIONS,
      },
      {
        text: 'Team Management',
      },
      {
        text: 'Tax Tool / Benefits',
      },
      {
        text: 'My Social Media',
      },
    ],
  },
  {
    text: 'My Sales Activity',
    sections: [
      {
        text: 'Prospecting',
        path: CSA_ROUTES.SALES_PROSPECT,
      },
      {
        text: 'Customer Report',
        path: CSA_ROUTES.SALES_REPORT,
      },
      {
        text: 'Upcoming Renewals',
      },
    ],
  },
  {
    text: 'My Earnings',
    sections: [
      {
        text: 'My Earnings',
        path: CSA_ROUTES.MY_EARNINGS,
      },
      {
        text: 'How Commission Works',
        path: CSA_ROUTES.MY_EARNINGS_COMMISSIONS,
      },
      {
        text: 'Setup Direct Payment',
      },
      {
        text: '1099 Forms',
      },
    ],
  },
  {}, // placeholder to show the trapezoid shape
];

const infoTabs = [
  {
    text: 'Marketing Tools',
    sections: [
      {
        text: 'Video',
        path: CSA_ROUTES.MARKET_VIDEO,
      },
      {
        text: 'Flyers',
        path: CSA_ROUTES.MARKET_FLYER,
      },
      {
        text: 'Webinar Schedule',
        path: CSA_ROUTES.MARKET_WEBINAR,
      },
      {
        text: 'Social Media Basics',
        path: CSA_ROUTES.MARKET_SOCIAL_MEDIA,
      },
    ],
  },
  {
    text: 'Product Info',
    sections: [
      {
        text: 'Product Updates',
        path: CSA_ROUTES.PRODUCT_UPDATES,
      },
      {
        text: 'FAQ',
      },
    ],
  },
  {
    text: 'Kyros Community',
    sections: [
      {
        text: 'Leader Board',
      },
      {
        text: 'Training / Certificate',
        path: CSA_ROUTES.TRAINING_VIDEO,
      },
      {
        text: 'Insiders Info',
      },
      {
        text: 'Incentive Trips',
      },
    ],
  },
  {
    text: 'New CSA',
    sections: [
      {
        text: 'Getting Started',
      },
      {
        text: 'New CSA Checklist',
        path: CSA_ROUTES.CHECKLIST,
      },
      {
        text: 'Agreement & Policies',
        path: CSA_ROUTES.POLICIES,
      },
    ],
  },
];

const isDropdownAvailable = (sections) => {
  if (sections == null || sections.length === 0) {
    return false;
  } else {
    return true;
  }
};

const isActiveTab = (sections = [], pathname) => {
  for (let section of sections) {
    const { path } = section;
    if (path && pathname.includes(path)) {
      return true;
    }
  }
  return false;
};

const LANDING_ROUTES = [
  CSA_ROUTES.LANDING,
  CSA_ROUTES.REGISTRATION_SUCCESS,
  CSA_ROUTES.SIGN_UP,
  CSA_ROUTES.LOG_IN,
  CSA_ROUTES.MAIN_HOME,
];

const REGISTER_ROUTES = [
  CSA_ROUTES.REGISTRATION_FORM,
  CSA_ROUTES.CONFIRMATION_PAGE,
];

const Navigation = (props) => {
  const { authUser, history } = props;
  const { pathname } = history.location;
  const style = LANDING_ROUTES.includes(pathname)
    ? { position: 'absolute', backgroundColor: 'transparent' }
    : null;
  return authUser ? (
    <NavigationAuth
      {...props}
      style={style}
      noTabs={REGISTER_ROUTES.includes(pathname)}
    />
  ) : (
      <NavigationNonAuth style={style || {'backgroundColor': 'white'}} />
    );
};

const NavigationAuth = ({
  authUser,
  history,
  emailVerified,
  hasProfile,
  style,
  noTabs,
}) => {
  const [image, setImage] = useState(null);

  const { pathname } = history.location;
  const isRegPage = pathname.includes('registration');

  const fetchProfileImage = async () => {
    try {
      const image = await userProfilePicService.download();
      setImage(image);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <Navbar className={styles.navbar} expand="lg" style={style}>
      <LOGO />
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        className="navbar-dark"
      />
      {!isRegPage && (
        <Navbar.Collapse className={styles.navCollapse}>
          {emailVerified && !noTabs && (
            <div className={styles.tabs}>
              <NavItems
                className={styles.black}
                tabs={pipelineTables}
              />
              <NavItems
                className={styles.white}
                tabs={infoTabs}
              />
            </div>
          )}
        </Navbar.Collapse>
      )}
      {!isRegPage && (
        <div className={styles.dropdownContainer}>
          <NotificationNavItem isCSA={true} />
          <NavDropdown alignRight title={<UserIcon image={image} />}>
            <NavDropdown.Item as="span">
              {' '}
              {authUser.displayName}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            {hasProfile === false ? (
              <NavDropdown.Item disabled>My Profile</NavDropdown.Item>
            ) : (
                <>
                  <NavDropdown.Item
                    onClick={() => history.push(CSA_ROUTES.PROFILE)}
                  >
                    My profile
                </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => history.push(CSA_ROUTES.MY_CONTACTS_CUSTOMERS)}
                  >
                    My contacts
                </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => history.push(CSA_ROUTES.CALENDAR)}
                  >
                    My calendar
                </NavDropdown.Item>
                </>
              )}
            <NavDropdown.Item href={CSA_ROUTES.MAIN_HOME}>
              <SignOutButton />
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      )}
      {isRegPage && (
        <div className={styles.navSignoutButtonPanel}>
          <a href={CSA_ROUTES.MAIN_HOME}>
            <SignOutButton mode={1} />
          </a>
        </div>
      )}
    </Navbar>
  );
};

const NavigationNonAuth = ({ style }) => {
  return (
    <Navbar className={styles.navbar} style={style}>
      <Container fluid className="d-flex flex-row align-items-center">
        <Container className="d-flex flex-row justify-content-start align-items-center ml-2">
          <LOGO toHome />
          <img className={styles.kyrosLogo} src={kyrosTextLogo} alt="kyrosTextLogo"></img>
        </Container>
        <Container className="d-flex flex-row justify-content-end align-items-center mr-3">
          <div className="d-flex flex-column">
            <div className="d-flex">
              <div className="text-white"> <p className="rights m-0 mr-3" style={{ lineHeight: "40px", color: "gray" }}>follow us</p></div>
              <div className="social-icons">
                <a
                  href="https://m.youtube.com/channel/UC7Dpgqmw1gPJr6vYVTqfIBQ"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="footer-icon" src={Youtube} alt="youtube" style={{ width: "35px", height: "35px", marginRight: "5px" }} />
                </a>
              </div>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/risewithkyrosai"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="footer-icon" src={Facebook} alt="facebook" style={{ width: "35px", height: "35px", marginRight: "5px" }} />
                </a>
              </div>
              <div className="social-icons">
                <a
                  href="https://www.instagram.com/kyros.ai/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="footer-icon" src={Instagram} alt="instagram" style={{ width: "35px", height: "35px", marginRight: "5px" }} />
                </a>
              </div>
              <div className="social-icons">
                <a
                  href="https://www.tiktok.com/@kyros.ai"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="footer-icon" src={TikTok} alt="tiktok" style={{ width: "35px", height: "35px", marginRight: "5px" }} />
                </a>
              </div>
            </div>

          </div>
        </Container>
      </Container>
    </Navbar>
  );
};

const NavItems = ({ tabs, disabled, className }) => {
  const history = useHistory();
  const lastIndex = tabs.length - 1;
  const { location } = history;
  return (
    <>
      {tabs.map(({ text, sections }, index) => {
        const isAvailable = isDropdownAvailable(sections);
        return (
          <NavDropdown
            key={index}
            title={text || ''}
            disabled={disabled}
            className={cn(className, {
              [styles.first]: index === 0,
              [styles.last]: index === lastIndex,
              [styles.active]: isActiveTab(sections, location.pathname),
              'App-disabled': disabled,
            })}
          >
            {!isAvailable && (
              <NavDropdown.Item as="span">Available soon</NavDropdown.Item>
            )}
            {isAvailable &&
              sections.map((section, index) => (
                <NavDropdown.Item
                  key={index}
                  className={cn({
                    [styles.disabled]: section.path == null,
                  })}
                  onClick={() => history.push(section.path)}
                >
                  {section.text}
                </NavDropdown.Item>
              ))}
          </NavDropdown>
        );
      })}
    </>
  );
};

Navigation.prototype = {
  authUser: PropTypes.object,
};

export default withRouter(Navigation);
