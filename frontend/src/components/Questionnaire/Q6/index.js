import React from 'react';
import PropTypes from 'prop-types';

import CollegeGenerationProfile from '../Basic/CollegeGeneration';

import * as ROUTES from '../../../constants/routes';

import { Layout, LeftCard, RightCard } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';

const propTypes = {
  first_generation_college: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q6 extends React.PureComponent {
  handleGoToNext = async () => {
    await this.props.onSave();
  };

  render() {
    const { first_generation_college, onChange } = this.props;
    return (
      <Layout>
        <ProgressBar now={57} className="mb-3" />
        <LeftCard section={1}>Are you a first-generation college student?</LeftCard>
        <RightCard
          next="Go to question 7"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q5}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q7}
          onRedirect={this.handleGoToNext}
          save
        >
          <CollegeGenerationProfile first_generation_college={first_generation_college} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q6.propTypes = propTypes;

export default Q6;
