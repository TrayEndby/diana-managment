import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import EssayCard from '../Card';
import withInfiniteList from '../../../util/HOC/withInfiniteList';

const propTypes = {
  view: PropTypes.string,
  essays: PropTypes.array,
  size: PropTypes.string,
  selectedEssay: PropTypes.object,
  onClick: PropTypes.func,
};

const EssayListCard = ({ view, size, item, selectedItem, onClick, onDelete }) => (
  <EssayCard view={view} size={size} essay={item} selected={item === selectedItem} onClick={onClick} onDelete={onDelete} />
);

const List = withInfiniteList(EssayListCard);

const EssayList = ({ view, essays, size, selectedEssay, onClick, onDelete }) => {
  const listClass = classNames({
    'w-100': view === 'list',
    'App-grid-list': view === 'grid' && !selectedEssay
  });
  return (
    <List
      view={view}
      items={essays}
      selectedItem={selectedEssay}
      size={size}
      onClickItem={onClick}
      onDelete={onDelete}
      className={listClass}
    />
  );
};

EssayList.propTypes = propTypes;

export default EssayList;
