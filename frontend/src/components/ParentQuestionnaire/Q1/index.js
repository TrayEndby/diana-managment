import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import NameSurname from '../Basic/NameSurname';

import DotStepBar from '../../../util/DotStepBar';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };
    this.formRef = React.createRef();
  }

  handleGoToNext = async () => {
    const { firstName, lastName, onSave } = this.props;
    if (!firstName) {
      throw new Error('Please enter first name');
    }
    if (!lastName) {
      throw new Error('Please enter last name');
    }
    await onSave();
  };

  render() {
    const { validated } = this.state;
    const { firstName, lastName, onChange } = this.props;

    return (
      <Layout>
        <DotStepBar steps={[1, 0, 0]} />
        <LeftCard section={1}>Please enter your first and last name?</LeftCard>
        <RightCard
          next="Go to question 2"
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q2}
          onRedirect={this.handleGoToNext}
          save
        >
          <NameSurname ref={this.formRef} validated={validated} firstName={firstName} lastName={lastName} onChange={onChange} />
        </RightCard>
      </Layout>
    );
  }
}

Q1.propTypes = propTypes;

export default Q1;
