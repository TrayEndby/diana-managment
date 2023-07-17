import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ChevronRight } from 'react-bootstrap-icons';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import generalService from 'service/GeneralService';

import styles from './style.module.scss';

const propTypes = {
  onSave: PropTypes.func.isRequired,
};

const whatToKnowOptions = [
  'high school planning',
  'standardized testing prep',
  'summer programs & internship',
  'college and major research',
  'college application guidance',
  'parent and student community resources',
];

const gradeOptions = [
  '8th grade',
  '9th grade',
  '10th grade',
  '11th grade',
  '12th grade',
  'other',
];

const questionByRole = {
  student: {
    school: 'What is your current school?',
    grade: 'What is your current grade?',
  },
  parent: {
    school: 'What is your child’s current school?',
    grade: 'What is your child’s current grade?',
  },
};

const placeholderByRole = {
  student: {
    school: 'Enter your current school',
  },
  parent: {
    school: 'Enter your child’s current school',
  },
};

const Section = ({ title, className, children }) => {
  return (
    <div className={cn(styles.section, className)}>
      <div className={styles.title}>
        <ChevronRight />
        <span>{title}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const LeadForm = ({ onSave }) => {
  const [data, setData] = useState({
    role: 'student',
    whatToKnow: '',
    school: '',
    grade: '',
    inquiring: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stateAndCountry: '',
    studentFirstName: undefined,
    studentLastName: undefined,
    studentEmail: '',
  });
  const [error, setError] = useErrorHandler();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await generalService.submitLeadForm(data.email, JSON.stringify(data));
      onSave();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const handleChangeData = (name, value) => {
    setData((data) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleChange = (e) => {
    handleChangeData(e.target.name, e.target.value);
  };

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      {/* Roles */}
      <Section title="I'm a..." className={styles.highlight}>
        <div className={styles.rolesButton}>
          {['student', 'parent'].map((role) => (
            <Button
              key={role}
              variant="outline-success"
              className={cn({
                [styles.highlight]: data.role === role,
              })}
              onClick={() => handleChangeData('role', role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </Section>
      {/* What to know */}
      <Section title="I want to learn more about:">
        <Form.Group className={styles.whatToKnow}>
          {whatToKnowOptions.map((text, index) => (
            <Form.Check
              required
              key={index}
              type="radio"
              name="whatToKnow"
              value={text}
              label={text}
              checked={data.whatToKnow === text}
              onChange={() => handleChangeData('whatToKnow', text)}
            />
          ))}
        </Form.Group>
      </Section>
      {/* School */}
      <Section title={questionByRole[data.role].school}>
        <Form.Group>
          <Form.Control
            required
            name="school"
            value={data.school}
            placeholder={placeholderByRole[data.role].school}
            onChange={handleChange}
          />
        </Form.Group>
      </Section>
      {/* Grade */}
      <Section title={questionByRole[data.role].grade}>
        <Form.Group className={styles.grades}>
          {gradeOptions.map((garde, index) => (
            <Form.Check
              required
              key={index}
              type="radio"
              name="garde"
              value={garde}
              label={garde}
              checked={data.garde === garde}
              onChange={() => handleChangeData('garde', garde)}
            />
          ))}
        </Form.Group>
      </Section>
      {/* Inquiring */}
      <Section title="What are you inquiring about?">
        <Form.Group>
          <Form.Control
            name="inquiring"
            value={data.inquiring}
            placeholder="Enter your inquiring (Optional)"
            onChange={handleChange}
          />
        </Form.Group>
      </Section>
      {/* Contact Info */}
      <Section
        title="My contact information is..."
        className={styles.highlight}
      >
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            name="email"
            value={data.email}
            type="email"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            required
            name="phone"
            value={data.phone}
            onChange={handleChange}
            type="tel"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Which state and country are you from?</Form.Label>
          <Form.Control
            required
            name="stateAndCountry"
            value={data.stateAndCountry}
            onChange={handleChange}
          />
        </Form.Group>
        {data.role === 'parent' && (
          <>
            <Form.Group>
              <Form.Label>Student’s first Name</Form.Label>
              <Form.Control
                required
                name="studentFirstName"
                value={data.studentFirstName || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Student’s last name</Form.Label>
              <Form.Control
                required
                name="studentLastName"
                value={data.studentLastName || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Student’s email</Form.Label>
              <Form.Control
                required
                name="studentEmail"
                value={data.studentEmail || ''}
                type="email"
                onChange={handleChange}
              />
            </Form.Group>
          </>
        )}

        <Form.Group className={styles.agreement}>
          <Form.Check required />
          <span>
            I agree to the{' '}
            <a
              href="https://www.kyros.ai/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
          </span>
        </Form.Group>
      </Section>
      <ErrorDialog error={error} />
      <Button className={styles.submit} type="submit" disabled={saving}>
        {saving ? 'Submitting...' : 'Submit'}
      </Button>
    </Form>
  );
};

LeadForm.propTypes = propTypes;

export default LeadForm;
