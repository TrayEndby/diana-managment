import React from 'react';
import Conversations from 'components/Conversations';
import CSABodyContainer from '../../Container';

const MyConversation = () => {
  return (
    <CSABodyContainer title="My Conversation">
      <Conversations />
    </CSABodyContainer>
  );
};

export default React.memo(MyConversation);
