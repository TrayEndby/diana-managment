import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import AddNewECAModal from './AddNewECAModal';

import { getHoursPerWeek, getDateFromString, parseDateToString } from '../util';
import ErrorDialog from '../../../../util/ErrorDialog';
import ecaService from '../../../../service/ECAService';

const propTypes = {
  show: PropTypes.bool.isRequired,
  ECA: PropTypes.object,
  name: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

class AddECAModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingCategoryList: true,
      loadingTypeList: false,
      loadingProgramsList: false,
      showAddNewECAModal: false,
      ECACategoryList: [],
      ECATypesList: [],
      ECAProgramsList: [],
      data: {
        category_id: undefined,
        type_id: undefined,
        program_id: undefined,
      },
    };
  }

  componentDidMount() {
    this.fetchCategoryList();
  }

  componentDidUpdate(prevProps) {
    const { show, ECA } = this.props;
    if (!prevProps.show && show && ECA != null) {
      const { beginDate, endDate } = ECA;
      const data = {
        ...ECA,
        beginDate: parseDateToString(beginDate),
        endDate: parseDateToString(endDate),
      };
      this.setState({
        data,
      });
    }
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loadingCategoryList: false,
      loadingTypeList: false,
      loadingProgramsList: false,
    });
  };

  fetchCategoryList = async () => {
    try {
      this.setState({
        loadingCategoryList: true,
      });
      // const ECACategoryList = await userProfileListService.listID(9);
      const ECACategoryList = await ecaService.getCategories();
      this.setState({
        ECACategoryList,
        loadingCategoryList: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  fetchTypeList = async (category_id) => {
    if (!category_id) {
      this.setState({
        ECATypesList: [],
      });
    } else {
      try {
        this.setState({
          loadingTypeList: true,
        });
        // const ECATypesList = (await userProfileListService.categoryList(8, category_id)).nameIds || [];
        const ECATypesList = await ecaService.getOrganizationsByCategory(category_id);
        this.setState({
          ECATypesList,
          loadingTypeList: false,
        });
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  fetchProgramsList = async (type_id) => {
    if (!type_id) {
      this.setState({
        ECAProgramsList: [],
      });
    } else {
      try {
        this.setState({
          loadingProgramsList: true,
        });
        let ECAProgramsList = await ecaService.getProgramsByType(type_id);
        ECAProgramsList = ECAProgramsList.map(({ id, title }) => {
          return {
            id,
            name: title,
          };
        });
        ECAProgramsList = [{ id: 'add', name: 'Not found? Add your program' }, ...ECAProgramsList];
        this.setState({
          ECAProgramsList,
          loadingProgramsList: false,
        });
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  handleCategoryChange = (event) => {
    const category_id = event.target.value ? Number(event.target.value) : undefined;
    if (category_id !== this.state.data.category_id) {
      this.setState({
        data: {
          ...this.state.data,
          category_id,
          type_id: undefined,
          program_id: undefined,
        },
      });
      this.fetchTypeList(category_id);
    }
  };

  handleTypeChange = (event) => {
    const type_id = event.target.value ? Number(event.target.value) : undefined;
    if (type_id !== this.state.data.type_id) {
      this.setState({
        data: {
          ...this.state.data,
          type_id,
          program_id: undefined,
        },
      });
      this.fetchProgramsList(type_id);
    }
  };

  handleProgramChange = (event) => {
    const value = event.target.value;
    if (value === 'add') {
      this.setState({ showAddNewECAModal: true });
      return;
    }
    const program_id = value ? Number(value) : undefined;
    this.setState({
      data: {
        ...this.state.data,
        program_id,
      },
    });
  };

  handleHoursChange = (event) => {
    let val = event.target.value;
    if (val !== '') {
      val = val * 60; // store as minutes
    } else {
      val = undefined;
    }
    this.setState({
      data: {
        ...this.state.data,
        avgMinutesPerEvent: val,
      },
    });
  };

  handleDateChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleSubmit = (event) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        this.setState({ validated: true });
      } else {
        const { data } = this.state;
        const beginDate = getDateFromString(data.beginDate, 'Start date');
        const endDate = getDateFromString(data.endDate, 'End date');
        this.props.onSave({
          ...data,
          beginDate,
          endDate,
        });
        this.handleClose();
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  handleClose = () => {
    this.setState({
      validated: false,
      data: {},
      error: null,
    });
    this.props.onHide();
  };

  render() {
    const { show, ECA, name, onAdd } = this.props;
    const {
      data,
      validated,
      error,
      loadingCategoryList,
      loadingTypeList,
      loadingProgramsList,
      ECACategoryList,
      ECATypesList,
      ECAProgramsList,
      showAddNewECAModal,
    } = this.state;
    const { category_id, type_id, program_id, role, avgMinutesPerEvent, beginDate, endDate } = data;

    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add activity</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            {!ECA && (
              <Form.Group controlId="activity-category">
                <Form.Label>Category</Form.Label>
                <SelectForm
                  loading={loadingCategoryList}
                  value={category_id || ''}
                  title="Select category"
                  options={ECACategoryList}
                  onChange={this.handleCategoryChange}
                />
              </Form.Group>
            )}
            {!ECA && (
              <Form.Group controlId="activity-type">
                <Form.Label>Activity type</Form.Label>
                <SelectForm
                  loading={loadingTypeList}
                  value={type_id || ''}
                  title="Select type"
                  options={ECATypesList}
                  onChange={this.handleTypeChange}
                />
              </Form.Group>
            )}
            {!ECA && (
              <Form.Group controlId="activity-program">
                <Form.Label>Program name</Form.Label>
                <ErrorDialog
                  error={
                    !type_id || loadingProgramsList || ECAProgramsList.length
                      ? null
                      : 'No program in this category, please choose another category or skip this question'
                  }
                />
                <SelectForm
                  loading={loadingProgramsList}
                  value={program_id || ''}
                  title="Select program"
                  options={ECAProgramsList}
                  onChange={this.handleProgramChange}
                />
              </Form.Group>
            )}
            {ECA && (
              <Form.Group controlId="activity-program">
                <Form.Label>Program name</Form.Label>
                <Form.Control value={name} disabled />
              </Form.Group>
            )}
            <Form.Group controlId="activity-beginDate">
              <Form.Label>Start date (optional)</Form.Label>
              <Form.Control
                name="beginDate"
                value={beginDate || ''}
                placeholder="MM/YYYY"
                onChange={this.handleDateChange}
              />
            </Form.Group>
            <Form.Group controlId="activity-beginDate">
              <Form.Label>End date (optional)</Form.Label>
              <Form.Control
                name="endDate"
                value={endDate || ''}
                placeholder="MM/YYYY"
                onChange={this.handleDateChange}
              />
            </Form.Group>
            <Form.Group controlId="activity-hoursPerWeek">
              <Form.Label>Hours per week (optional)</Form.Label>
              <Form.Control
                name="hoursPerWeek"
                type="number"
                min="0"
                step="1"
                value={getHoursPerWeek(avgMinutesPerEvent)}
                onChange={this.handleHoursChange}
              />
            </Form.Group>
            <Form.Group controlId="activity-role">
              <Form.Label>Position (optional)</Form.Label>
              <Form.Control
                name="role"
                type="text"
                value={role || ''}
                placeholder="e.g. Baseball Captain..."
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button type="submit" className="float-right">
              Save
            </Button>
          </Form>
        </Modal.Body>
        <AddNewECAModal
          show={showAddNewECAModal}
          category={category_id}
          type={type_id}
          onSubmit={() => this.fetchProgramsList(type_id)} // update program list
          onAdd={onAdd}
          onClose={() => this.setState({ showAddNewECAModal: false })}
        />
      </Modal>
    );
  }
}

const SelectForm = ({ loading, value, title, options, onChange }) =>
  loading ? (
    <Form.Control value="Loading..." disabled />
  ) : (
    <Form.Control required as="select" value={value} onChange={onChange}>
      <option value="">{title}</option>
      {options.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Form.Control>
  );

AddECAModal.propTypes = propTypes;

export default AddECAModal;
