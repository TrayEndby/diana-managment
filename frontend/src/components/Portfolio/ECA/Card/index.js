import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

import ECAItem from '../Item';
import AddECAModal from '../AddECAModal';
import { FormCard, AddButton } from '../../Layout';

import Tooltip from '../../../../util/Tooltip';

import userProfileListService from '../../../../service/UserProfileListService';
import ecaService from '../../../../service/ECAService';

const propTypes = {
  ECAs: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

/**
 * XXX TODO: limit the activities to no more than 10
 */
class ECACard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectedECA: null,
      loading: true,
      error: null,
    };
    this.ECAProgramsMap = new Map();
    this.CategoriesMap = new Map();
  }

  componentDidMount() {
    this.initialize();
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loading: false,
    });
  };

  initialize = async () => {
    try {
      this.setState({
        loading: true,
      });
      const promise1 = this.fetchPrograms();
      const promise2 = this.fetchCategories();
      await Promise.all([promise1, promise2]);
      this.setState({
        loading: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  fetchCategories = async () => {
    try {
      const categories = await ecaService.getCategories();
      const map = new Map();
      categories.forEach(({ id, name }) => {
        map.set(id, name);
      });
      this.CategoriesMap = map;
    } catch (e) {
      console.error(e); // it's fine if it errors out
    }
  };

  fetchPrograms = async () => {
    const ECAProgramsList = await userProfileListService.listID(19);
    const map = new Map();
    ECAProgramsList.forEach((program) => {
      map.set(program.id, program);
    });
    this.ECAProgramsMap = map;
  };

  toggleAddModal = (showAddModal, selectedECA) => {
    this.setState({
      showAddModal,
      selectedECA,
    });
  };

  handleCloseAddModal = () => {
    this.toggleAddModal(false, null);
  };

  handleAddNewECA = () => {
    this.toggleAddModal(true, null);
  };

  handleSelectECA = (ECA) => {
    this.toggleAddModal(true, ECA);
  };

  handleDeleteECA = async (id, index) => {
    try {
      await this.props.onDelete(id, index);
    } catch (e) {
      this.handleError(e);
    }
  };

  handleNewECACreated = (id, name) => {
    this.ECAProgramsMap.set(id, { id, name });
  };

  handleAddOrUpdate = (data) => {
    const { ECAs } = this.props;
    const { selectedECA } = this.state;
    if (selectedECA) {
      if (selectedECA.program_id !== data.program_id) {
        throw new Error('Cannot change existing program');
      }
    } else {
      const existingECAs = ECAs.filter(({ program_id }) => program_id === data.program_id);
      if (existingECAs.length) {
        throw new Error('Program already added');
      }
    }
    const ECA = {
      ...selectedECA,
      ...data,
    };
    this.props.onChange(ECA);
  };

  getProgramName = (ECA) => {
    if (!ECA) {
      return '';
    }
    const { program_id } = ECA;
    const program = this.ECAProgramsMap.get(program_id);
    return program ? program.name : '';
  };

  getCategoryName = (ECA) => {
    if (!ECA) {
      return '';
    }
    const { category_id } = ECA;
    return this.CategoriesMap.get(category_id) || '';
  };

  render() {
    const { error, loading, selectedECA, showAddModal } = this.state;
    const { ECAs } = this.props;

    return (
      <Card>
        <Card.Body>
          <p>What are your extracurricular activities?</p>
          <FormCard loading={loading} error={error}>
            <h5>Add up to 10 unique activities</h5>
            {ECAs.length >= 10 ? (
              <Tooltip title="Cannot add more than 10 activities">
                <div style={{ width: 'fit-content' }}>
                  <AddButton disabled>Add activity</AddButton>
                </div>
              </Tooltip>
            ) : (
              <AddButton onClick={this.handleAddNewECA}>Add activity</AddButton>
            )}
            <Row>
              {ECAs.map((ECA, index) => (
                <ECAItem
                  key={index}
                  ECA={ECA}
                  category={this.getCategoryName(ECA)}
                  name={this.getProgramName(ECA)}
                  onClick={() => this.handleSelectECA(ECA)}
                  onDelete={() => this.handleDeleteECA(ECA.id, index)}
                />
              ))}
            </Row>
          </FormCard>
        </Card.Body>
        <AddECAModal
          show={showAddModal}
          ECA={selectedECA}
          name={this.getProgramName(selectedECA)}
          onHide={this.handleCloseAddModal}
          onSave={this.handleAddOrUpdate}
          onAdd={this.handleNewECACreated}
        />
      </Card>
    );
  }
}

ECACard.propTypes = propTypes;

export default ECACard;
