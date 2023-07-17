import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Section from '../Section';

import CollegeImage from '../../../../assets/college.jpg';
import ListViewCard from '../../../../util/ListViewCard';

const propTypes = {
  colleges: PropTypes.array.isRequired,
};

const CollegeRec = ({ colleges }) => {
  const history = useHistory();
  if (!colleges || !colleges.length) {
    return null;
  }

  return (
    <Section title="Colleges">
      {colleges.map(({ id, image_link, searchUrl, name, city, state, country }) => {
        return (
          <ListViewCard key={id} title={name} img={image_link || CollegeImage} onClick={() => history.push(searchUrl)}>
            {city != null && state != null && <div className="App-textOverflow">{`${city}, ${state}`}</div>}
            {(city == null || state == null) && country != null && <div className="App-textOverflow">{country}</div>}
          </ListViewCard>
        );
      })}
    </Section>
  );
};

CollegeRec.propTypes = propTypes;

export default CollegeRec;
