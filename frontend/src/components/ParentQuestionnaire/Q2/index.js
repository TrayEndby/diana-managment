import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import DotStepBar from '../../../util/DotStepBar';
import Phone from '../Basic/Phone';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  phone: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };
    this.formRef = React.createRef();
  }

  handleGoToNext = async () => {
    const { phone, onSave } = this.props;
    if (!phone) {
      throw new Error('Please enter phone number');
    }
    await onSave();
  };

  render() {
    const { validated } = this.state;
    const { phone, onChange } = this.props;

    return (
      <Layout>
        <DotStepBar steps={[2, 0, 0]} />
        <LeftCard section={1}>What is your phone number?</LeftCard>
        <RightCard
          next="Go to question 3"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q1}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q3}
          onRedirect={this.handleGoToNext}
          save
        >
          <Phone ref={this.formRef} validated={validated} phone={phone} onChange={onChange} />
        </RightCard>
      </Layout>
    );
  }
}

Q2.propTypes = propTypes;

export default Q2;
