import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import withForwardRef from '../../../../util/HOC/withForwardRef';

const propTypes = {
  validated: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class NameSurname extends React.PureComponent {
  handleChange = (e) => {
    this.props.onChange(e.target.name, e.target.value);
  };

  render() {
    const { firstName, lastName, validated, innerRef } = this.props;
    const formStyle = { width: 'fit-content', alignSelf: 'center' };

    return (
      <Form ref={innerRef} validated={validated} style={formStyle} className="text-left">
        <Form.Control value={firstName || ''} name="firstName" onChange={this.handleChange} placeholder="First name" />
        <Form.Control value={lastName || ''} name="lastName" onChange={this.handleChange} placeholder="Last name" />
      </Form>
    );
  }
}

NameSurname.propTypes = propTypes;

export default withForwardRef(NameSurname);
