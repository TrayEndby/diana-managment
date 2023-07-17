import React from 'react';
import PropTypes from 'prop-types';

import Picture from '../../../util/Picture';
import style from './style.module.scss';

const propTypes = {
  id: PropTypes.number,
};

const ProjectPicture = ({ id }) => {
  return (
    <div className={style.image}>
      <Picture id={id} customAlt="No Project Image" style={{ maxHeight: '100%', objectFit: 'cover' }} />
    </div>
  )
};

ProjectPicture.propTypes = propTypes;

export default React.memo(ProjectPicture);
