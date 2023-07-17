import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { ReactComponent as EmailIcon } from 'assets/svg/email.svg';
import { ReactComponent as PhoneIcon } from 'assets/svg/phone.svg';
import Avatar from 'util/Avatar';
import { handleMessage } from 'CSA/MyContacts/utils';
import ErrorDialog from 'util/ErrorDialog';

import style from '../style.module.scss';

const propTypes = {
  content: PropTypes.array,
};

const ParentCard = ({ content }) => {
  return <ParentGridView content={content} />;
};

const ParentGridView = ({ content }) => {
  const [error, setError] = useState(null);
  const history = useHistory();

  if (!content) {
    return null;
  }

  const handleError = (error) => {
    setError(error.message);
  };

  return (
    <div>
      {error && <ErrorDialog error={error}></ErrorDialog>}
      <Card className={cn('my-4', style.shadowCard)}>
        <div className={cn('pl-3', style.cardContent)}>
          <div>
            <Avatar id={content.user_id} size={60} className={style.avatar} />
          </div>
          <div className="ml-3 p-0">
            <Card.Text className={cn('App-textOverflow', style.cardName)}>{content.name}</Card.Text>
            <Card.Text className={cn('App-textOverflow', style.orangeText)}>Parent</Card.Text>
          </div>
        </div>
        <div className="m-2 p-2">
          <div className={cn('m-2 p-0', style.flex)}>
            <PhoneIcon className={style.icon} />
            <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.phone}</Card.Text>
          </div>
          <div className={cn('m-2 p-0', style.flex)}>
            <EmailIcon className={style.icon} />
            <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.email}</Card.Text>
          </div>
          <div style={{ width: '96%', marginLeft: '2%', height: '1px', backgroundColor: 'grey' }}></div>
          <div className={cn('m-2 p-0', style.flex)}>
            <Card.Text className={cn('App-textOverflow p-1 mb-0 ml-2', style.orangeText)}>
              Number of children:
            </Card.Text>
            <Card.Text className="App-textOverflow p-1 mb-0 ml-1">{content.childrenCount}</Card.Text>
          </div>
          <div className={cn('m-2 p-0', style.flex)}>
            <Card.Text className={cn('App-textOverflow p-1 mb-0 ml-2', style.orangeText)}>Children name:</Card.Text>
            <Card.Text className="App-textOverflow p-1 mb-0 ml-1">{content.childrens}</Card.Text>
          </div>
          <div className={cn('m-3 p-0', style.flex)}>
            <Button variant="primary" onClick={() => handleMessage(content.user_id, history, handleError)}>
              Message
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

ParentCard.propTypes = propTypes;

export default ParentGridView;
