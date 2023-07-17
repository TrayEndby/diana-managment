import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

const propTypes = {
  listView: PropTypes.bool,
  first_generation_college: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

class CollegeGenerationProfile extends React.PureComponent {
  handleChange = (flag) => {
    this.props.onChange('first_generation_college', flag);
  };

  render() {
    const { first_generation_college, listView } = this.props;

    return listView ? (
      <ListView
        first_generation_college={first_generation_college}
        onChange={this.handleChange}
      />
    ) : (
      <FormView
        first_generation_college={first_generation_college}
        onChange={this.handleChange}
      />
    );
  }
}

const ListView = ({ first_generation_college, onChange }) => (
  <ListGroup>
    <ListGroup.Item
      action
      active={first_generation_college === true}
      onClick={() => onChange(true)}
    >
      Yes
    </ListGroup.Item>
    <ListGroup.Item
      action
      active={first_generation_college !== true}
      onClick={() => onChange(false)}
    >
      No
    </ListGroup.Item>
  </ListGroup>
);

const FormView = ({ first_generation_college, onChange }) => (
  <Form>
    <Form.Group controlId="user-profile-first_generation_college">
      <Form.Label>Are you a first-generation college student?</Form.Label>
      <Form.Control
        name="first_generation_college"
        as="select"
        value={first_generation_college ? 1 : 0}
        onChange={(e) => onChange(Boolean(+e.target.value))}
      >
        <option value={1}>Yes</option>
        <option value={0}>No</option>
      </Form.Control>
    </Form.Group>
  </Form>
);

CollegeGenerationProfile.propTypes = propTypes;

export default CollegeGenerationProfile;
