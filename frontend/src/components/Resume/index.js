import React, { useState } from 'react';

import ShowModal from './Modal';
import Markdown from 'components/Markdown';

import useErrorHandler from 'util/hooks/useErrorHandler';
import ErrorDialog from 'util/ErrorDialog';
import SearchBar from 'util/SearchBar';

import assessService from 'service/AssessService';

import styles from './style.module.scss';

const propTypes = {};

const ResumeSection = () => {
  const [keyword, setKeyword] = useState('');
  const [resumeList, setResumeList] = useState([]);
  const [resumeToShow, setResultToShow] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();

  const search = React.useCallback(
    async (keyword = '') => {
      keyword = keyword.trim();
      if (!keyword) {
        keyword = 'Harvard University'; // the default search
      }
      setLoading(true);
      setError(null);

      try {
        const list = await assessService.searchPost(keyword);
        setResumeList(list);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    },
    [setError],
  );

  React.useEffect(() => {
    search(keyword);
  }, [keyword, search]);

  return (
    <div className={styles.container}>
      <h5 className={styles.header}>Sample Resumes</h5>
      <SearchBar
        className={styles.searchBar}
        onSubmit={setKeyword}
        title="Search"
      />
      <div className={styles.content}>
        {error && <ErrorDialog error={error} />}
        {isLoading && <div className={styles.hint}>Loading...</div>}
        {!isLoading && resumeList.length === 0 && (
          <div className={styles.hint}>No resumes found</div>
        )}
        {!isLoading && resumeList.map((resume, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => {
              setResultToShow(resume);
            }}
          >
            <div className={styles.text}>
              <Markdown source={resume.text} />
            </div>
          </div>
        ))}
      </div>
      {resumeToShow && (
        <ShowModal
          headerText={resumeToShow.title}
          markdownText={resumeToShow.text}
          onClose={() => setResultToShow(null)}
        />
      )}
    </div>
  );
};

ResumeSection.propTypes = propTypes;

export default ResumeSection;
