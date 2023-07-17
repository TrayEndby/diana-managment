import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import Markdown from '../../Markdown';
import FrameCard from '../../../util/FrameCard';
import Picture from '../../../util/Picture';
import * as ROUTES from '../../../constants/routes';

const propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    picture_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    source: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  detail: PropTypes.bool,
};

const ArticleCard = ({ item, detail }) => {
  return detail ? <DetailView item={item} /> : <SummaryView item={item} />;
};

const SummaryView = ({ item }) => {
  const history = useHistory();
  const { id, title, source, picture_id } = item;

  return (
    <FrameCard
      img={
        <Picture
          id={picture_id}
          alt={title}
          style={{ objectFit: 'fill' }}
          customLoading={
            <div className="text-center" style={{ width: '100px', height: '100px' }}>
              Loading...
            </div>
          }
        />
      }
      onClick={() => {
        history.push(`${ROUTES.RESOURCES_ARTICLES_DETAIL}/${id}`);
      }}
    >
      <h6>{title}</h6>
      <p>Source: {source}</p>
    </FrameCard>
  );
};

const DetailView = ({ item }) => {
  const { title, source, description } = item;
  return (
    <Card className="rounded-0 border-0 my-2 py-2 px-3">
      <Card.Title>{title}</Card.Title>
      <Card.Text>Source: {source}</Card.Text>
      {description && <Markdown source={description} />}
    </Card>
  );
};

ArticleCard.propTypes = propTypes;

export default ArticleCard;
