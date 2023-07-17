import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Feedbacks from 'util/StarRating/Feedbacks';
import Overall from 'util/StarRating/Overall';
import FeedbackModal from 'util/StarRating/FeedbackModal';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import ratingService, { RatingType } from 'service/RatingService';
import authService from 'service/AuthService';

import style from './style.module.scss';

const propTypes = {
  id: PropTypes.number.isRequired,
};

const EssayFeedbacks = ({ id }) => {
  const [modalIsShow, setModalIsShow] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useErrorHandler();

  const getFeedbacks = useCallback(async () => {
    try {
      const res = await ratingService.getRatingByItemId(RatingType.essay, id);
      setFeedbacks(res);
    } catch (e) {
      setError(e);
    }
  }, [id, setError]);

  useEffect(() => {
    getFeedbacks();
  }, [getFeedbacks]);

  const commented = feedbacks.some(
    ({ reviewed_by }) => reviewed_by === authService.getUID(),
  );

  const addFeedback = async (data) => {
    try {
      await ratingService.insertRating(RatingType.essay, {
        review_item: id,
        title: 'Essay comment',
        comments: data.feedback,
        rating: data.rating,
      });
      getFeedbacks();
    } catch (e) {
      console.error(e);
      setError('Add feedback failed, please retry');
    }
  };

  const toggleFeedbackModal = () => {
    if (modalIsShow) {
      setModalIsShow(false);
    } else {
      setModalIsShow(true);
    }
  };

  const handleLike = async (id) => {
    const resp = await ratingService.updateRatingLikeInfo(id, 1, 0);
    if (resp.res) {
      getFeedbacks();
    }
  };

  const handleDislike = async (id) => {
    const resp = await ratingService.updateRatingLikeInfo(id, 0, 1);
    if (resp.res) {
      getFeedbacks();
    }
  };
  return (
    <Card className={style.container}>
      <ErrorDialog error={error} />
      <Overall title="Overall rating" feedbacks={feedbacks} />
      {!commented && (
        <div className={style.section}>
          <h3>Leave a comment</h3>
          <Button variant="primary" onClick={toggleFeedbackModal}>
            Write a comment
          </Button>
        </div>
      )}
      <Feedbacks
        title="Comments"
        feedbacks={feedbacks}
        onLike={handleLike}
        onDislike={handleDislike}
      />
      <FeedbackModal
        show={modalIsShow}
        title="How would you rate this essay?"
        placeholder="Writ a comment for the essay"
        handleClose={toggleFeedbackModal}
        save={addFeedback}
      />
    </Card>
  );
};

EssayFeedbacks.propTypes = propTypes;

export default React.memo(EssayFeedbacks);
