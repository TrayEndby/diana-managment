import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SearchBar from 'util/SearchBar';
import styles from './style.module.scss';

const propTypes = {
  FAQs: PropTypes.array.isRequired,
  showDescription: PropTypes.bool.isRequired,
  searchKey: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

const FAQsList = ({
  FAQs,
  showDescription,
  searchKey,
  loading,
  onClick,
  onSearch,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        Help
        <SearchBar
          title="Search Help"
          className={styles.searchBar}
          search={searchKey}
          onSubmit={onSearch}
        />
      </div>
      <div className="divider"></div>
      <div className={styles.faqs}>
        {loading && 'Loading...'}
        {!loading &&
          FAQs.map((faq) => (
            <div
              key={faq.id}
              className={cn('App-clickable', styles.row)}
              onClick={() => onClick(faq.id)}
            >
              <div
                className={cn({
                  [styles.highlight]: showDescription,
                })}
              >
                {faq.title}
              </div>
              {showDescription && (
                <div className={styles.description}>{faq.description}</div>
              )}
            </div>
          ))}
        {!loading && FAQs.length === 0 && showDescription && (
          <div className={styles.row}>No search results</div>
        )}
      </div>
    </div>
  );
};

FAQsList.propTypes = propTypes;

export default FAQsList;
