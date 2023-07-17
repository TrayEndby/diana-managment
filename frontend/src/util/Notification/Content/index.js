import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import Detail from '../Detail';

import { isCalendarNotification } from '../util';
import { utcToLocal } from '../../helpers';

import { Type } from 'constants/messages';
import * as ROUTES from 'constants/routes';
import style from './style.module.scss';

const linkFromStr = function (str) {
  if (!str) return;
  const posStart = str.search('<a href');
  const posEnd = str.search('</a>') + 4;
  const anchorStr = str.substring(posStart, posEnd);
  return anchorStr;
};

const getNetworkURL = (id) => `${ROUTES.CONVERSATIONS}?selectedId=${id}`;

const propTypes = {
  messages: PropTypes.array.isRequired,
};

const Content = ({ messages }) => {
  // messages = messages.filter(msg=>msg.type != Type.System);
  return (
    <div className={style.content}>
      {messages.length === 0 && <div className="text-center">No messages</div>}
      {messages.map((message) => (
        <NotificationRow key={message.id} message={message} />
      ))}
    </div>
  );
};

const NotificationRow = ({ message }) => {
  const [showDetail, setShowDetail] = useState(false);
  const {
    id,
    content,
    created_ts,
    type,
    source_user_id,
    source_user_name,
    target_user_name,
    target_user_id,
    target_group_name,
    target_group_id,
  } = message;

  const hasDetail = type !== Type.AddToChannel && type !== Type.CreateChannel && type !== Type.JoinChannel;
  return (
    <section key={id} className="my-1">
      <div className="d-flex flex-row align-items-top">
        <p className={style.rowBlock}>
          <SourceUser userId={source_user_id} userName={source_user_name} type={type} content={content} />
          <Summary
            type={type}
            content={content}
            sourceUserName={source_user_name}
            sourceUserId={source_user_id}
            targetUserName={target_user_name}
            targetUserId={target_user_id}
            targetGroupName={target_group_name}
            targetGroupId={target_group_id}
          />
        </p>
        {hasDetail && <span className="ml-auto App-text-clickable" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? <ChevronUp color="#393c46" size={20} /> : <ChevronDown color="#393c46" size={20} />}
        </span>}
      </div>
      {hasDetail && showDetail && <Detail userId={source_user_id} content={content} />}
      <div className={style.subText}>{utcToLocal(created_ts)}</div>
    </section>
  );
};

const SourceUser = ({ userId, userName, type, content }) => {
  const messageURL = ROUTES.PUBLIC_PROFILE;

  const history = useHistory();
  let clickable = !!userName;

  if (isCalendarNotification(userId)) {
    clickable = false;
    userName = '';
  } else if (type === Type.AddToChannel) {
    clickable = false;
    userName = content.name;
  }

  return (
    <span
      className={cn('App-textOverflow', { 'App-text-clickable': clickable }, style.nameBlock)}
      title={userName}
      onClick={
        clickable
          ? () => {
              history.push(messageURL, { id: userId });
            }
          : null
      }
    >
      {userName || 'You'}
    </span>
  );
};

const Summary = ({ type, content, targetUserName, targetUserId, sourceUserId, targetGroupName, targetGroupId }) => {
  const messageURL = ROUTES.PUBLIC_PROFILE;
  if (!type) {
    type = content.type;
  }
  let summary = null;
  if (type === Type.JoinProject) {
    if (targetUserName) {
      summary = (
        <>
          wanted to join{' '}
          <Link to={{ pathname: messageURL, state: { id: targetUserId } }} className="App-text-clickable">
            {targetUserName}'s
          </Link>{' '}
          <Link to={content.path} className="App-text-clickable">
            project
          </Link>
        </>
      );
    } else {
      summary = (
        <>
          Wanted to join your{' '}
          <Link to={content.path} className="App-text-clickable">
            project
          </Link>
        </>
      );
    }
  } else if (type === Type.SentMessage) {
    if (sourceUserId) {
      summary = (
        <>
          sent you a{' '}
          <Link
            to={{ pathname: messageURL, state: { id: sourceUserId, showMessages: true } }}
            className="App-text-clickable"
          >
            message
          </Link>
        </>
      );
    } else if (targetGroupName) {
      summary = (
        <>
          got a message from channel {' '}
          <Link to={getNetworkURL(targetGroupId)} className="App-text-clickable">
            {targetGroupName}
          </Link>
        </>
      );
    } else {
      summary = (
        <>
          sent a{' '}
          <Link
            to={{ pathname: messageURL, state: { id: targetUserId, showMessages: true } }}
            className="App-text-clickable"
          >
            message
          </Link>{' '}
          to {targetUserName}
        </>
      );
    }
  } else if (type === Type.ShareNote) {
    if (sourceUserId) {
      summary = (
        <>
          shared with you <span dangerouslySetInnerHTML={{ __html: linkFromStr(content.html) }}></span>
        </>
      );
    } else {
      summary = (
        <>
          shared note with{' '}
          <Link
            to={{ pathname: messageURL, state: { id: targetUserId, showMessages: true } }}
            className="App-text-clickable"
          >
            {targetUserName}
          </Link>
        </>
      );
    }
  } else if (type === Type.JoinChannel) {
    summary = (
      <>
        joined channel {' '}
        <Link to={getNetworkURL(targetGroupId)} className="App-text-clickable">
          {targetGroupName}
        </Link>
      </>
    );
  } else if (type === Type.AddToChannel) {
    summary = (
      <>
        was added to channel {' '}
        <Link to={getNetworkURL(targetGroupId)} className="App-text-clickable">
          {targetGroupName}
        </Link>
      </>
    );
  } else if (type === Type.CreateChannel) {
    summary = (
      <>
        created channel {' '}
        <Link to={getNetworkURL(targetGroupId)} className="App-text-clickable">
          {targetGroupName}
        </Link>
      </>
    );
  }

  if (isCalendarNotification(sourceUserId)) {
    // special case
    summary = <Link to={{ pathname: ROUTES.CALENDAR }}>have new calendar notification</Link>;
  }

  if (!summary) {
    if (targetGroupName) {
      summary = (
        <>
          had a message from channel {' '}
          <Link to={`${ROUTES.CONVERSATIONS}?selectedId=${targetGroupId}`} className="App-text-clickable">
            {targetGroupName}
          </Link>
        </>
      );
    } else {
      summary = 'had a notification';
    }
  }

  return <span className="ml-1 mr-1">{summary}</span>;
};

Content.propTypes = propTypes;

export default React.memo(Content);
