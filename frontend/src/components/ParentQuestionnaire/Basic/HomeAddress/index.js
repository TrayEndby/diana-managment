import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Form from 'react-bootstrap/Form';

import { FormCard } from '../../../Questionnaire/Layout';

import withForwardRef from 'util/HOC/withForwardRef';
import CountryListInput from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';

import style from './style.module.scss';

const propTypes = {
  validated: PropTypes.bool,
  gridView: PropTypes.bool,
  info: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

class HomeAddress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      validated: false,
    };
    this.formRef = React.createRef();
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
    });
  };

  handleChange = (event) => {
    this.props.onChange([event.target.name], event.target.value);
  };

  render() {
    const { innerRef, validated, gridView, info } = this.props;
    const { error } = this.state;
    const { mailingAdd, mailingCity, mailingZip, mailingState, mailingCountry } = info;
    return (
      <FormCard error={error}>
        <Form ref={innerRef} validated={validated} className={classNames({ [style.form]: gridView })}>
          <Form.Group className={style.first}>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="mailingAdd"
              placeholder="Enter your address"
              value={mailingAdd || ''}
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group className={style.secondLeft}>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="mailingCity"
              placeholder="Enter city"
              value={mailingCity || ''}
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group className={style.secondRight}>
            <Form.Label>ZIP code</Form.Label>
            <Form.Control
              type="text"
              name="mailingZip"
              placeholder="Enter ZIP code"
              value={mailingZip || ''}
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          <StateListInput
            label="State/Province"
            name="mailingState"
            value={mailingState || undefined}
            onChange={this.handleChange}
          />
          <CountryListInput
            className={style.thirdRight}
            label="Country"
            name="mailingCountry"
            value={mailingCountry}
            onChange={this.handleChange}
          />
        </Form>
      </FormCard>
    );
  }
}

HomeAddress.propTypes = propTypes;

export default withForwardRef(HomeAddress);
