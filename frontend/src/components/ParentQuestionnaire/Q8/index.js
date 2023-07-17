import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import DotStepBar from '../../../util/DotStepBar';
import IncomeLevel from '../Basic/IncomeLevel';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  incomeLevel: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onFinish: PropTypes.func,
};

class Q8 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };
    this.formRef = React.createRef();
  }

  saveData = async () => {
    await this.props.onSave();
  };

  render() {
    const { validated } = this.state;
    const { incomeLevel, onChange } = this.props;

    return (
      <Layout>
        <DotStepBar steps={[8, 0, 0]} />
        <LeftCard section={1}>What is your total household income?</LeftCard>
        <RightCard
          next="Go to question 9"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q7}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q9}
          onRedirect={this.saveData}
          save
        >
          <IncomeLevel ref={this.formRef} validated={validated} incomeLevel={incomeLevel} onChange={onChange} />
        </RightCard>
      </Layout>
    );
  }
}

Q8.propTypes = propTypes;

export default Q8;
