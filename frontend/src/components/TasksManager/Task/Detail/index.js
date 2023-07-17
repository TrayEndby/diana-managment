import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from 'react-router-dom';

import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import CloseButton from 'util/CloseButton';
import { TASK_ACTIONS } from 'constants/tasks';

const TaskDetail = ({ style, task, onAction, onUpdate, onClose }) => {
  let { title, resource, due_time, isToDo, isInProgress } = task;
  let initialNotes = task.notes || "";
  let [notes, updateNotes] = useState(initialNotes);
  let firstAction = null;
  if (isToDo) {
    firstAction = {
      "text": "Start Task",
      "onClick": () => onAction(task, TASK_ACTIONS.Start)
    };
  } else if (isInProgress) {
    firstAction = {
      "text": "Mark Complete",
      "onClick": () => onAction(task, TASK_ACTIONS.Complete)
    };
  }
  return (
    <Card style={style} className="col mt-2 p-0 rounded-0">
      <Card.Header className="row m-0">
        <h5 className="text-center col-lg">
          {title}
        </h5>
        <TaskButton
          disabled={initialNotes === notes}
          onClick={() => onUpdate(task, "notes", notes)}
        >
          Save
        </TaskButton>
        {firstAction &&
        <TaskButton onClick={firstAction.onClick}>
          {firstAction.text}
        </TaskButton>
        }
        <TaskButton
          variant="outline-danger"
          onClick={() => onAction(task, TASK_ACTIONS.Delete)}
        >
          Delete Task
        </TaskButton>
        <CloseButton onClick={onClose} dark></CloseButton>
      </Card.Header>
      <Card.Body className="d-flex flex-column py-1">
        <div>Due: {moment(due_time).format("YYYY/DD/MM")}</div>
        {resource &&
        <div className="App-textOverflow">
          Video Link:&nbsp;
          <Link className="App-textOverflow" to={resource}>
            {resource}
          </Link>
        </div>
        }
        <div>Updated Notes:</div>
        <textarea
          className="col w-100 border-1 p-1"
          placeholder="Add Notes"
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
        ></textarea>
      </Card.Body>
    </Card>
  )
};

const TaskButton = ({ children, variant, disabled, onClick }) => (
  <Button
    size="sm"
    variant={variant || "outline-primary"}
    className="mx-1 float-right"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </Button>
)

TaskDetail.propTypes = {
  style: PropTypes.any,
  task: PropTypes.object,
  onAction: PropTypes.func,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func
};

export default TaskDetail;