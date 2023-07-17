import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Download } from 'react-bootstrap-icons';
import styles from './style.module.scss';
import './style.scss';

const propTypes = {
  deck: PropTypes.shape({
    title: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
  }).isRequired,
  isPrivate: PropTypes.bool,
};

const SalesDeckCard = ({ deck, isPrivate }) => {
  const { title, source, url } = deck;
  return (
    <div className={classNames('card', styles.deck)}>
      <div className={styles.top}>
        <iframe
          src={url}
          title="SlideShow"
          frameBorder="0"
          width="100%"
          height="569"
          allowFullScreen={true}
        ></iframe>
      </div>
      <div style={{ display: 'flex' }}>
        <div className={styles.noteDiv}>
          <h5>{title}</h5>
          <div className="App-textOverflow p-0 mb-1">{source}</div>
        </div>
        {!isPrivate && (
          <div className={styles.downloadDiv}>
            <a href={url} download target="_blank" rel="noopener noreferrer">
              <Download className={styles.downloadSvg} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

SalesDeckCard.propTypes = propTypes;

export default SalesDeckCard;
