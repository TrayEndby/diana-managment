import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';

import style from './style.module.scss';

const propTypes = {
  majors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  ),
};

const MajorListView = ({ majors }) => {
  return (
    <>
      {majors.map(({ name, description }, index) => (
        <section key={index} className={style.section}>
          <h5 className="App-text-green">{name}:</h5>
          <Card>{description}</Card>
        </section>
      ))}
    </>
  );
};

MajorListView.propTypes = propTypes;

export default MajorListView;
