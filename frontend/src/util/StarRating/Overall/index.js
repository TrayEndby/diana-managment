import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { ProgressBar } from 'react-bootstrap';
import StarRating from '../index';
import styles from './style.module.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  feedbacks: PropTypes.array.isRequired,
};

const Overall = ({ title, feedbacks }) => {
  const [fiveStars, setFiveStars] = useState(0);
  const [fourStars, setFourStars] = useState(0);
  const [threeStars, setThreeStars] = useState(0);
  const [twoStars, setTwoStars] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    const fbCount = feedbacks.length;
    if (fbCount !== 0) {
      let fiveCount = 0,
        fourCount = 0,
        threeCount = 0,
        twoCount = 0,
        oneCount = 0;
      feedbacks.forEach((feedback) => {
        if (feedback.rating === 5) fiveCount++;
        if (feedback.rating === 4) fourCount++;
        if (feedback.rating === 3) threeCount++;
        if (feedback.rating === 2) twoCount++;
        if (feedback.rating === 1) oneCount++;
      });
      setFiveStars((fiveCount / fbCount) * 100);
      setFourStars((fourCount / fbCount) * 100);
      setThreeStars((threeCount / fbCount) * 100);
      setTwoStars((twoCount / fbCount) * 100);
      setOneStar((oneCount / fbCount) * 100);
      setOverall(
        (fiveCount * 5 +
          fourCount * 4 +
          threeCount * 3 +
          twoCount * 2 +
          oneCount) /
          fbCount,
      );
    }
  }, [feedbacks]);

  return (
    <section className={cn(styles.section, styles.overall)}>
      <h3>{title}</h3>
      <div className={styles.overallRow}>
        <div className={styles.ratingWrap}>
          <StarRating rating={overall} />
        </div>
        <p className={styles.ratingNumber}>{overall.toFixed(1)} out of 5</p>
      </div>
      <p>{feedbacks.length} total ratings</p>
      <div className={styles.row}>
        <p className={styles.stars}>5 star</p>
        <ProgressBar now={fiveStars} className={styles.progress} />
        <p className={styles.progressNumber}>{fiveStars.toFixed(1)}%</p>
      </div>
      <div className={styles.row}>
        <p className={styles.stars}>4 star</p>
        <ProgressBar now={fourStars} className={styles.progress} />
        <p className={styles.progressNumber}>{fourStars.toFixed(1)}%</p>
      </div>
      <div className={styles.row}>
        <p className={styles.stars}>3 star</p>
        <ProgressBar now={threeStars} className={styles.progress} />
        <p className={styles.progressNumber}>{threeStars.toFixed(1)}%</p>
      </div>
      <div className={styles.row}>
        <p className={styles.stars}>2 star</p>
        <ProgressBar now={twoStars} className={styles.progress} />
        <p className={styles.progressNumber}>{twoStars.toFixed(1)}%</p>
      </div>
      <div className={styles.row}>
        <p className={styles.stars}>1 star</p>
        <ProgressBar now={oneStar} className={styles.progress} />
        <p className={styles.progressNumber}>{oneStar.toFixed(1)}%</p>
      </div>
    </section>
  );
};

Overall.propTypes = propTypes;

export default Overall;
