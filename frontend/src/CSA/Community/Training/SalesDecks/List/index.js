import React from 'react';
import PropTypes from 'prop-types';

import DeckCard from '../Card';
import withInfiniteList from 'util/HOC/withInfiniteList';

const propTypes = {
  videos: PropTypes.array,
};

const SalesDecksListCard = ({ item }) => <DeckCard deck={item} />;

const List = withInfiniteList(SalesDecksListCard);

const SalesDecksList = ({ decks }) => {
  return (
    <List
      className='App-grid-list'
      items={decks}
    />
  )
};

SalesDecksList.propTypes = propTypes;

export default SalesDecksList;
