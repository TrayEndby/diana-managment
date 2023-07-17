import React from 'react';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Plus } from 'react-bootstrap-icons';

import Layout from '../Layout';
import TaskList from './List';
import TaskDetail from './Detail';
import AddTaskModal from './AddModal';
import DeleteTaskModal from './DeleteModal';

import ErrorDialog from 'util/ErrorDialog';
import taskService from 'service/TaskService';
import { TASK_ACTIONS } from 'constants/tasks';

/*
 * XXX TODO:
 * update successful message
 */
class TaskPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      selectedTask: null,
      error: null,
      showAddTaskModal: false,
      taskIdToDelete: null,
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  handlError(error) {
    console.error(error);
    this.setState({
      error: error.message,
    });
  }

  async fetchTasks() {
    try {
      const tasks = await taskService.list();
      this.setState({
        tasks,
        error: null,
      });
    } catch (e) {
      this.handlError(e);
    }
  }

  async completeTask(task) {
    try {
      let updatedTask = await taskService.completeTask(task);
      this.refreshTask(updatedTask);
    } catch (e) {
      this.handlError(e);
    }
  }

  async startTask(task) {
    try {
      let updatedTask = await taskService.startTask(task);
      this.refreshTask(updatedTask);
    } catch (e) {
      this.handlError(e);
    }
  }

  refreshTask(updatedTask) {
    let tasks = this.state.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    let selectedTask = this.state.selectedTask;
    if (selectedTask && selectedTask.id === updatedTask.id) {
      selectedTask = updatedTask;
    }
    this.setState({
      tasks,
      selectedTask,
      error: null,
    });
  }

  getToDoList() {
    return this.state.tasks.filter((task) => task.isToDo);
  }

  getInProgressList() {
    return this.state.tasks.filter((task) => task.isInProgress);
  }

  getCompleteList() {
    return this.state.tasks.filter((task) => task.isComplete);
  }

  toggleAddTaskModal(show) {
    this.setState({
      showAddTaskModal: show,
    });
  }

  onAddTask = () => {
    this.toggleAddTaskModal(false);
    this.fetchTasks();
  };

  toggleDelTaskModal(taskIdToDelete) {
    this.setState({
      taskIdToDelete,
    });
  }

  onDeleteTask = (taskId) => {
    this.toggleDelTaskModal(null);
    if (this.state.selectedTask && this.state.selectedTask.id === taskId) {
      // close task detail if the deleted one is open
      this.setState({
        selectedTask: null,
      });
    }
    this.fetchTasks();
  };

  onSelectTask = (task) => {
    this.setState({
      selectedTask: task,
    });
  };

  onTaskAction = (task, action) => {
    switch (action) {
      case TASK_ACTIONS.Edit:
        this.onSelectTask(task);
        break;
      case TASK_ACTIONS.Delete:
        this.toggleDelTaskModal(task.id);
        break;
      case TASK_ACTIONS.Complete:
        this.completeTask(task);
        break;
      case TASK_ACTIONS.Start:
        this.startTask(task);
        break;
      default:
        break;
    }
  };

  onUpdateTask = async (task, key, val) => {
    let updatedTask = {
      ...task,
      [key]: val,
    };
    try {
      await taskService.update(updatedTask);
      this.refreshTask(updatedTask);
    } catch (e) {
      this.handlError(e);
    }
  };

  render() {
    if (this.state.error) {
      return <ErrorDialog error={this.state.error}></ErrorDialog>;
    } else {
      const topBar = (
        <Col>
          <Button
            className="d-flex m-auto"
            onClick={() => this.toggleAddTaskModal(true)}
          >
            Add Task &nbsp;
            <Plus size={24} />
          </Button>
        </Col>
      );

      return (
        <Layout customTopBar={topBar}>
          <div
            className="d-flex flex-column flex-md-row overflow-auto"
            style={{ minHeight: '50%' }}
          >
            <TaskColumn
              title="To Do"
              tasks={this.getToDoList()}
              selectedTask={this.state.selectedTask}
              onSelectTask={this.onSelectTask}
              onTaskAction={this.onTaskAction}
            />
            <TaskColumn
              title="In Progress"
              tasks={this.getInProgressList()}
              selectedTask={this.state.selectedTask}
              onSelectTask={this.onSelectTask}
              onTaskAction={this.onTaskAction}
            />
            <CompleteTaskColumn
              title={'Complete'}
              tasks={this.getCompleteList()}
              selectedTask={this.state.selectedTask}
              onSelectTask={this.onSelectTask}
              onTaskAction={this.onTaskAction}
            />
          </div>
          {this.state.selectedTask ? (
            <TaskDetail
              style={{ minHeight: '40%' }}
              task={this.state.selectedTask}
              onAction={this.onTaskAction}
              onUpdate={this.onUpdateTask}
              onClose={() => this.onSelectTask(null)}
            />
          ) : null}
          <AddTaskModal
            show={this.state.showAddTaskModal}
            onSubmit={this.onAddTask}
            onClose={() => this.toggleAddTaskModal(false)}
          />
          <DeleteTaskModal
            taskId={this.state.taskIdToDelete}
            onSubmit={this.onDeleteTask}
            onClose={() => this.toggleDelTaskModal(null)}
          />
        </Layout>
      );
    }
  }
}

const CompleteTaskColumn = ({
  title,
  tasks,
  selectedTask,
  onSelectTask,
  onTaskAction,
}) => (
  <section className="h-100 col">
    <h6 className="text-center">{title}</h6>
    <div>
      {/* placeholder for alignment */}
      <h6>&nbsp;</h6>
      <div className="d-flex flex-column justify-content-between">
        {tasks.map((task) => (
          <TaskList
            key={task.id}
            task={task}
            isSelected={selectedTask && selectedTask.id === task.id}
            onAction={(action) => onTaskAction(task, action)}
            onSelect={() => onSelectTask(task)}
          ></TaskList>
        ))}
      </div>
    </div>
  </section>
);

const TaskColumn = ({
  title,
  tasks,
  selectedTask,
  onSelectTask,
  onTaskAction,
}) => {
  let overDue = [];
  let dueThisWeek = [];
  let others = [];
  tasks.forEach((task) => {
    if (task.isOverDue) {
      overDue.push(task);
    } else if (task.isDueThisWeek) {
      dueThisWeek.push(task);
    } else {
      others.push(task);
    }
  });
  let sections = [
    {
      tasks: overDue,
      title: <h6 className="bg-danger text-light">Over Due</h6>,
    },
    {
      tasks: dueThisWeek,
      title: <h6 className="bg-warning">Due this week</h6>,
    },
    {
      tasks: others,
      title: <h6>Future</h6>,
    },
  ];

  return (
    <section className="h-100 col-sm-4">
      <h6 className="text-center">{title}</h6>
      {sections.map((section, index) =>
        section.tasks.length ? (
          <div key={index}>
            {section.title}
            <div className="d-flex flex-column justify-content-between">
              {section.tasks.map((task) => (
                <TaskList
                  key={task.id}
                  task={task}
                  isSelected={selectedTask && selectedTask.id === task.id}
                  onAction={(action) => onTaskAction(task, action)}
                  onSelect={() => onSelectTask(task)}
                />
              ))}
            </div>
          </div>
        ) : null,
      )}
    </section>
  );
};

export default TaskPage;
