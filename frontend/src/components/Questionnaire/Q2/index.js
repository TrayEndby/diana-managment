import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ProgressBar from 'react-bootstrap/ProgressBar';

import { Layout, LeftCard, RightCard } from '../Layout';
import BirthdayProfile from '../Basic/Birthday';
import NameProfile from '../Basic/Name';
import EmailProfile from '../Basic/Email';

import * as ROUTES from 'constants/routes';

const propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  birthday: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

class Q2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameValidated: false,
      birthdayValidated: false,
    };
    this.birthdayFormRef = React.createRef();
    this.nameFormRef = React.createRef();
  }

  handleGoToNext = async () => {
    let invalid = false;
    if (this.birthdayFormRef.current.checkValidity() === false) {
      invalid = true;
      this.setState({ birthdayValidated: true });
    } else {
      this.setState({ birthdayValidated: false });
    }

    if (this.nameFormRef.current.checkValidity() === false) {
      invalid = true;
      this.setState({ nameValidated: true });
    } else {
      this.setState({ nameValidated: false });
    }

    if (invalid) {
      return false;
    } else {
      const { birthday, onChange, onSave } = this.props;
      if (!moment(birthday).isValid()) {
        throw new Error('Invalid birthday format');
      }
      onChange('birthday', moment(birthday).format('YYYY-MM-DD'));
      await onSave();
      return true;
    }
  };

  render() {
    const { nameValidated, birthdayValidated } = this.state;
    const { firstName, lastName, email, birthday, onChange } = this.props;

    return (
      <Layout>
        <ProgressBar now={14} className="mb-3" />
        <LeftCard section={1}>What's your basic information?</LeftCard>
        <RightCard
          next="Go to question 3"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q1}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q3}
          onRedirect={this.handleGoToNext}
          save
        >
          <EmailProfile email={email} />
          <NameProfile
            ref={this.nameFormRef}
            validated={nameValidated}
            firstName={firstName}
            lastName={lastName}
            onChange={onChange}
          />
          <BirthdayProfile
            ref={this.birthdayFormRef}
            validated={birthdayValidated}
            birthday={birthday}
            onChange={onChange}
          />
        </RightCard>
      </Layout>
    );
  }
}

Q2.propTypes = propTypes;

export default Q2;
