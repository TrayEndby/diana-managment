import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import withForwardRef from 'util/HOC/withForwardRef';

import styles from '../../MyProfile/style.module.scss';

const propTypes = {
  validated: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class NameProfile extends React.PureComponent {
  handleFirstNameChange = (e) => {
    this.props.onChange('firstName', e.target.value);
  };

  handleLastNameChange = (e) => {
    this.props.onChange('lastName', e.target.value);
  };

  render() {
    const { firstName, lastName, validated, innerRef } = this.props;

    return (
      <Form
        ref={innerRef}
        validated={validated}
        className={styles.editProfileForm}
      >
        <Form.Group controlId="user-profile-firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            required
            name="firstName"
            value={firstName || ''}
            onChange={this.handleFirstNameChange}
            disabled={true}
          />
        </Form.Group>
        <Form.Group controlId="user-profile-lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            required
            name="lastName"
            value={lastName || ''}
            onChange={this.handleLastNameChange}
            disabled={true}
          />
        </Form.Group>
      </Form>
    );
  }
}

NameProfile.propTypes = propTypes;

export default withForwardRef(NameProfile);
