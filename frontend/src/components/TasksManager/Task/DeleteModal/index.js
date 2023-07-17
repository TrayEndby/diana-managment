import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmDialog from 'util/ConfirmDialog';
import ErrorDialog from 'util/ErrorDialog';
import taskService from 'service/TaskService';

class DeleteTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleSubmit = async () => {
    this.setState({
      error: null
    });

    try {
      await taskService.delete(this.props.taskId);
      this.props.onSubmit(this.props.taskId);
    } catch (e) {
      console.error(e);
      this.setState({
          error: e.message
      });
    }
  }

  handleClose = () => {
    this.setState({
      error: null
    });
    this.props.onClose();
  }

  render() {
    let show = this.props.taskId != null;
    return (
      <ConfirmDialog
        show={show}
        title="Delete Task"
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <ErrorDialog error={this.state.error}></ErrorDialog>
        Are you sure you want to delete the task?
      </ConfirmDialog>
    );
  }
}

DeleteTaskModal.propTypes = {
  taskId: PropTypes.number,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

export default DeleteTaskModal;