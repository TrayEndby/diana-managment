import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './style.scss';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';

import prospectService from 'service/CSA/ProspectService';

import logo from '../../assets/CSA/Landing/Logo.png';

import copyright from '../../assets/CSA/Landing/copyright.svg';

import middleSection from '../../assets/CSA/Landing/CSA-Middle.png';
import topSection from '../../assets//CSA//Landing//CSA-Header.png';
import lowerSection from '../../assets/CSA/Landing/CSA-Lower.png';
import contactSection from '../../assets/CSA/Landing/CSA-Contact.png';
import headerText from '../../assets/CSA/Landing/Header-Text.png';
import riseWithKyros from '../../assets/CSA/Landing/RiseWithKyros.png';

const CSALandingPage = () => (
  <div className="csa-landing">
    <MainView />
    <MiddleSection />
    <LowerSection />
    <ContactSection />
    <Footer />
  </div>
);

const MainView = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [describeValue, setDescribeValue] = useState(0);
  const [otherDescribeText, setOtherDescribeText] = useState('');
  const [learnMore, setLearnMore] = useState(0);

  const learnMoreString = ['schedule 1:1', 'attend webinar'];
  const roleString = ['Student', 'Parent', 'Educator'];

  const history = useHistory();

  const handleSubmit = async () => {
    const valueObject = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      learn_more: learnMoreString[learnMore - 1],
    };
    if (describeValue < 4) {
      valueObject.role = roleString[describeValue - 1];
    } else {
      valueObject.role = otherDescribeText;
    }
    await prospectService.formSubmit(
      'csa_prospect',
      `csa_prospect:${email}`,
      JSON.stringify(valueObject),
    );

    history.push(CSA_ROUTES.REGISTRATION_SUCCESS);
  };

  return (
    <Container
      fluid
      className="d-flex flex-row justify-content-center align-items-start header-background"
    >
      <img
        className="responsive top-section"
        src={topSection}
        alt="topSection"
      ></img>
      <div className="header-text">
        <img
          className="responsive-text"
          src={headerText}
          alt="headerText"
        ></img>
        <div className="d-flex flex-row action-buttons"></div>
      </div>

      <div className="form">
        <div className="d-flex flex-row">
          <div className="text-center">
            <Form className="d-flex flex-column">
              <Form.Group className="mb-1 text-left">
                <h2 className="learn-more">Learn more about CSA program</h2>
                <Form.Label className="label mt-1">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={firstName || ''}
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-1 text-left">
                <Form.Label className="label">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={lastName || ''}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-1 text-left">
                <Form.Label className="label">Email address</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={email || ''}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-2 text-left">
                <Form.Label className="label mb-2">
                  Which of the following best describe you?
                </Form.Label>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Student"
                    name="describeRadio"
                    id="dRadio1"
                    checked={describeValue === 1 ? true : false}
                    onClick={() => setDescribeValue(1)}
                  />
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Parent"
                    name="describeRadio"
                    id="dRadio2"
                    checked={describeValue === 2 ? true : false}
                    onClick={() => setDescribeValue(2)}
                  />
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Educator"
                    name="describeRadio"
                    id="dRadio3"
                    checked={describeValue === 3 ? true : false}
                    onClick={() => setDescribeValue(3)}
                  />
                </div>
                <div className="d-flex">
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Other"
                    name="describeRadio"
                    id="dRadio4"
                    checked={describeValue === 4 ? true : false}
                    onClick={() => setDescribeValue(4)}
                  />
                  <Form.Control
                    type="text"
                    size="sm"
                    value={otherDescribeText}
                    className="mt-1"
                    onChange={(e) => setOtherDescribeText(e.target.value)}
                    disabled={describeValue === 4 ? false : true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-1 text-left">
                <Form.Label className="label">
                  How would you like to learn more?
                </Form.Label>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Schedule 1:1"
                    name="LearnMore"
                    checked={learnMore === 1 ? true : false}
                    onClick={() => setLearnMore(1)}
                  />
                  <Form.Check
                    className="mx-2 my-2"
                    type="radio"
                    label="Attend Webinar"
                    name="LearnMore"
                    checked={learnMore === 2 ? true : false}
                    onClick={() => setLearnMore(2)}
                  />
                </div>
              </Form.Group>
              <div className="text-center mt-2">
                <Button
                  className="btn-journey-form text-center"
                  style={{ height: '37px' }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </Form>
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
};

const MiddleSection = () => (
  <Container
    fluid
    style={{ width: '100%', height: 'auto' }}
    className="d-flex flex-column justify-content-center middle-section"
  >
    <img
      className="responsive"
      style={{ width: '100%' }}
      src={middleSection}
      alt="middleSection"
    ></img>
  </Container>
);

const LowerSection = () => (
  <Container
    fluid
    style={{ width: '100%', height: 'auto' }}
    className="d-flex flex-column justify-content-center lower-section"
  >
    <img
      className="responsive"
      style={{ width: '100%' }}
      src={lowerSection}
      alt="lowerSection"
    ></img>
  </Container>
);

const ContactSection = () => (
  <Container
    fluid
    style={{ width: '100%', height: 'auto' }}
    className="d-flex flex-column justify-content-center contact-section"
  >
    <img
      className="responsive"
      style={{ width: '100%' }}
      src={contactSection}
      alt="contactSection"
    ></img>
    <div className="contact-text">
      <div className="d-flex flex-row contact-button">
        <div className="text-center mr-2">
          <a
            href="mailto:csa-jobs@kyros.ai"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              className="btn-journey-contact"
              size="sm"
              style={{ height: '47px' }}
            >
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
    <Container
      fluid
      className="d-flex flex-row align-items-center footer-container"
    >
      <Container className="d-flex flex-row justify-content-start align-items-center">
        <img style={{ width: '70px' }} src={logo} alt="logo"></img>
        <div className="d-flex flex-column ml-3">
          <img
            style={{ width: '62%' }}
            src={riseWithKyros}
            alt="riseWithKyros"
          ></img>
          <div>
            <img src={copyright} className="copyright" alt="copyright" />{' '}
            <p className="rights mt-3 mb-0">
              2021 Kyros.ai. All rights reserved.
            </p>
          </div>
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
          <a
            href="mailto:info@kyros.ai"
            rel="noopener noreferrer"
            target="_blank"
          >
            <p className="mt-0 mb-0 footer-text">Contact Us</p>
          </a>
        </div>
      </Container>
    </Container>
  </div>
);

export default CSALandingPage;
