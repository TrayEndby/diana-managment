import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import EssayList from '../List';
import SaveEssayModal from '../Saved/AddModal';
import WordCloudSection from '../WordCloud';
import DetailRow from './Row';
import DetailText from './Content';
import Feedbacks from '../Feedback';

import { normalizeWordCloud, getPublicEssayURL } from '../util';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../util/ErrorDialog';
import Loading from '../../../util/Loading';
import essayService from '../../../service/EssayService';

import style from './style.module.scss';

const propTypes = {
  myEssaysList: PropTypes.array.isRequired,
  saved: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
};

// XXX TODO: check essay if already in a list when save
const EssayDetail = ({ myEssaysList, saved, match, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [essay, setEssay] = useState({});
  const [similarEssays, setSimilarEssays] = useState([]);
  const [essayToSave, setEssayToSave] = useState();
  const [wordCloud, setWordCloud] = useState([]);
  const [error, setError] = useErrorHandler();
  const history = useHistory();

  const id = match.params.id;
  const { title, author, college, analysis, prompt, text, theme, year, word_count } = essay;
  const handleSaveEssay = () => {
    setEssayToSave(null);
    onSave();
  };

  const fetchEssay = useCallback(
    async (id) => {
      try {
        const essays = await essayService.getEssays([id]);
        setEssay(essays[0]);
      } catch (e) {
        setError(e);
      }
    },
    [setError],
  );

  const fetchEssayInfo = useCallback(async (id) => {
    try {
      const info = await essayService.getInfo(id);
      const { similar_essay, wordcloud } = info;
      setWordCloud(normalizeWordCloud(wordcloud));
      const similar_essay_ids = similar_essay.map(({ essay_id }) => essay_id);
      const similar_essays = await essayService.getEssays(similar_essay_ids);
      setSimilarEssays(similar_essays);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const promise1 = fetchEssay(id);
    const promise2 = fetchEssayInfo(id);

    Promise.all([promise1, promise2]).finally(() => {
      setLoading(false);
    });
  }, [id, fetchEssay, fetchEssayInfo]);

  return (
    <>
      <ErrorDialog error={error} />
      <div className="d-flex flex-row h-100">
        <Loading show={loading} variant="white" className="w-100" />
        {!loading && (
          <>
            <div className="col h-100 py-2">
              <Card className="rounded-0 h-100">
                <Card.Header className="row m-0 align-items-center">
                  <h5 className="text-center col-lg">{title}</h5>
                  {!saved && (
                    <Button size="sm" className="mx-1 float-right" onClick={() => setEssayToSave(essay)}>
                      Save
                    </Button>
                  )}
                </Card.Header>
                <Card.Body className="overflow-auto">
                  <div className={style.top}>
                    <div className={style.left}>
                      <DetailRow inline title="Author" text={author} />
                      <DetailRow inline title="Theme" text={theme} />
                      <DetailRow inline title="College" text={college} />
                      <DetailRow inline title="Word Count" text={word_count ? word_count.toLocaleString() : ''} />
                      <DetailRow inline title="Year Published" text={year} />
                      <DetailRow inline title="Prompt" text={prompt} />
                      <DetailRow title="Analysis" text={analysis} />
                    </div>
                    <div className={style.right}>
                      <WordCloudSection data={wordCloud} width={250} height={150} />
                    </div>
                  </div>
                  <DetailText className={style.content}>{text}</DetailText>
                  <Feedbacks id={id} />
                </Card.Body>
                <SaveEssayModal
                  essay={essayToSave}
                  myEssaysList={myEssaysList}
                  onSubmit={handleSaveEssay}
                  onClose={() => setEssayToSave(null)}
                />
              </Card>
            </div>
            {similarEssays.length > 0 && (
              <div className={classNames('col-sm-3 py-2', style.recommend)}>
                <h5>Similar Essays</h5>
                <EssayList
                  size="sm"
                  essays={similarEssays}
                  view="list"
                  onClick={(selectedEssay) => {
                    history.push(getPublicEssayURL(selectedEssay.id));
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

EssayDetail.propTypes = propTypes;

export default React.memo(withRouter(EssayDetail));
