import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SchoolProfile from '../../../Basic/School';

import style from '../../ReviewProfile/style.module.scss';

const propTypes = {
  schoolInfo: PropTypes.object.isRequired,
  setSchoolInfo: PropTypes.func.isRequired,
  markUnsaved: PropTypes.func.isRequired,
};

class HighSchoolCard extends React.Component {
  handleChange = (change) => {
    this.props.setSchoolInfo(change);
    this.props.markUnsaved('schoolInfoSaved', false);
  };

  render() {
    const { schoolInfo } = this.props;
    return (
      <>
        <h3
          className={`font-weight-bold mb-5 mt-4 ${classNames(style.subTitle)}`}
        >
          <span className={` ${classNames(style.subTitleSpan)}`}>
            High school information
          </span>
        </h3>
        <SchoolProfile
          schoolInfo={schoolInfo}
          year={schoolInfo.class}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

HighSchoolCard.propTypes = propTypes;

export default HighSchoolCard;
