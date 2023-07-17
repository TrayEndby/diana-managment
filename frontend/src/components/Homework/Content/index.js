import React from 'react';
import PropTypes from 'prop-types';

import List from '../List';
import ErrorDialog from 'util/ErrorDialog';

import styles from './style.module.scss';

const propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  homeworks: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

const HomeworkContent = ({ error, loading, homeworks, onAction }) => {
  return (
    <div className={styles.container}>
      <ErrorDialog error={error} />
      {loading && <div className={styles.hint}>Loading...</div>}
      {!loading && <List items={homeworks} onAction={onAction} />}
    </div>
  );
};

HomeworkContent.propTypes = propTypes;

export default HomeworkContent;
