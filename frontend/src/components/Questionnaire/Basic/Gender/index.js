import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import { FormCard } from '../../Layout';
import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  listView: PropTypes.bool,
  gender: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

class GenderProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      genderList: [],
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
      const genderList = await userProfileListService.listID(5);
      this.setState({
        genderList,
        error: null,
      });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleChange = (gender) => {
    this.props.onChange('gender', gender);
  };

  render() {
    const { error, loading, genderList } = this.state;
    const { gender, listView } = this.props;

    return (
      <FormCard loading={loading} error={error}>
        {listView ? (
          <GenderList
            genderList={genderList}
            gender={gender}
            onChange={this.handleChange}
          />
        ) : (
          <GenderForm
            genderList={genderList}
            gender={gender}
            onChange={this.handleChange}
          />
        )}
      </FormCard>
    );
  }
}

const GenderList = ({ genderList, gender, onChange }) => (
  <ListGroup>
    {genderList.map(({ id, name }) => (
      <ListGroup.Item
        key={id}
        action
        active={gender === name}
        onClick={() => onChange(name)}
      >
        {name}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

const GenderForm = ({ genderList, gender, onChange }) => (
  <Form>
    <Form.Group controlId="user-profile-gender">
      <Form.Label className="text-left">Gender</Form.Label>
      <Form.Control
        as="select"
        name="gender"
        value={gender}
        onChange={(e) => onChange(e.target.value)}
      >
        {genderList.map(({ id, name }) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  </Form>
);

GenderProfile.propTypes = propTypes;

export default GenderProfile;
