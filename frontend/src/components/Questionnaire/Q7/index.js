import React from 'react';
import PropTypes from 'prop-types';

import { Layout, LeftCard, RightCard } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SchoolProfile from '../Basic/School';

import * as ROUTES from '../../../constants/routes';

import style from './style.module.scss';

const propTypes = {
  schoolInfo: PropTypes.object.isRequired,
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
    const { schoolInfo, onChange } = this.props;
    return (
      <Layout>
        <ProgressBar now={71} className="mb-3" />
        <LeftCard
          section={1}
          children={
            <span>
              Where do you attend{' '}
              <i>
                <b>High School</b>
              </i>
              ?
            </span>
          }
        />
        <RightCard
          classes={style.card}
          next="Go to question 8"
          linkToPrevPage={ROUTES.QUESTIONNAIRE_Q6}
          linkToNextPage={ROUTES.QUESTIONNAIRE_Q8}
          onRedirect={this.saveData}
          save
        >
          <SchoolProfile ref={this.formRef} validated={validated} schoolInfo={schoolInfo} onChange={onChange} gridView />
        </RightCard>
      </Layout>
    );
  }
}

Q7.propTypes = propTypes;

export default Q7;
