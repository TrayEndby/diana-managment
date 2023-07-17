import React from 'react';
import PropTypes from 'prop-types';

import RaceProfile from '../Basic/Race';

import * as ROUTES from '../../../constants/routes';

import { Layout, LeftCard, RightCard } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';

const propTypes = {
  race: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q5 extends React.PureComponent {
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
        <ProgressBar now={57} className="mb-3" />
        <LeftCard section={1}>How would you describe yourself?</LeftCard>
        <RightCard
          next="Go to question 6"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q4}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q6}
          onRedirect={this.handleGoToNext}
          save
        >
          <RaceProfile race={race} onChange={onChange} listView />
        </RightCard>
      </Layout>
    );
  }
}

Q5.propTypes = propTypes;

export default Q5;
