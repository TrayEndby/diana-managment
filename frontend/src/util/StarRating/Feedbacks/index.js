import React, { useState, useEffect } from 'react';
import moment from 'moment';
import FormControl from 'react-bootstrap/FormControl';

import StarRating from '../index';
import UserIcon from 'components/Navigation/UserIcon';
import { Like, Dislike } from 'util/Icon';

import styles from './style.module.scss';

const defaultState = {
  fiveStars: [],
  fourStars: [],
  threeStars: [],
  twoStars: [],
  oneStars: [],
};

const Feedbacks = ({ title, feedbacks, onLike, onDislike }) => {
  const [fbToRender, setFbToRender] = useState([]);
  const [data, setData] = useState(defaultState);

  useEffect(() => {
    setFbToRender(feedbacks);
    let fiveStars = [], fourStars = [], threeStars = [], twoStars = [], oneStars = [];
    feedbacks.forEach(feedback => {
      if (feedback.rating === 5) fiveStars.push(feedback);
      if (feedback.rating === 4) fourStars.push(feedback);
      if (feedback.rating === 3) threeStars.push(feedback);
      if (feedback.rating === 2) twoStars.push(feedback);
      if (feedback.rating === 1) oneStars.push(feedback);
    })
    setData({ fiveStars, fourStars, threeStars, twoStars, oneStars });
  }, [feedbacks])

  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "all") {
      setFbToRender(feedbacks)
    }
    if (value === "fiveStars") {
      setFbToRender(data.fiveStars)
    }
    if (value === "fourStars") {
      setFbToRender(data.fourStars)
    }
    if (value === "threeStars") {
      setFbToRender(data.threeStars)
    }
    if (value === "twoStars") {
      setFbToRender(data.twoStars)
    }
    if (value === "oneStars") {
      setFbToRender(data.oneStars)
    }
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3>{title}</h3>
        {feedbacks.length > 0 && (
          <FormControl as="select" onChange={handleChange}>
            <option value="all">All ratings</option>
            <option value="fiveStars">5 stars</option>
            <option value="fourStars">4 stars</option>
            <option value="threeStars">3 stars</option>
            <option value="twoStars">2 stars</option>
            <option value="oneStars">1 star</option>
          </FormControl>
        )}
      </header>
      <div className={styles.feedbacksContainer}>
        {fbToRender?.map((feedback, key) => {
          const time = moment
            .utc(feedback?.reviewed_ts)
            .local()
            .format('YYYY-MM-DD hh:mm:ss A');
          return (
            <div className={styles.feedback} key={key}>
              <div className={styles.feedbackHeader}>
                <UserIcon />
                <div className={styles.nameRatingContainer}>
                  <p className={styles.name}>
                    {feedback?.reviewed_by_first_name}{' '}
                    {feedback?.reviewed_by_last_name}
                  </p>
                  <div className={styles.ratingDateContainer}>
                    <div className={styles.ratingWrap}>
                      <StarRating rating={feedback?.rating || 0} />
                    </div>
                    <span className={styles.date}>{time}</span>
                  </div>
                </div>
              </div>
              <div className={styles.feedbackServiceName}>{feedback?.service_name}</div>
              <div className={styles.feedbackText}>{feedback?.comments || feedback?.title}</div>
              <div className={styles.likeDislikeContainer}>
                <div className={styles.likeDislike} onClick={() => onLike(feedback.id)}>
                  <Like />
                  <span className={styles.count}>{feedback?.liked || 0}</span>
                </div>
                <div
                  className={styles.likeDislike}
                  onClick={() => onDislike(feedback.id)}
                >
                  <Dislike />
                  <span className={styles.count}>
                    {feedback?.disliked || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Feedbacks;
