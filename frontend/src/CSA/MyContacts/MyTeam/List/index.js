import React from 'react';
import PropTypes from 'prop-types';

import TeamMemberCard from '../TeamMemberCard';
import withInfiniteList from 'util/HOC/withInfiniteList';

const propTypes = {
  courses: PropTypes.array,
  view: PropTypes.string,
};

const TeamMemberCardList = ({ item }) => (
  <TeamMemberCard content={item} />
);

const TeamList = withInfiniteList(TeamMemberCardList);

const TeamMembersList = ({ teamMembers }) => {
  return (
    <div style={{ margin: '-16px' }}>
      <TeamList className="App-grid-list" items={teamMembers} />
    </div>
  );
};

TeamMembersList.propTypes = propTypes;

export default TeamMembersList;
