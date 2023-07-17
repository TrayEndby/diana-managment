import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { StarFill, Heart, HeartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import * as ROUTES from 'constants/routes';

import Avatar from 'util/Avatar';
import style from './style.module.scss';

const EducatorCard = ({ educator, toggleSavedState }) => {
  const id = educator.educatorProfile.uid;
  const SaveIcon = educator.isSaved ? HeartFill : Heart;

  return (
    <Card key={id} className={style.card}>
      <Card.Header className={style.cardHeader}>
        <div style={{ display: 'flex' }}>
          <Avatar id={id} size={55} />
          <div className={style.nameWrap}>
            <div className={style.actions}>
              <h5 className={style.name}>
                {educator.limitedBasicInfo?.firstName} {educator.limitedBasicInfo?.lastName}
              </h5>
              <StarFill color="yellow" fill="yellow" size="24px" />
              <p>{educator.educatorProfile.rating}</p>
            </div>
            <p className={style.location}>
              {educator.limitedBasicInfo?.SchoolState}, {educator.limitedBasicInfo?.SchoolCity}
            </p>
          </div>
        </div>
        <SaveIcon
          style={{ cursor: 'pointer' }}
          color="red"
          fill="red"
          size="32px"
          onClick={() => toggleSavedState(id, educator.isSaved)}
        />
      </Card.Header>
      <Card.Body className={style.cardBody}>
        <div className={style.rate}>
          <h5>Hourly rate</h5>
          <p>{educator.rate}</p>
        </div>
        <div className={style.experience}>
          <h5> Experience</h5>
          <p>{educator.experience}</p>
        </div>
        <div className={style.services}>
          <h5>Provide services:</h5>
          <p>{educator.services}</p>
        </div>
        <div className={style.bio}>
          <h5>Short bio</h5>
          <p className={style.text}>{educator.educatorProfile?.bio || 'No bio available'}</p>
          <Link to={`${ROUTES.EDUCATOR_DETAILS}?id=${id}`} className={style.button}>
            <Button variant="primary">See details</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EducatorCard;
