import React from 'react';
import PropTypes from 'prop-types';

import DotStepBar from '../../../util/DotStepBar';

import { Layout, LeftCard, RightCard } from 'components/Questionnaire/Layout';
import GenderProfile from 'components/Questionnaire/Basic/Gender';

import * as ROUTES from 'constants/routes';

const propTypes = {
  gender: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q4 extends React.PureComponent {
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
        <DotStepBar steps={[4, 0, 0]} />
        <LeftCard section={1}>To which gender do you most identify?</LeftCard>
        <RightCard
          next="Go to question 5"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q3}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q5}
          onRedirect={this.handleGoToNext}
          save
        >
          <GenderProfile gender={gender} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q4.propTypes = propTypes;

export default Q4;
