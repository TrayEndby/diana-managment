import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ChevronLeft } from 'react-bootstrap-icons';

import resourceService, { Resource_Type } from 'service/ResourceService';
import useErrorHandler from 'util/hooks/useErrorHandler';

import listStyles from '../List/style.module.scss';
import styles from './style.module.scss';
import { useEffect } from 'react';

const propTypes = {
  id: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

const FAQDetail = React.memo(({ id, onBack }) => {
  const [FAQ, setFAQ] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();

  useEffect(() => {
    resourceService
      .getDetail(Resource_Type.FQA, id)
      .then((res) => {
        setFAQ(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [id, setError]);

  return (
    <div className={listStyles.section}>
      <div className={listStyles.header}>
        <ChevronLeft
          className={cn(styles.back, 'App-clickable')}
          onClick={onBack}
        />
        Help
      </div>
      <div className="divider"></div>
      <div className={listStyles.faqs}>
        <header
          className={cn(listStyles.highlight, {
            'text-danger': error != null,
          })}
        >
          {loading ? 'Loading...' : error ? error : FAQ.title}
        </header>
        {!loading && !error && (
          <div className={styles.description}>{FAQ.description}</div>
        )}
      </div>
    </div>
  );
});

FAQDetail.propTypes = propTypes;

export default FAQDetail;
