import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Download } from 'react-bootstrap-icons';
import styles from './style.module.scss';

const propTypes = {
  deck: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
  }).isRequired,
  isPrivate: PropTypes.bool,
};

const OfficeCard = ({ deck, isPrivate }) => {
  const { title, source, url, type } = deck;
  let embedURL = url;
  if (type === 2) {
    embedURL = `https://docs.google.com/gview?url=${url}&embedded=true`;
  }
  return (
    <div className={classNames('card', styles.deck)}>
      <div className={styles.top}>
        <iframe
          src={embedURL}
          title="Card"
          frameBorder="0"
          width="100%"
          height="569"
          allowFullScreen={true}
        ></iframe>
      </div>
      <div style={{ display: 'flex' }}>
        <div className={styles.noteDiv}>
          <h6>{title}</h6>
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

OfficeCard.propTypes = propTypes;

export default OfficeCard;
