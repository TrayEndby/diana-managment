import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { TASK_ACTIONS } from 'constants/tasks';

const TaskList = ({ task, isSelected, onAction, onSelect }) => {
  let classNames = ['mb-2'];
  if (isSelected) {
    classNames.push('border-warning');
  }

  const { title, due_time, resource } = task;
  return (
    <Card
      className={classNames.join(' ')}
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        let dropdown = e.target.closest('.taskDropdown');
        if (!dropdown) {
          // when not click on the dropdown
          onSelect();
        }
      }}
    >
      <Card.Body>
        <Row>
          <Col>
            <h5>{title}</h5>
          </Col>
          <DropdownButton task={task} onAction={onAction} />
        </Row>
        {resource ? (
          <Row>
            <Col className="App-textOverflow">
              Video Link: &nbsp;
              <Link className="App-textOverflow" to={resource}>
                {resource}
              </Link>
            </Col>
          </Row>
        ) : (
          // for alignment with cards that has resource
          <Row>
            <Col>&nbsp;</Col>
          </Row>
        )}
        <Row>
          <Col>Due: {moment(due_time).format('YYYY-MM-DD')}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const DropdownButton = ({ task, onAction }) => {
  let firstAction = [];
  if (task.isToDo) {
    firstAction.push({
      key: TASK_ACTIONS.Start,
      name: 'Start Task',
    });
  } else if (task.isInProgress) {
    firstAction.push({
      key: TASK_ACTIONS.Complete,
      name: 'Mark Complete',
    });
  }
  const actions = [
    ...firstAction,
    {
      key: TASK_ACTIONS.Edit,
      name: 'Edit Task',
    },
    {
      key: TASK_ACTIONS.Delete,
      name: 'Delete Task',
    },
  ];
  return (
    <Dropdown className="taskDropdown">
      <Dropdown.Toggle size="sm"></Dropdown.Toggle>
      <Dropdown.Menu>
        {actions.map((action) => (
          <Dropdown.Item key={action.key} eventKey={action.key} as="li" onSelect={(eventKey) => onAction(eventKey)}>
            {action.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

TaskList.propTypes = {
  task: PropTypes.object,
  onSelect: PropTypes.func,
  onAction: PropTypes.func,
};

export default TaskList;
