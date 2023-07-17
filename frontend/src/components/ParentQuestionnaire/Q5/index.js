import React from 'react';
import PropTypes from 'prop-types';

import DotStepBar from '../../../util/DotStepBar';

import { Layout, LeftCard, RightCard } from 'components/Questionnaire/Layout';
import HispanicProfile from 'components/Questionnaire/Basic/Hispanic';

import * as ROUTES from 'constants/routes';

const propTypes = {
  hispanic: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q5 extends React.PureComponent {
  handleGoToNext = async () => {
    await this.props.onSave();
  };

  render() {
    const { hispanic, onChange } = this.props;
    return (
      <Layout>
        <DotStepBar steps={[5, 0, 0]} />
        <LeftCard section={1}>Are you of Hispanic, Latino, or Spanish origin?</LeftCard>
        <RightCard
          next="Go to question 5"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q4}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q6}
          onRedirect={this.handleGoToNext}
          save
        >
          <HispanicProfile hispanic={hispanic} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q5.propTypes = propTypes;

export default Q5;
