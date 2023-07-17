import React from 'react';
import PropTypes from 'prop-types';

import ProgressBar from 'react-bootstrap/ProgressBar';

import Graduation from '../Basic/Graduation';
import { Layout, LeftCard, RightCard } from '../Layout';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  year: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

class Q8 extends React.Component {
  getRecentYears = () => {
    const startYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  saveData = async () => {
    if (!this.props.year) {
      throw new Error('Please select a year');
    } else {
      await this.props.onSave();
      this.props.onFinish();
    }
  };

  render() {
    const { year, onChange } = this.props;
    return (
      <Layout>
        <ProgressBar now={100} className="mb-3" />
        <LeftCard section={1}>In what year do you graduate high school?</LeftCard>
        <RightCard
          next="Finish"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q7}
          linkToNextPage={ROUTES.HOME}
          onRedirect={this.saveData}
          save
        >
          <Graduation year={year} onChange={onChange} />
        </RightCard>
      </Layout>
    );
  }
}

Q8.propTypes = propTypes;

export default Q8;
