import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';

import { Button, Card } from 'react-bootstrap';

import StarRating from 'util/StarRating';
import Feedbacks from 'util/StarRating/Feedbacks';
import Overall from 'util/StarRating/Overall';
import FeedbackModal from 'util/StarRating/FeedbackModal';
import { sortByDate } from 'util/helpers';

import RatingService, { RatingType } from 'service/RatingService';
import EducatorService from 'service/EducatorService';
import UserProfileSearchService from 'service/UserProfileSearchService';
import AuthService from 'service/AuthService';

import style from './style.module.scss';

const EducatorFeedback = ({ isEducator, educatorId }) => {
  const [modalIsShow, setModalIsShow] = useState(false);
  const [allFeedbacksByService, setAllFeedbacksByService] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [servicesWithoutFb, setServicesWithoutFb] = useState([]); // list of services without feedback from current user

  const getFeedbacks = useCallback(async () => {
    try {
      const servicesResp = await EducatorService.getServices(educatorId);
      const services = servicesResp.educatorService;

      // get all feedbacks and store into array of objects with service name key
      const promises = services.map(async (service) => {
        const feedbacksByService = await RatingService.getRatingByItemId(
          RatingType.educator_service,
          service.id,
        );
        return { [service.name]: feedbacksByService };
      });
      const feedbacks = await Promise.all(promises);
      setAllFeedbacksByService(feedbacks);

      // generate services list without feedback
      let uncommentServices = [...services];
      const uid = AuthService.getUID();
      if (feedbacks?.length) {
        feedbacks.forEach((fb) => {
          const serviceName = Object.keys(fb)[0];
          if (fb[serviceName].find((x) => x.reviewed_by === uid)) {
            uncommentServices = uncommentServices.filter(
              (sr) => sr.name !== serviceName,
            );
          }
        });
      }
      setServicesWithoutFb(uncommentServices);

      // set all feedbacks to one dimension array
      let allFeedB = feedbacks.map((fb) => fb[Object.keys(fb)[0]]);
      allFeedB = allFeedB.reduce((a, b) => a.concat(b), []);

      // get names from user id
      const feedbacksWithNames = await getNameFromId(allFeedB);
      const sortedFeedbacks = sortByDate(feedbacksWithNames.filter(Boolean));
      const withServiceNames = sortedFeedbacks.map((fb) => {
        const serviceName = services.find((sr) => sr.id === fb.review_item)
          ?.name;
        return { ...fb, service_name: serviceName };
      });
      setAllFeedbacks(withServiceNames);
    } catch (e) {
      console.error(e);
    }
  }, [educatorId]);

  useEffect(() => {
    getFeedbacks();
  }, [educatorId, getFeedbacks]);

  const getNameFromId = (data) => {
    const withNames = data.map(async (x) => {
      if (!x.reviewed_by) return null;
      const name = await UserProfileSearchService.fetchPublicProfile(
        x.reviewed_by,
      );
      return {
        ...x,
        created_ts: x.reviewed_ts,
        name: { firstName: name?.firstName, lastName: name?.lastName },
      };
    });
    return Promise.all(withNames);
  };

  const addFeedback = async (data) => {
    if (data) {
      const resp = await RatingService.insertRating(
        RatingType.educator_service,
        data,
      );
      if (resp?.res) {
        getFeedbacks();
      }
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
    const resp = await RatingService.updateRatingLikeInfo(id, 1, 0);
    if (resp.res) {
      getFeedbacks();
    }
  };

  const handleDislike = async (id) => {
    const resp = await RatingService.updateRatingLikeInfo(id, 0, 1);
    if (resp.res) {
      getFeedbacks();
    }
  };
  const isEnabledAddFb = servicesWithoutFb.length > 0;
  return (
    <Card className={style.container}>
      <div className={style.leftColumn}>
        <Overall title="Student overall feedback" feedbacks={allFeedbacks} />
        <div className={style.section}>
          <h3>By service</h3>
          {allFeedbacksByService?.map((fb, key) => {
            const serviceName = Object.keys(fb)[0];
            let serviceOverallRating = 0;
            if (Array.isArray(fb[serviceName])) {
              const allRatings = fb[serviceName]?.reduce(
                (a, b) => a + b.rating,
                0,
              );
              serviceOverallRating = allRatings / fb[serviceName].length;
              if (isNaN(serviceOverallRating)) {
                serviceOverallRating = 0;
              }
            }
            return (
              <div className={style.row} key={key}>
                <p className={style.serviceName}>{serviceName}</p>
                <div className={style.ratingWrap}>
                  <StarRating rating={serviceOverallRating} />
                </div>
                <p className={style.servicePoint}>
                  {serviceOverallRating.toFixed(1)}
                </p>
              </div>
            );
          })}
        </div>
        {!isEducator && (
          <div className={style.section}>
            <h3>Leave a feedback</h3>
            <p>Share your thoughts about Tyler with other students</p>
            <Button
              variant="primary"
              onClick={toggleFeedbackModal}
              className={cn({ disabled: !isEnabledAddFb })}
            >
              Write a feedback
            </Button>
          </div>
        )}
      </div>
      <div>
        <Feedbacks
          title="Feedbacks"
          feedbacks={allFeedbacks}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </div>
      <FeedbackModal
        title="How would you rate the service?"
        placeholder="Tell us about your personal experience with this educator"
        show={modalIsShow}
        services={servicesWithoutFb}
        handleClose={toggleFeedbackModal}
        save={addFeedback}
      />
    </Card>
  );
};

export default React.memo(EducatorFeedback);
