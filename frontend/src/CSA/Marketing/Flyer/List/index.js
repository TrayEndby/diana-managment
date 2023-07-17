import React from 'react';
import PropTypes from 'prop-types';

import FlyerCard from '../Card';
import withInfiniteList from 'util/HOC/withInfiniteList';

const propTypes = {
  flyers: PropTypes.array,
};

const List = withInfiniteList(({ item }) => <FlyerCard flyer={item} />);

const FlyerList = ({ flyers }) => {
  return (
    <List
      className='App-grid-list'
      items={flyers}
    />
  )
};

FlyerList.propTypes = propTypes;

export default FlyerList;
