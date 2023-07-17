import React from 'react';
import PropTypes from 'prop-types';

import EmailProfile from '../../../Basic/Email';
import NameProfile from '../../../Basic/Name';
import BirthdayProfile from '../../../Basic/Birthday';
import GenderProfile from '../../../Basic/Gender';
import HispanicProfile from '../../../Basic/Hispanic';
import RaceProfile from '../../../Basic/Race';
import CollegeGenerationProfile from '../../../Basic/CollegeGeneration';

import style from '../../../MyProfile/style.module.scss';

const propTypes = {
  basicInfo: PropTypes.object.isRequired,
  setBasicInfo: PropTypes.func.isRequired,
  markUnsaved: PropTypes.func.isRequired,
};

class DemographicsCard extends React.PureComponent {
  handleChange = (key, value) => {
    this.props.setBasicInfo(key, value);
    this.props.markUnsaved('basicInfoSaved', false);
  };

  render() {
    const { basicInfo } = this.props;
    const {
      email,
      lastName,
      firstName,
      birthday,
      gender,
      hispanic,
      race,
      first_generation_college,
    } = basicInfo;
    return (
      <div className={style.formContainer}>
        <NameProfile
          firstName={firstName}
          lastName={lastName}
          onChange={this.handleChange}
        />
        <EmailProfile email={email} />
        <GenderProfile gender={gender} onChange={this.handleChange} />
        <HispanicProfile hispanic={hispanic} onChange={this.handleChange} />
        <RaceProfile race={race} onChange={this.handleChange} />
        <BirthdayProfile birthday={birthday} onChange={this.handleChange} />
        <CollegeGenerationProfile
          first_generation_college={first_generation_college}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

DemographicsCard.propTypes = propTypes;

export default DemographicsCard;
