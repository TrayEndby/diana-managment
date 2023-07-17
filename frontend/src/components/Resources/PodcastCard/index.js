import React from 'react';
import  { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

import DefaultImage from '../../../assets/PodcastCard.png';

import Button from 'react-bootstrap/Button';
import { PlayFill } from 'react-bootstrap-icons';

import FrameCard from '../../../util/FrameCard';
import * as ROUTES from '../../../constants/routes';

import style from './style.module.scss';

const propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    source_ts: PropTypes.string,
    image_url: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  detail: PropTypes.bool,
  onListenPodcast: PropTypes.func.isRequired,
};

const PodcastCard = ({ item, detail, onListenPodcast }) => {
  const history = useHistory();
  const { id, title, image_url, source_ts, description } = item;
  return (
    <FrameCard
      className={classNames({
        [style.detail]: detail,
      })}
      onClick={detail ? null : () => {
        history.push(`${ROUTES.RESOURCES_PODCASTS_DETAIL}/${id}`);
      }}
      img={
        <>
          <img src={image_url || DefaultImage} alt={title} loading="lazy" />
          <Button className={style.button} onClick={(e) => {
            e.stopPropagation();
            onListenPodcast(item);
          }}>
            <PlayFill fill="#FFFFFF" />
            LISTEN
          </Button>
        </>
      }
    >
      <h6>{title}</h6>
      {source_ts && <p>{moment(source_ts).format('YYYY-MM-DD')}</p>}
      {detail && description && <p>{description}</p>}
    </FrameCard>
  );
};

PodcastCard.propTypes = propTypes;

export default PodcastCard;
