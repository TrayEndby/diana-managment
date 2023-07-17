import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import DotStepBar from '../../../util/DotStepBar';
import HomeAddress from '../Basic/HomeAddress';

import * as ROUTES from '../../../constants/routes';

import style from './style.module.scss';

const propTypes = {
  onChange: PropTypes.func.isRequired,
};

class Q7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };
    this.formRef = React.createRef();
  }

  saveData = async () => {
    if (this.formRef.current.checkValidity() === false) {
      this.setState({ validated: true });
      return false;
    } else {
      this.setState({ validated: false });
      await this.props.onSave();
    }
  };

  render() {
    const { validated } = this.state;
    const { mailingAdd, mailingCity, mailingZip, mailingState, mailingCountry, onChange } = this.props;
    const info = { mailingAdd, mailingCity, mailingZip, mailingState, mailingCountry };
    return (
      <Layout>
        <DotStepBar steps={[7, 0, 0]} />
        <LeftCard
          section={1}
          children={
            <span>
              What is your home address?
            </span>
          }
        />
        <RightCard
          classes={style.card}
          next="Go to question 8"
          linkToPrevPage={ROUTES.PARENT_QUESTIONNAIRE_Q6}
          linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q8}
          onRedirect={this.saveData}
          save
        >
          <HomeAddress ref={this.formRef} validated={validated} info={info} onChange={onChange} gridView />
        </RightCard>
      </Layout>
    );
  }
}

Q7.propTypes = propTypes;

export default Q7;
