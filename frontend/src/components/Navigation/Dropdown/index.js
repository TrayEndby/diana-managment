import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

import SignOutButton from 'components/SignOut';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';
import messageService from 'service/MessageService';
import socketService from 'service/SocketService';
import Notification from 'util/Notification';
import useErrorHandler from 'util/hooks/useErrorHandler';

import UserIcon from '../UserIcon';
import styles from '../style.module.scss';
import '../style.scss';

const propTypes = {
  authedAs: PropTypes.object.isRequired,
  notVerified: PropTypes.bool.isRequired,
};

const NavigationBarDropdown = withRouter(
  ({ authedAs, history, notVerified }) => {
    const [image, setImage] = useState(null);
    const [notificationCount, setCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useErrorHandler();

    const hideRedCircle = () => {
      setCount(0);
    };

    const isParent = authedAs.userType === PROFILE_TYPE.Parent;
    const isEducator = authedAs.userType === PROFILE_TYPE.Educator;

    useEffect(() => {
      setImage(authedAs.avatar);
    }, [authedAs]);

    useEffect(() => {
      const fetchMessages = () => {
        messageService
          .listNotification()
          .then(([sortedByDate, unreadMsgCount]) => {
            setCount(unreadMsgCount);
            setMessages(sortedByDate);
          })
          .catch(setError);
      };

      socketService.addNotificationEvenListener(() => {
        setCount((n) => n + 1);
      });
      fetchMessages();
    }, [setError]);

    const routeCondition = () => {
      if (authedAs.userType === PROFILE_TYPE.Educator) {
        if (authedAs.hasProfile) {
          return ROUTES.EDUCATOR_DETAILS;
        } else {
          return ROUTES.EDUCATOR_PROFILE;
        }
      }
      if (authedAs.userType === PROFILE_TYPE.Parent) {
        if (authedAs.hasProfile) {
          return ROUTES.PARENT_PROFILE;
        }
      }
      return ROUTES.MY_PROFILE;
    };

    return (
      <div className={styles.dropdownContainer}>
        <NavDropdown
          id="userSetting-dropdown"
          alignRight
          onClick={hideRedCircle}
          title={
            <>
              {notificationCount > 0 && (
                <span className={styles.notificationCount}>
                  {notificationCount}
                </span>
              )}
              <UserIcon image={image} />
            </>
          }
        >
          {!notVerified && <Notification messages={messages} error={error} />}
          <div className={styles.header}>Account</div>
          {authedAs.hasProfile === false ? (
            <NavDropdown.Item disabled>My Profile</NavDropdown.Item>
          ) : (
            <NavDropdown.Item onClick={() => history.push(routeCondition())}>
              My profile
            </NavDropdown.Item>
          )}
          {isParent ? (
            <>
              <NavDropdown.Item
                onClick={() => history.push(ROUTES.SUBSCRIPTION)}
              >
                My subscription
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => history.push(ROUTES.MY_CONTACT)}>
                My contacts
              </NavDropdown.Item>
            </>
          ) : (
            <>
              <NavDropdown.Item onClick={() => history.push(ROUTES.MY_CONTACT)}>
                My contacts
              </NavDropdown.Item>
              {isEducator && (
                <NavDropdown.Item onClick={() => history.push(ROUTES.CALENDAR)}>
                  My calendar
                </NavDropdown.Item>
              )}
            </>
          )}
          <NavDropdown.Item href={ROUTES.LANDING}>
            <SignOutButton />
          </NavDropdown.Item>
        </NavDropdown>
      </div>
    );
  },
);

NavigationBarDropdown.propTypes = propTypes;

export default NavigationBarDropdown;
