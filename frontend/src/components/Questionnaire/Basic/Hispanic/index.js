import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

const propTypes = {
  listView: PropTypes.bool,
  hispanic: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

class HispanicProfile extends React.PureComponent {
  handleChange = (flag) => {
    this.props.onChange('hispanic', flag);
  };

  render() {
    const { hispanic, listView } = this.props;

    return listView ? (
      <HispanicList hispanic={hispanic} onChange={this.handleChange} />
    ) : (
      <HispanicForm hispanic={hispanic} onChange={this.handleChange} />
    );
  }
}

const HispanicList = ({ hispanic, onChange }) => (
  <ListGroup>
    <ListGroup.Item
      action
      active={hispanic === true}
      onClick={() => onChange(true)}
    >
      Yes
    </ListGroup.Item>
    <ListGroup.Item
      action
      active={hispanic !== true}
      onClick={() => onChange(false)}
    >
      No
    </ListGroup.Item>
  </ListGroup>
);

const HispanicForm = ({ hispanic, onChange }) => (
  <Form>
    <Form.Group controlId="user-profile-hispanic">
      <Form.Label>Hispanic, Latino, or Spanish</Form.Label>
      <Form.Control
        name="hispanic"
        as="select"
        value={hispanic ? 1 : 0}
        onChange={(e) => onChange(Boolean(+e.target.value))}
      >
        <option value={1}>Yes</option>
        <option value={0}>No</option>
      </Form.Control>
    </Form.Group>
  </Form>
);

HispanicProfile.propTypes = propTypes;

export default HispanicProfile;
