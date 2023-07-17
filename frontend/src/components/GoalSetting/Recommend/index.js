import React, { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';

import CollegeRec from './CollegeRec';
import CourseRec from './CourseRec';
import ArticleRec from './ArticleRec';

import ErrorDialog from '../../../util/ErrorDialog';
import generalSearchService, { CATEGORY } from '../../../service/GeneralSearchService';

import style from './style.module.scss';

const propTypes = {};

const Recommend = (cnt) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState();
  const [colleges, setColleges] = useState();
  const [articles, setArticles] = useState();

  useEffect(() => {
    const section = ['college', 'video', 'resource:article'];
    generalSearchService
      .searchWithNormalization(null, section, true)
      .then((res) => {
        setColleges(res[CATEGORY.COLLEGE]);
        setCourses(res[CATEGORY.VIDEO]);
        setArticles(res[CATEGORY.ARTICLE]);
      })
      .catch((e) => {
        console.error(e);
        setError('Server error, cannot get recommendation');
      })
      .finally(() => setLoading(false));
  }, [cnt, setError]);

  return (
    <Card className={style.recommend}>
      <Card.Header className="rounded-0">
        <h4 className="text-center col-lg App-text-white" style={{ fontWeight: 600 }}>
          Recommendations
        </h4>
      </Card.Header>
      <Card.Body className="overflow-auto p-1">
        {loading && <div className="text-white p-3">Loading...</div>}
        <ErrorDialog error={error} />
        {!loading && !error && (
          <>
            <CollegeRec colleges={colleges} />
            <ArticleRec articles={articles} />
            <CourseRec courses={courses} />
          </>
        )}
      </Card.Body>
    </Card>
  );
};

Recommend.propTypes = propTypes;

export default Recommend;
