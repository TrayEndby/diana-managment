import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import Feedbacks from 'util/StarRating/Feedbacks';
import Overall from 'util/StarRating/Overall';
import FeedbackModal from 'util/StarRating/FeedbackModal';
import Picture from 'util/Picture';
import AddressMap from 'util/AddressMap';
import { parseSearchParams } from 'util/helpers';
import ECAService from 'service/ECAService';
import RatingService, { RatingType } from 'service/RatingService';
import AuthService from 'service/AuthService';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import style from './style.module.scss';
import FileUploadService from 'service/FileUploadService';

const Details = ({ location: { search }, history }) => {
  const [name, setName] = useState('Loading...');
  /** @type ["NOT_SAVED" | "SAVING" | "SAVED" | "REMOVING", function] */
  const [stateOfSaving, setStateOfSaving] = useState('NOT_SAVED');
  const [url, setUrl] = useState('');
  const [picture_url, setPictureUrl] = useState(null);
  const [picture_id, setPictureId] = useState(null);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('Loading...');
  const [location, setLocation] = useState('Loading...');
  const [allFeedbacks, setAllFeedbacks] = React.useState([]);
  const [modalIsShow, setModalIsShow] = useState(false);
  const [isEnabledAddFb, setIsEnabledAddFb] = useState(true);
  const queries = parseSearchParams(search); // Remove leaded `?`
  const [error, setError] = useErrorHandler();
  const { programId } = queries;

  const [tagsArray, setTagsArray] = useState([]);

  useEffect(() => {
    if (isNaN(programId)) {
      history.goBack();
      return;
    }

    ECAService.getProgramDetails(programId).then((program) => {
      if (!program) {
        history.goBack();
      }
      setName(program.title);
      setUrl(program.url);
      setDescription(program.description);
      setLocation(program.source || '');
      setPictureUrl(program.picture_url);
      setPictureId(program.picture_id);
      program.tags ? setTagsArray(program.tags.split(';')) : setTagsArray(['No tags...']);
    });

    ECAService.getSavedPrograms().then(({ savedPrograms }) => {
      if (savedPrograms.find((p) => p.id === programId)) {
        setStateOfSaving('SAVED');
      } else {
        setStateOfSaving('NOT_SAVED');
      }
    });

    getFeedbacks(programId);
  }, [programId, history]);

  useEffect(() => {
    FileUploadService.downloadById(picture_id).then((res) => {
      setPicture(res);
    });
  }, [picture_id]);

  const toggleSavedState = () => {
    if (stateOfSaving === 'NOT_SAVED') {
      setStateOfSaving('SAVING');
      ECAService.addProgramToSaved(programId, name)
        .then(() => {
          setStateOfSaving('SAVED');
        })
        .catch(() => {
          setStateOfSaving('NOT_SAVED');
        });
    } else {
      setStateOfSaving('REMOVING');
      ECAService.removeProgramFromSaved(programId)
        .then(() => {
          setStateOfSaving('NOT_SAVED');
        })
        .catch(() => {
          setStateOfSaving('SAVED');
        });
    }
  };

  const getFeedbacks = async (programId) => {
    const fb = await RatingService.getRatingByItemId(3, programId);
    setAllFeedbacks(fb);
    const hasMyFb = fb.find((x) => x.reviewed_by === AuthService.getUID());
    setIsEnabledAddFb(!hasMyFb);
  };

  const handleLike = async (id) => {
    const resp = await RatingService.updateRatingLikeInfo(id, 1, 0);
    if (resp.res) {
      getFeedbacks(programId);
    }
  };

  const handleDislike = async (id) => {
    const resp = await RatingService.updateRatingLikeInfo(id, 0, 1);
    if (resp.res) {
      getFeedbacks(programId);
    }
  };

  const addFeedback = async (data) => {
    if (data) {
      try {
        const resp = await RatingService.insertRating(
          RatingType.eca_program,
          data,
        );

        if (resp?.res) {
          getFeedbacks(programId);
        }
      } catch (e) {
        setError(e);
      }
    }
  };

  const toggleFeedbackModal = () => {
    setModalIsShow((prev) => !prev);
  };

  return (
    <Container fluid className={style.wholeContainer}>
      <Button
        variant="primary"
        onClick={() => history.goBack()}
        className={style.exploreBtn}
      >
        Back to explore
      </Button>
      <Card className={style.mainContainer}>
        <Card.Header className={style.header}>
          <h4>Overview</h4>
        </Card.Header>
        {picture_url && (
          <Picture
            id={picture_url}
            className={style.logo}
            customAlt={
              <div className={cn(style.logo, 'text-center')}>
                No Image
              </div>
            }
          />
        )}
        {picture_id && (
          <Image src={picture} className={style.logo} alt="No Image" />
        )}
        <section className={style.shortDescription}>
          <Card.Title>{name}</Card.Title>
          {description && <Card.Text>Overview: {description}</Card.Text>}
          <Row className={style.actionBar}>

            {tagsArray.map((val) => (
              <Card.Text className={style.tag}>{val}</Card.Text>  
            ))}

            <Button className="ml-auto" onClick={toggleSavedState}>
              {stateOfSaving === 'NOT_SAVED' && 'Add to Saved'}
              {stateOfSaving === 'SAVING' && 'Saving...'}
              {stateOfSaving === 'SAVED' && 'Remove from Saved'}
              {stateOfSaving === 'REMOVING' && 'Removing...'}
            </Button>
          </Row>
        </section>
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header className={style.header}>
          <h4>Details</h4>
        </Card.Header>
        <Card.Body>
          <h3>Organization details</h3>
          <Card.Text>
            Link to the website:{' '}
            <Card.Link rel="nofollow noopener" target="_blank" href={url}>
              {url}
            </Card.Link>
          </Card.Text>
          {location && (
            <>
              <AddressMap location={location} />
            </>
          )}
          {description && <Card.Text>Details: {description}</Card.Text>}
        </Card.Body>
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header className={style.header}>
          <h4>Ratings & Comments</h4>
          <Button onClick={() => { setError(null); setModalIsShow(true) }} className={cn({ 'disabled': !isEnabledAddFb })}>Write a comment</Button>
        </Card.Header>
        <ErrorDialog error={error} />
        <Card.Body className={style.commentsContainer}>
          <Overall title="Students Ratings" feedbacks={allFeedbacks} />
          <Feedbacks
            title="Comments"
            feedbacks={allFeedbacks}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </Card.Body>
      </Card>
      <FeedbackModal
        title="How would you rate this program?"
        placeholder="Tell us about your personal experience with this program"
        review_item={programId}
        show={modalIsShow}
        handleClose={toggleFeedbackModal}
        save={addFeedback}
      />
    </Container>
  );
};

export default withRouter(React.memo(Details));
