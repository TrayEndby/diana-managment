import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { ReactComponent as EmailIcon } from 'assets/svg/email.svg';
import { ReactComponent as PinIcon } from 'assets/svg/pin.svg';
import { ReactComponent as SchoolIcon } from 'assets/svg/school.svg';
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg';
import Avatar from 'util/Avatar';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import { CONTACT_TAG } from 'constants/contactTags';
import contactService from 'service/ContactService';

import style from '../style.module.scss';

const propTypes = {
  content: PropTypes.object,
};

export const CARD_TYPE = {
  FRIEND: 'FriendCard'
}

const tagsArray = [
  { tag: undefined, text: '' },
  { tag: CONTACT_TAG.STUDENT, text: 'Student' },
  { tag: CONTACT_TAG.EDUCATOR, text: 'Educator' },
  { tag: CONTACT_TAG.PARENT, text: 'Parent' }
]

const StudentCard = ({ type, content, onRemove, onMessage, onTagChange }) => {
  const [error, setError] = useErrorHandler(null);
  const history = useHistory();
  if (!content) {
    return null;
  }

  const setContactTag = async (e, userId) => {
    try {
      const { value: tag } = e.target;
      const contactList = await contactService.listContact();
      const selectedContact = contactList.find(c => c.contact_id === userId);
      await contactService.updateContact(userId, selectedContact.status, tag);
      onTagChange(userId, tag);
    } catch (e) {
      setError(e);
    }
  }

  const renderHeader = (userId, tags) => {
    switch (type) {
      case CARD_TYPE.FRIEND:
        return (
          <div className={cn('ml-3', style.cardHeader)}>
            <div className={style.nameGenderWrap}>
              <Card.Text className={style.cardName}>{content.firstName} {content.lastName}</Card.Text>
              <Card.Text className={cn(style.orangeText, style.genderText)}>{content.gender}</Card.Text>
            </div>
            <FormControl as="select" value={tags} className={style.tagSelector} plaintext onChange={(e) => setContactTag(e, userId)}>
              {tagsArray.map(({ tag, text }, key) => (
                <option value={tag} key={key}>{text}</option>
              ))}
            </FormControl>
          </div>
        )
      default:
        return (
          <div className={cn('ml-3', style.cardHeader)}>
            <div className={style.nameGenderWrap}>
              <Card.Text className={style.cardName}>{content.name}</Card.Text>
              <Card.Text className={style.orangeText}>Student</Card.Text>
            </div>
          </div>
        )
    }
  }
  return (
    <>
      {error && <ErrorDialog error={error}></ErrorDialog>}
      <Card className={cn('my-4', style.shadowCard)}>
        <div className={cn('px-3', style.cardContent)}>
          <div>
            <Avatar id={content.user_id} size={60} className={style.avatar} />
          </div>
          {renderHeader(content.user_id, content?.tags)}
        </div>
        <div className="m-2 p-2 d-flex flex-column h-100">
          <div className={cn('m-2 p-0', style.flex)}>
            <EmailIcon className={style.icon} />
            <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.email}</Card.Text>
          </div>
          {content.school && (
            <div className={cn('m-2 p-0', style.flex)}>
              <SchoolIcon className={style.icon} />
              <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.school}</Card.Text>
            </div>
          )}
          {content.location && (
            <div className={cn('m-2 p-0', style.flex)}>
              <PinIcon className={style.icon} />
              <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.location}</Card.Text>
            </div>
          )}
          {content.graduate && (
            <div className={cn('m-2 p-0', style.flex)}>
              <ClockIcon className={style.icon} />
              <Card.Text className="App-textOverflow p-1 mb-0 ml-2">{content.graduate}</Card.Text>
            </div>
          )}
          <div className={cn('m-2 p-0 mt-auto', style.flex)}>
            <Button variant="primary" onClick={() => onMessage(content.user_id, history)}>
              Message
            </Button>
            {onRemove && <Button variant="secondary" className="ml-2" onClick={() => onRemove(content.user_id)}>
              Remove
            </Button>}
          </div>
        </div>
      </Card>
    </>
  );
};

StudentCard.propTypes = propTypes;

export default StudentCard;
