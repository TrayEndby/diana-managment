import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import ArticleCard from '../ArticleCard';
import PodcastCard from '../PodcastCard';

import useErrorHandler from '../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../util/ErrorDialog';
import resourceService, { Resource_Type } from '../../../service/ResourceService';
import * as ROUTES from '../../../constants/routes';

const propTypes = {
  type: PropTypes.number.isRequired,
  onListenPodcast: PropTypes.func,
};

const Detail = ({ type, match, onListenPodcast }) => {
  const [error, setError] = useErrorHandler();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  const id = match.params.id;
  useEffect(() => {
    resourceService
      .getDetail(type, id)
      .then(setItem)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [id, type, setError]);

  const isArticle = type === Resource_Type.Article;
  return (
    <div className="d-flex flex-column overflow-auto">
      <Link to={isArticle ? ROUTES.RESOURCES_ARTICLES : ROUTES.RESOURCES_PODCASTS}>
        {' '}
        <Button className="m-4">Back </Button>
      </Link>

      <ErrorDialog error={error} />
      <div className="bg-white mx-4 overflow-auto">
        {loading && <div className="text-center">Loading...</div>}
        {!loading && isArticle && <ArticleCard item={item} detail />}
        {!loading && !isArticle && <PodcastCard item={item} onListenPodcast={onListenPodcast} detail />}
      </div>
    </div>
  );
};

Detail.propTypes = propTypes;

export default withRouter(Detail);
