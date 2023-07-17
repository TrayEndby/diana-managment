import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import withWindowDimensions from 'util/withWindowDimensions';
import astronaut from 'assets/svg/Astronaut_no_flag.svg';
import Markdown from 'components/Markdown';
import Legend from '../Legends/Legend';

import styles from './style.module.scss';

const propTypes = {
  howToDos: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Astronaut = React.memo(
  withWindowDimensions(({ howToDos, show, onClose }) => {
    const [first, second] = howToDos;
    const isLoading = first == null && second == null;

    return (
      <div className="astronaut" data-prevent-scroll-propogation>
        <img src={astronaut} alt="astronaut"></img>
        {show && (
          <div className="message">
            <div className="message-content">
              <div className={styles.title}>HOW TO DO?</div>
              {isLoading && <Markdown source="Loading.." />}
              {!isLoading && (
                <Content message={first[0]} title={first[1]} color={first[2]} />
              )}
              {!isLoading && second != null && (
                <Content
                  message={second[0]}
                  title={second[1]}
                  color={second[2]}
                />
              )}
            </div>
            <Button className="message-submit" onClick={onClose}>
              Got it
            </Button>
          </div>
        )}
      </div>
    );
  }),
);

const Content = ({ message, title, color }) => {
  return (
    <div>
      <div className={styles.row}>
        <Legend color={color} />
        <div>{title}</div>
      </div>
      <Markdown source={message} />
    </div>
  );
};

Astronaut.propTypes = propTypes;

export default Astronaut;
