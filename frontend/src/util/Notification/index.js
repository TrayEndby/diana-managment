import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { STORAGE_READED_MSG_TIMESTAMP } from 'constants/storageKeys';
import Content from './Content';
import CSAContent from './CSAContent';
import NotificationModal from './Modal';
import styles from './style.module.scss';

const Notification = React.memo(({ messages, error, isCSA }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (messages[0]?.created_ts) {
      localStorage.setItem(
        STORAGE_READED_MSG_TIMESTAMP,
        messages[0].created_ts,
      );
    }
  }, [messages]);

  return (
    <div
      className={cn(styles.container, {
        nested: !isCSA,
      })}
    >
      <header className={styles.header}>
        <b>Notifications</b>
        {!isCSA && !error && (
          <span className="App-clickable" onClick={() => setShowModal(true)}>
            SEE ALL
          </span>
        )}
      </header>
      {error && (
        <div className="text-danger px-3 py-2">
          Cannot retrieve Notifications
        </div>
      )}
      {!error && !isCSA && <Content messages={messages.slice(0, 3)} />}
      {!error && isCSA && <CSAContent messages={messages} />}
      {showModal && (
        <NotificationModal
          messages={messages}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
});

export default Notification;
