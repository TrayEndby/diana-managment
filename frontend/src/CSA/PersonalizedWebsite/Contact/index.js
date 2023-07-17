import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { TelephoneFill, EnvelopeFill } from 'react-bootstrap-icons';

import EditButton from '../Edit';
import EditModal from './EditModal';
import PhoneInput from 'util/PhoneInput/old';

import styles from './style.module.scss';

const propTypes = {
  editable: PropTypes.bool,
  phone: PropTypes.string,
  email: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

const ContactSection = ({ editable, phone, email, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.contact}>
      <header>
        <h5>CONTACT ME</h5>
        {editable && <EditButton onClick={() => setShowModal(true)} />}
      </header>
      <div className={styles.section}>
        <div>
          <TelephoneFill />
          {phone ? <PhoneInput value={phone} displayOnly /> : 'placeholder'}
        </div>
        <div>
          <EnvelopeFill />
          {email || 'placeholder'}
        </div>
      </div>
      {showModal && <EditModal phone={phone} email={email} onUpdate={onUpdate} onClose={() => setShowModal(false)} />}
    </section>
  );
};

ContactSection.propTypes = propTypes;

export default ContactSection;
