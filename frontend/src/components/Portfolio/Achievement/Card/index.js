import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

import AddModal from '../AddModal';
import { FormCard, AddButton, Item } from '../../Layout';

import Tooltip from '../../../../util/Tooltip';

const propTypes = {
  achievements: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

/**
 * XXX TODO: limit the achievements to no more than 10
 */
class AchievementCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectedAchievement: null,
      error: null,
    };
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
    });
  };

  toggleAddModal = (showAddModal, selectedAchievement) => {
    this.setState({
      showAddModal,
      selectedAchievement,
    });
  };

  handleCloseAddModal = () => {
    this.toggleAddModal(false, null);
  };

  handleAddNewAchievement = () => {
    this.toggleAddModal(true, null);
  };

  handleSelectAchievement = (achievement) => {
    this.toggleAddModal(true, achievement);
  };

  handleDeleteAchievement = async (id, index) => {
    try {
      await this.props.onDelete(id, index);
    } catch (e) {
      this.handleError(e);
    }
  };

  handleAddOrUpdate = (data) => {
    const { selectedAchievement } = this.state;
    this.props.onChange({
      ...selectedAchievement,
      ...data,
    });
  };

  render() {
    const { error, selectedAchievement, showAddModal } = this.state;
    const { achievements } = this.props;
    return (
      <Card>
        <Card.Body>
          <p>What are your achievements?</p>
          <FormCard error={error}>
            <h5>Add up to 10 unique achievements</h5>
            {achievements.length >= 10 ? (
              <Tooltip title="Cannot add more than 10 achievements">
                <div style={{ width: 'fit-content' }}>
                  <AddButton disabled>Add achievement</AddButton>
                </div>
              </Tooltip>
            ) : (
              <AddButton onClick={this.handleAddNewAchievement}>Add achievement</AddButton>
            )}
            <Row>
              {achievements.map((achievementInfo, index) => (
                <Item
                  key={index}
                  style={{ width: '350px' }}
                  onClick={() => this.handleSelectAchievement(achievementInfo)}
                  onDelete={() => this.handleDeleteAchievement(achievementInfo.id, index)}
                >
                  Achivement: {achievementInfo.description}
                </Item>
              ))}
            </Row>
          </FormCard>
        </Card.Body>
        <AddModal
          show={showAddModal}
          achievementInfo={selectedAchievement}
          onHide={this.handleCloseAddModal}
          onSave={this.handleAddOrUpdate}
        />
      </Card>
    );
  }
}

AchievementCard.propTypes = propTypes;

export default AchievementCard;
