import React from 'react';
import PropTypes from 'prop-types';

import ArticleCard from '../ArticleCard';
import PodcastCard from '../PodcastCard';

import withInfiniteList from '../../../util/HOC/withInfiniteList';
import { Resource_Type } from '../../../service/ResourceService';

const propTypes = {
  type: PropTypes.number.isRequired,
  resources: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
  loadMore: PropTypes.func,
  onListenPodcast: PropTypes.func,
};

const Card = ({ type, ...rest }) => {
  switch (type) {
    case Resource_Type.Article:
      return <ArticleCard {...rest} />;
    case Resource_Type.Podcast:
      return <PodcastCard {...rest} />;
    default:
      return null;
  }
};

const List = withInfiniteList(Card);

const ResourceList = ({ type, resources, totalResults, loadMore, onListenPodcast }) => (
  <List
    className='App-grid-list'
    type={type}
    items={resources}
    totalResults={totalResults}
    loadMore={loadMore}
    onListenPodcast={onListenPodcast}
  />
);

ResourceList.propTypes = propTypes;

export default ResourceList;
