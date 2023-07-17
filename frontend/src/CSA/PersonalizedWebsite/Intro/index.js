import React, { useState } from 'react';
import PropTypes from 'prop-types';

import EditButton from '../Edit';
import EditModal from './EditModal';

import styles from './style.module.scss';

const propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

const IntroSection = ({ editable, title, content, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.intro}>
      <div className={styles.section}>
        <div className={styles.quote}>RISE WITH KYROS</div>
        <div className={styles.title}>{title || 'Placeholder'}</div>
        <div className={styles.text}>{content || 'placeholder'}</div>
        {editable && <EditButton onClick={() => setShowModal(true)} />}
      </div>
      {showModal && (
        <EditModal title={title} content={content} onUpdate={onUpdate} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
};

IntroSection.propTypes = propTypes;

export default React.memo(IntroSection);
