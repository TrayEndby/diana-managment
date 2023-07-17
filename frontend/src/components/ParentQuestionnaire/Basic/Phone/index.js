import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import withForwardRef from 'util/HOC/withForwardRef';
import PhoneInput from 'util/PhoneInput/old';

const propTypes = {
  validated: PropTypes.bool,
  phone: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class Phone extends React.PureComponent {
  handleChange = (e) => {
    this.props.onChange('phone', e.target.value);
  };

  render() {
    const { phone, validated, innerRef } = this.props;
    const formStyle = { width: 'fit-content', alignSelf: 'center' };

    return (
      <Form ref={innerRef} validated={validated} style={formStyle} className="text-left">
        <PhoneInput controlId="user-profile-phone" name="phone" value={phone || ''} onChange={this.handleChange} />
      </Form>
    );
  }
}

Phone.propTypes = propTypes;

export default withForwardRef(Phone);
