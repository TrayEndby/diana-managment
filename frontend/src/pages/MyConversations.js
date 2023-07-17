import React from 'react';

import Conversations from 'components/Conversations';

const propTypes = {};

const MyConversationsPage = () => {
  return (
    <div className="App-body">
      <Conversations wholePage />
    </div>
  )
};

MyConversationsPage.propTypes = propTypes;

export default MyConversationsPage;