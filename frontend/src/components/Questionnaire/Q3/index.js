import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';
import GenderProfile from '../Basic/Gender';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  gender: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q3 extends React.PureComponent {
  handleGoToNext = async () => {
    const { gender, onSave } = this.props;
    if (!gender) {
      throw new Error('Please select from the list');
    }
    await onSave();
  };

  render() {
    const { gender, onChange } = this.props;
    return (
      <Layout>
        <ProgressBar now={29} className="mb-3" />
        <LeftCard section={1}>To which gender do you most identify?</LeftCard>
        <RightCard
          next="Go to question 4"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q2}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q4}
          onRedirect={this.handleGoToNext}
          save
        >
          <GenderProfile gender={gender} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q3.propTypes = propTypes;

export default Q3;
