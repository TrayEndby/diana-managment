import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import withForwardRef from 'util/HOC/withForwardRef';
import DateInput from 'util/DateInput';

const propTypes = {
  validated: PropTypes.bool,
  birthday: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class BirthdayProfile extends React.PureComponent {
  handleChange = (e) => {
    this.props.onChange('birthday', e.target.value);
  };

  render() {
    const { birthday, validated, innerRef } = this.props;

    return (
      <Form ref={innerRef} validated={validated}>
        <DateInput
          required
          controlId="user-profile-birthday"
          label="Birthday"
          name="birthday"
          value={birthday || ''}
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}

BirthdayProfile.propTypes = propTypes;

export default withForwardRef(BirthdayProfile);
