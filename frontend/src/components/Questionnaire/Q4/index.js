import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';
import HispanicProfile from '../Basic/Hispanic';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  hispanic: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q4 extends React.PureComponent {
  handleGoToNext = async () => {
    await this.props.onSave();
  };

  render() {
    const { hispanic, onChange } = this.props;
    return (
      <Layout>
        <ProgressBar now={43} className="mb-3" />
        <LeftCard section={1}>Are you of Hispanic, Latino, or Spanish origin?</LeftCard>
        <RightCard
          next="Go to question 5"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q3}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q5}
          onRedirect={this.handleGoToNext}
          save
        >
          <HispanicProfile hispanic={hispanic} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q4.propTypes = propTypes;

export default Q4;
