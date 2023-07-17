import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Accordion from 'util/Accordion';

import style from './style.module.scss';

const propTypes = {
  navBars: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      tabs: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

const SideBar = ({ navBars, onCloseSidebar }) => {
  const history = useHistory();

  const localPath = history.location.pathname;

  return (
    <div>
      {navBars.map((bar) => (
        <Accordion title={bar.title}>
          <Card.Body className={style.list}>
            {bar.tabs.map(({ name, path }) => (
              <Card.Text
                key={path}
                title={name}
                className={path === localPath ? style.selectedText : style.text}
                onClick={() => {
                  history.push(path);
                  onCloseSidebar();
                }}
              >
                {name}
              </Card.Text>
            ))}
          </Card.Body>
        </Accordion>
      ))}
    </div>
  );
}

SideBar.propTypes = propTypes;

export default React.memo(SideBar);
