import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Section from '../Section';

import ListViewCard from '../../../../util/ListViewCard';

const propTypes = {
  articles: PropTypes.array.isRequired,
};

const ArticleRec = ({ articles }) => {
  const history = useHistory();
  if (!articles || !articles.length) {
    return null;
  }

  return (
    <Section title="Tips & Guidance">
      {articles.map(({ id, title, picture_id, searchUrl }) => {
        return <ListViewCard key={id} title={title} picture_id={picture_id} onClick={() => history.push(searchUrl)} />;
      })}
    </Section>
  );
};

ArticleRec.propTypes = propTypes;

export default ArticleRec;
