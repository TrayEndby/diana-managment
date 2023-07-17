import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import { FormCard } from '../../Layout';
import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  listView: PropTypes.bool,
  race: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class RaceProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      raceList: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  handleError = (e) => {
    console.error(e);
    this.setState({ error: e.message });
  };

  getData = async () => {
    try {
      const raceList = await userProfileListService.listID(4);
      this.setState({
        raceList,
        loading: false,
        error: null,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleChange = (name) => {
    this.props.onChange('race', name);
  };

  render() {
    const { error, loading, raceList } = this.state;
    const { race, listView } = this.props;

    return (
      <FormCard loading={loading} error={error}>
        {listView ? (
          <RaceList
            raceList={raceList}
            race={race}
            onChange={this.handleChange}
          />
        ) : (
          <RaceForm
            raceList={raceList}
            race={race}
            onChange={this.handleChange}
          />
        )}
      </FormCard>
    );
  }
}

const RaceList = ({ raceList, race, onChange }) => (
  <ListGroup>
    {raceList.map(({ id, name }) => (
      <ListGroup.Item
        action
        onClick={() => onChange(name)}
        key={id}
        active={name === race}
      >
        {name}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

const RaceForm = ({ raceList, race, onChange }) => (
  <Form>
    <Form.Group controlId="user-profile-race">
      <Form.Label>Race</Form.Label>
      <Form.Control
        name="race"
        as="select"
        value={race || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {raceList.map(({ id, name }) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  </Form>
);

RaceProfile.propTypes = propTypes;

export default RaceProfile;
