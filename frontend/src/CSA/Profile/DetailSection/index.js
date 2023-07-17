import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import CountryListInput from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';
import PhoneInput from 'util/PhoneInput';
import DateInput from 'util/DateInput';
import SSNInput from 'util/SSNInput';
import SaveButton from 'util/SaveButton';

import style from './style.module.scss';

const propTypes = {
  basicData: PropTypes.object,
  saveAccount: PropTypes.func,
};

const getBirthdayDate = (birthday) => {
  try {
    return birthday.split('T')[0];
  } catch (e) {
    console.error(e);
    return birthday;
  }
};

const DetailSection = ({ basicData, saveAccount }) => {
  const [firstName, setFirstName] = useState(basicData.firstName);
  const [lastName, setLastName] = useState(basicData.lastName);
  const [birthday] = useState(getBirthdayDate(basicData.birthday));
  const [ssn] = useState(basicData.ssn);
  const [email] = useState(basicData.email);
  const [phone, setPhone] = useState(basicData.phone);
  const [about, setAbout] = useState(basicData.bio);
  const [street, setStreet] = useState(basicData.mailingAdd);
  const [mailingCity, setCity] = useState(basicData.mailingCity);
  const [mailingZip, setZip] = useState(basicData.mailingZip);
  const [province, setProvince] = useState(basicData.mailingState);
  const [mailingCountry, setCountry] = useState(basicData.mailingCountry);
  const [code] = useState(basicData.code);
  const [personalWebsiteName] = useState(basicData.personalWebsiteName);
  const basicFormRef = useRef();
  const addressFormRef = useRef();
  const [validated, setValidated] = useState(false);

  const saveProfile = () => {
    if (
      !basicFormRef.current.checkValidity() ||
      !addressFormRef.current.checkValidity()
    ) {
      setValidated(true);
      return false;
    } else {
      setValidated(false);
      saveAccount({
        firstName,
        lastName,
        email,
        mailingAdd: street,
        mailingCity,
        mailingState: province,
        mailingZip,
        mailingCountry,
        ssn,
        birthday,
        phone,
        bio: about,
        code,
        personalWebsiteName,
      });
      return true;
    }
  };

  return (
    <div className={style.detailSection}>
      <div className={style.detailTitle}>Profile Information</div>
      <div className={style.underlineBar}></div>
      <Form ref={basicFormRef} validated={validated}>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            First Name
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Last Name
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            {mailingCountry === 'US' ? 'SSN' : 'National ID'}
          </Form.Label>
          <Col sm="8">
            <SSNInput
              required
              disabled
              isSSN={mailingCountry === 'US'}
              value={ssn}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Birthday
          </Form.Label>
          <Col sm="8" style={{ height: '38px' }}>
            <DateInput
              required
              disabled
              value={birthday}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Email address
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              readOnly
              type="text"
              name="email"
              value={email}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Phone number
          </Form.Label>
          <Col sm="8">
            <PhoneInput
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            About me
          </Form.Label>
          <Col sm="8">
            <Form.Control
              as="textarea"
              required={false}
              type="text"
              value={about}
              multiple
              onChange={(e) => setAbout(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
      <div className={style.detailTitle}>Home address</div>
      <div className={style.underlineBar}></div>
      <Form ref={addressFormRef} validated={validated}>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Street address
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            City
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="text"
              value={mailingCity}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            ZIP code
          </Form.Label>
          <Col sm="8">
            <Form.Control
              required
              type="text"
              value={mailingZip}
              onChange={(e) => setZip(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            State/Province
          </Form.Label>
          <Col sm="8">
            <StateListInput
              required
              countryCode={mailingCountry}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label className="text-right" column sm="3">
            Country
          </Form.Label>
          <Col sm="8">
            <CountryListInput
              required
              value={mailingCountry}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
      <div style={{ marginBottom: '30px' }}>
        <SaveButton
          variant="primary"
          style={{ width: '100px', height: '40px' }}
          onClick={saveProfile}
        >
          Save
        </SaveButton>
      </div>
    </div>
  );
};

DetailSection.propTypes = propTypes;

export default DetailSection;
