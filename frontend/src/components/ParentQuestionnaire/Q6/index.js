import React from 'react';
import PropTypes from 'prop-types';

import DotStepBar from '../../../util/DotStepBar';

import { Layout, LeftCard, RightCard } from 'components/Questionnaire/Layout';
import RaceProfile from 'components/Questionnaire/Basic/Race';

import * as ROUTES from 'constants/routes';


const propTypes = {
  race: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q6 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      raceList: [],
      error: null,
      loading: true,
    };
  }

  handleGoToNext = async () => {
    if (this.props.race) {
      //TODO: add a saving state message
      await this.props.onSave();
    } else {
      throw new Error('Please select from the list');
    }
  };

  render() {
    const { race, onChange } = this.props;
    return (
      <Layout>
        <DotStepBar steps={[6, 0, 0]} />
        <LeftCard section={1}>How would you describe yourself?</LeftCard>
        <RightCard
          next="Go to question 6"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q5}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q7}
          onRedirect={this.handleGoToNext}
          save
        >
          <RaceProfile race={race} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q6.propTypes = propTypes;

export default Q6;
