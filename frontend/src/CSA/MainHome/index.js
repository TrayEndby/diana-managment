import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';

import logo from "../../assets/CSA/Landing/Logo.png"

import copyright from "../../assets/CSA/Landing/copyright.svg"

import middleSection from "../../assets/CSA/Landing/CSA-Middle.png"
import topSection from "../../assets//CSA//Landing//CSA-Header-Home.png"
import lowerSection from "../../assets/CSA/Landing/CSA-Lower.png"
import contactSection from "../../assets/CSA/Landing/CSA-Contact.png"
import headerText from "../../assets/CSA/Landing/Header-Text.png"
import riseWithKyros from "../../assets/CSA/Landing/RiseWithKyros.png"

const CSALandingPage = () => (
  <div className="csa-landing">
    <MainView />
    <MiddleSection />
    <LowerSection />
    <ContactSection />
    <Footer />
  </div>
);

const MainView = () => (
  <Container fluid className="d-flex flex-row justify-content-center align-items-start header-background">
    <img className="responsive top-section" src={topSection} alt="topSection"></img>
    <div className="header-text1">
      <img className="responsive-text" src={headerText} alt="headerText"></img>
      <div className="d-flex flex-row action-buttons">
        <div className="text-center mr-4">
          <Link to={CSA_ROUTES.SIGN_UP}>
            <Button className="btn-journey" size="sm" style={{ height: '47px', marginRight: "24px" }}>
              Apply Now
         </Button>
          </Link>
          <Link to={CSA_ROUTES.LOG_IN}><p className="have-account">*I already have an account</p></Link>
        </div>
      </div>
    </div>
    <div className="home-box">
      <span />
      <span />
      <span />
    </div>
  </Container>
);


const MiddleSection = () => (
  <Container fluid style={{ width: "100%", height: "auto" }} className="d-flex flex-column justify-content-center middle-section">
    <img className="responsive" style={{ width: "100%" }} src={middleSection} alt="middleSection"></img>
  </Container>
);

const LowerSection = () => (
  <Container fluid style={{ width: "100%", height: "auto" }} className="d-flex flex-column justify-content-center lower-section">
    <img className="responsive" style={{ width: "100%" }} src={lowerSection} alt="lowerSection"></img>
    <div className="lower-text">
      <div className="d-flex flex-row lower-button">
        <div className="text-center mr-4">
          <Link to={CSA_ROUTES.SIGN_UP}>
            <Button className="btn-journey-lower " size="sm" style={{ height: '47px' }}>
              Apply Now
         </Button>
          </Link>
        </div>
      </div>
    </div>
  </Container>
);

const ContactSection = () => (
  <Container fluid style={{ width: "100%", height: "auto" }} className="d-flex flex-column justify-content-center contact-section">
    <img className="responsive" style={{ width: "100%" }} src={contactSection} alt="contactSection"></img>
    <div className="contact-text">
      <div className="d-flex flex-row contact-button">
        <div className="text-center mr-2">
          <a href="mailto:csa-jobs@kyros.ai" rel="noopener noreferrer" target="_blank">
            <Button className="btn-journey-contact" size="sm" style={{ height: '47px' }}>
              Email Us
         </Button>
          </a>
        </div>
      </div>
    </div>
  </Container>
);

const Footer = () => (
  <div className="footer">
    <Container fluid className="d-flex flex-row align-items-center footer-container">
      <Container className="d-flex flex-row justify-content-start align-items-center">
        <img style={{ width: "70px" }} src={logo} alt="logo"></img>
        <div className="d-flex flex-column ml-3">
          <img style={{ width: "62%" }} src={riseWithKyros} alt="riseWithKyros"></img>
          <div><img src={copyright} className="copyright" alt="copyright" /> <p className="rights mt-3 mb-0" >2021 Kyros.ai. All rights reserved.</p></div>
        </div>
      </Container>
      <Container className="d-flex flex-row justify-content-end align-items-center">
        <div>
          <Link to={ROUTES.LEGAL_PRIVACY}>
            <p className="mt-0 mb-0 footer-text">Privacy Policy</p>
          </Link>
        </div>
        <div>
          <Link to={ROUTES.LEGAL_TERM}>
            <p className="mt-0 mb-0 footer-text">Terms of Use</p>
          </Link>
        </div>
        <div>
          <Link to={ROUTES.LEGAL_EULA}>
            <p className=" mt-0 mb-0 footer-text">EULA</p>
          </Link>
        </div>
        <div>
          <a href="mailto:info@kyros.ai" rel="noopener noreferrer" target="_blank">
            <p className="mt-0 mb-0 footer-text">Contact Us</p>
          </a>
        </div>
      </Container>
    </Container>
  </div >
);

export default CSALandingPage;
