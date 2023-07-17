import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MarkDown from 'components/Markdown';

import { isCalendarNotification } from '../util';

const propTypes = {
  userId: PropTypes.string.isRequired,
  content: PropTypes.object,
};

const Detail = ({ userId, content }) => {
  const { name, start_time, text } = content;
  if (isCalendarNotification(userId)) {
    return (
      <div>
        {name && <span>Event: {name}</span>}
        <br />
        {start_time && <span>Start time: {moment(start_time).local().calendar()}</span>}
      </div>
    );
  } else if (text) {
    return <div><MarkDown source={content.text} /></div>;
  } else {
    return <div>N/A</div>;
  }
};

Detail.propTypes = propTypes;

export default Detail;
