import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import EditButton from '../Edit';
import EditModal from './EditModal';

import UserIcon from 'components/Navigation/UserIcon/index.js';
import userProfilePicService from 'service/UserProfilePicService';
import * as CSA_ROUTES from 'constants/CSA/routes';

import styles from './style.module.scss';

const propTypes = {
  editable: PropTypes.bool,
  user_id: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

const BioSection = ({ editable, user_id, title, content, onUpdate }) => {
  const [image, setImage] = useState();
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const promise =
      user_id == null
        ? userProfilePicService.downloadPublicImage()
        : userProfilePicService.downloadPublicImageByProfileId(user_id, user_id);
    promise.then(setImage).catch(console.error);
  }, [user_id]);

  return (
    <section className={styles.aboutMe}>
      <header>
        <h5>ABOUT ME</h5>
        {editable && <EditButton onClick={() => setShowModal(true)} />}
      </header>
      <div className={styles.section}>
        <div className={styles.picture}>
          <div className={styles.image}>
            <UserIcon image={image} />
          </div>
        </div>
        <div className={styles.about}>
          <div className={styles.name}>{title || 'Placeholder'}</div>
          <div className={styles.detail}>{content || 'placeholder'}</div>
          {editable ? (
            <Button
              onClick={() =>
                history.push(`${CSA_ROUTES.CALENDAR_AVAILABILITY}`)
              }
            >
              Set My Calendar
            </Button>
          ) : (
            <Button
              onClick={() =>
                history.push(`${CSA_ROUTES.APPOINTMENT}?id=${user_id}`)
              }
            >
              Make an appointment with me
            </Button>
          )}
        </div>
        {showModal && (
          <EditModal
            title={title}
            content={content}
            onUpdate={onUpdate}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </section>
  );
};

BioSection.propTypes = propTypes;

export default React.memo(BioSection);
