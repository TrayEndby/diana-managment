import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { utcToLocal } from '../../helpers';
import { Type } from 'constants/messages';
import * as CSA_ROUTES from 'constants/CSA/routes';

import Logo from 'assets/logo192.png';
import style from './style.module.scss';

const propTypes = {
  messages: PropTypes.array.isRequired,
};

const CSAContent = ({ messages }) => {
  messages = messages.filter((msg) => msg.type === Type.System && msg.content.type.indexOf('csa') !== -1);
  return (
    <div className={style.content}>
      {messages.length === 0 && <div className="text-center">No messages</div>}
      {messages.map((message) => (
        <CSANotificationRow key={message.id} message={message} />
      ))}
    </div>
  );
};

const CSANotificationRow = ({ message }) => {
  const { id, content, created_ts } = message;

  return (
    <section key={id} className="my-1" style={{ minHeight: '36px' }}>
      <div>
        <img src={Logo} className={style.iconDiv} alt={'LogoIcon'} />
      </div>
      <div>
        <div className="d-flex flex-row align-items-top">
          <div className={style.rowBlock}>
            <SourceText sourceText={content} />
          </div>
        </div>
      </div>
      <div className={style.subText}>{utcToLocal(created_ts)}</div>
    </section>
  );
};

const SourceText = ({ sourceText }) => {
  let messageURL = CSA_ROUTES.MY_CONTACTS_CUSTOMERS;
  const history = useHistory();

  const GetTextFromContent = (content) => {
    if (content == null) return <div></div>;
    let userName = '';
    if (content.user_name != null) {
      userName = content.user_name;

      if (content.type === 'csa-new-customer') {
        messageURL = CSA_ROUTES.MY_CONTACTS_CUSTOMERS;
        return (
          <div>
            <div className={style.textDiv}>{userName}</div> has joined as your customer
          </div>
        );
      } else if (content.type === 'csa-new-member') {
        messageURL = CSA_ROUTES.MY_CONTACTS_TEAM;
        return (
          <div>
            <div className={style.textDiv}>{userName}</div> has joined as your member
          </div>
        );
      } else if (content.type === 'csa-new-downline') {
        messageURL = CSA_ROUTES.PROFILE;
        return (
          <div className="App-textOverflow" style={{ width: '280px' }}>
            <div className={style.textDiv}>{userName}</div> has added to downline CSA
          </div>
        );
      }
    } else {
      return <div className="App-textOverflow" style={{ width: '280px' }}>{content.text}</div>;
    }
  };

  return (
    <div
      className={cn('App-textOverflow', 'App-text-clickable', style.nameBlock)}
      title={sourceText.user_name}
      onClick={() => {
        history.push(messageURL);
      }}
    >
      {GetTextFromContent(sourceText) || 'You'}
    </div>
  );
};

CSAContent.propTypes = propTypes;

export default React.memo(CSAContent);
