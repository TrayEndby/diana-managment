import React from 'react';
import Popover from 'react-bootstrap/Popover';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import projectImgPlaceholder from 'assets/Educator/educatorProjectPlaceholder.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import cn from 'classnames';
import Button from 'react-bootstrap/Button';
import AddContactModal from 'util/Modals/AddContactModal';
import './style.scss';

const ProfilePopup = ({ children, targetUserName, targetUserId, hide, requestStatus, onDirectMessage }) => {
  const [show, setShow] = React.useState(false)
  const [isAddContactModal, setIsAddContactModal] = React.useState(false);

  const handleDirectMessage = (targetUserId) => {
    onDirectMessage(targetUserId);
    setShow(false)
  }

  const onToggle = () => setShow(prev => !prev);

  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement="right-start"
        onToggle={onToggle}
        show={show}
        overlay={
          <Popover className={cn('conversation-user-popup', { hide: hide })}>
            <div className="conversation-user-popup__img">
              <img src={projectImgPlaceholder} alt="user profile" />
            </div>
            <Popover.Title as="h3">
              {targetUserName}
              <Link
                to={{ pathname: ROUTES.PUBLIC_PROFILE, state: { id: targetUserId } }}
                className="App-text-clickable"
              >
                <span className="conversation-user-popup__view-full">View full profile</span>
              </Link>
            </Popover.Title>
            <Popover.Content>
              <div className="conversation-user-popup__btn-wrap">
                <Button variant="primary" onClick={() => handleDirectMessage(targetUserId)}>
                  Message
              </Button>
                <Button
                  className={cn('btn-tertiary-light', { disabled: requestStatus })}
                  onClick={() => { setIsAddContactModal(true); setShow(false) }}
                >
                  Add to Contacts
              </Button>
              </div>
            </Popover.Content>
          </Popover>
        }>
        {children}
      </OverlayTrigger>
      <AddContactModal
        userId={targetUserId}
        isOpened={isAddContactModal}
        closeModal={() => setIsAddContactModal(false)}
      />
    </>
  )
}

export default ProfilePopup;