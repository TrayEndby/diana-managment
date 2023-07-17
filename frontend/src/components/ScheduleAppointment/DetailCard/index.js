import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Header from '../Header';
import BackButton from 'util/BackButton';
import PhoneInput from 'util/PhoneInput/old';

import styles from './style.module.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

const DetailCard = ({
  title,
  owner,
  duration,
  submitting,
  onSubmit,
  onBack,
}) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    note: '',
  });
  const { firstName, lastName, email, phone } = data;

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <section>
      <Header owner={owner} duration={duration} />
      <div className={styles.time}>{title}</div>
      <BackButton onClick={onBack} />
      <Form className={styles.form} onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>First Name*</Form.Label>
              <Form.Control
                required
                name="firstName"
                value={firstName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Last Name*</Form.Label>
              <Form.Control
                required
                name="lastName"
                value={lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Email Address*</Form.Label>
              <Form.Control
                required
                name="email"
                value={email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <PhoneInput
                label="Phone Number"
                name="phone"
                value={phone}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
          <Form.Group>
            <Form.Control
              as="textarea"
              name="note"
              style={{ height: '140px' }}
              placeholder="Additional notes (e.g please contact me from phone)"
              onChange={handleChange}
            />
          </Form.Group>
          </Col>
        </Row>
        <Button type="submit" disabled={submitting}>
          Schedule Appointment
        </Button>
      </Form>
    </section>
  );
};

DetailCard.propTypes = propTypes;

export default DetailCard;
