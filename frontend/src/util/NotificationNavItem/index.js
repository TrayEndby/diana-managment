import React, { useState, useEffect } from 'react';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Notification from 'util/Notification';

import useErrorHandler from 'util/hooks/useErrorHandler';

import messageService from 'service/MessageService';
import socketService from 'service/SocketService';

import PropTypes from 'prop-types';

import astronaut from 'assets/svg/Astronaut.svg';
import style from './style.module.scss';

const propTypes = {
  isCSA: PropTypes.bool
};

const NotificationDropdown = React.memo((props) => {
	const [notificationCount, setCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useErrorHandler();

	const hideRedCircle = () => {
    setCount(0);
  };

	useEffect(() => {
    const fetchMessages = () => {
      messageService.listNotification()
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

  return (
    <NavDropdown
      id="notification-center-dropdown"
      alignRight
      onClick={hideRedCircle}
      title={
        <>
          {notificationCount > 0 && <span className={style.notificationCount}>{notificationCount}</span>}
          <img style={{ width: '43px' }} src={astronaut} alt="Help" />
        </>
      }
    >
      <Notification messages={messages} error={error} isCSA={props.isCSA} />
    </NavDropdown>
  );
});

NotificationDropdown.propTypes = propTypes;

export default NotificationDropdown;
