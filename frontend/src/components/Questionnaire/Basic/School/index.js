import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Form from 'react-bootstrap/Form';

import { FormCard } from '../../Layout';

import AddNameModal from 'util/AddNameModal';
import withForwardRef from 'util/HOC/withForwardRef';
import StateListInput from 'util/StateListInput';
import CountryListInput from 'util/CountryListInput';
import userProfileListService from 'service/UserProfileListService';
import Graduation from '../../Basic/Graduation';

import style from './style.module.scss';

const propTypes = {
  validated: PropTypes.bool,
  gridView: PropTypes.bool,
  schoolInfo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.any,
};

class SchoolProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      validated: false,
      showAddSchoolModal: false,
      highSchoolList: null,
      year: null,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const prevZip = this.getZipFromProps(prevProps);
    const zip = this.getZipFromProps(this.props);
    if (zip !== prevZip && String(zip).length >= 4) {
      this.fetchHighSchoolList(zip);
    }
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
    });
  };

  getZipFromProps = (props) => {
    return props ? props.schoolInfo.zip || undefined : undefined;
  };

  getData = async () => {
    try {
      this.setState({ loading: true });
      await this.fetchHighSchoolList(this.getZipFromProps(this.props));
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchHighSchoolList = async (zip) => {
    try {
      if (!zip) {
        return;
      }
      const highSchoolList = await userProfileListService.highSchoolInfo(zip);
      this.setState({ highSchoolList });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleChange = (event) => {
    this.props.onChange({
      [event.target.name]: event.target.value || undefined,
    });
  };

  handleHighSchoolChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      return;
    }
    if (value === 'add') {
      this.setState({
        showAddSchoolModal: true,
      });
      return;
    }
    const schoolID = Number(value);
    const schoolArray = this.state.highSchoolList.filter(
      ({ id }) => id === schoolID,
    );
    if (schoolArray.length === 0) {
      return;
    }
    const schoolName = schoolArray[0].name_title;
    this.props.onChange({
      school_id: schoolID,
      name: schoolName,
    });
  };

  handleAddSchool = (name) => {
    this.props.onChange({
      school_id: undefined,
      name,
    });
  };

  handleCloseAddSchoolModal = () => {
    this.setState({
      showAddSchoolModal: false,
    });
  };

  hasSchoolInList = (highSchoolList, school_id) => {
    if (!highSchoolList) {
      return false;
    }
    if (!school_id) {
      return false;
    }
    for (const { id } of highSchoolList) {
      if (id === school_id) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { innerRef, validated, gridView, schoolInfo } = this.props;
    const { loading, error, highSchoolList, showAddSchoolModal } = this.state;
    const { country, state, city, zip, school_id, name } = schoolInfo;
    const hasSchoolInList = this.hasSchoolInList(highSchoolList, school_id);
    return (
      <FormCard loading={loading} error={error}>
        <Form
          ref={innerRef}
          validated={validated}
          className={classNames(
            { [style.form]: gridView },
            style.editProfileForm,
          )}
        >
          <Form.Group className={style.thirdRight} controlId="highschool">
            <Form.Label>High school name</Form.Label>
            {!highSchoolList && (
              <Form.Control
                placeholder="Please fill in zip code first"
                disabled
              ></Form.Control>
            )}
            {highSchoolList && (
              <Form.Control
                as="select"
                value={hasSchoolInList ? school_id : name || ''}
                required
                onChange={this.handleHighSchoolChange}
              >
                <option value="">Choose from the list</option>
                <option value="add">Not found? Add your school</option>
                {!hasSchoolInList && name && (
                  <option value={name} style={{ display: 'none' }}>
                    {name}
                  </option>
                )}
                {highSchoolList.map(({ id, name_title }) => (
                  <option key={id} value={id}>
                    {name_title}
                  </option>
                ))}
              </Form.Control>
            )}
          </Form.Group>
          <Graduation onChange={this.handleChange} />
          <Form.Group className={style.secondRight}>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="Enter city"
              value={city || ''}
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group className={style.thirdLeft}>
            <Form.Label>ZIP code</Form.Label>
            <Form.Control
              type="text"
              name="zip"
              placeholder="Enter ZIP code"
              value={zip || ''}
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          <CountryListInput
            className={style.first}
            label="Country"
            name="country"
            value={country}
            onChange={this.handleChange}
          />
          <StateListInput
            className={style.secondLeft}
            label="State/Province"
            name="state"
            value={state || undefined}
            onChange={this.handleChange}
          />
        </Form>
        <AddNameModal
          show={showAddSchoolModal}
          title="Add school"
          onSubmit={this.handleAddSchool}
          onClose={this.handleCloseAddSchoolModal}
        />
      </FormCard>
    );
  }
}

SchoolProfile.propTypes = propTypes;

export default withForwardRef(SchoolProfile);
